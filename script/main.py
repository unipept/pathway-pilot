import argparse
import requests
import json
import pandas as pd
from collections import defaultdict


parser = argparse.ArgumentParser()

parser.add_argument('--PeptidesFile', type = str, required = True, help = 'path to txt file with one petide per line')
parser.add_argument('--out', type = str, required = True, help = 'output path')

args = parser.parse_args()

def readInput(file_path):
  """
    Read input file with peptides
    :param file_path: text file with peptides separated by new lines
    :return: list of peptides
    """
  with open(file_path) as f:
    lines = [l.rstrip() for l in f.readlines()]
    return lines



def PostInfoFromUnipept(peptide_list,chunksize=100):#, out_file):
    """
    Send all requests, get for each peptide the phylum, family, genus and collection of EC-numbers
    :param peptide_list: list of peptides to query in Unipept
    :param result_file: json file with Unipept info (phylum, family, genus and collection of EC-numbers)
    :return: list of json objects (Unipept Response)
    """
    Listofpeptides = [peptide_list[i:i + chunksize] for i in range(0, len(peptides), chunksize)]
    Allrequests = []
    for peptide_list in Listofpeptides:
        url = "http://api.unipept.ugent.be/api/v2/peptinfo.json?"
        for peptide in peptide_list:
            url = url + "input[]={}&".format(peptide)
      
        request = requests.post(url,headers={'content-type':'application/json'})
        requestlist = json.loads(request.text)
        Allrequests.extend(requestlist)
      
        
    return Allrequests                      


def RearrangeUnipeptResponse(UnipeptResponse):
  '''
  Rearrange Unipeptresponse into a dictionary with {EC:[(taxa1,#peptides),(),..],EC2:[(),(),..]}
  :param Unipeptresponse: UnipeptResponse format
  :return: dataframe with ec->taxon->weightProxy information
  '''
  
  #UnipeptResponseList = json.loads(UnipeptResponse)
  UnipeptFrame = pd.json_normalize(UnipeptResponse,max_level = 0)
  UnipeptFrame = UnipeptFrame.drop(columns= ['total_protein_count','ipr','go'])
  UnipeptFrame['ec'] = UnipeptFrame['ec'].apply(lambda x:[i['ec_number'] for i in x])
  UnipeptFrame = UnipeptFrame.explode(['ec'])
  UnipeptFrameECTaxa = UnipeptFrame.groupby(['taxon_id','taxon_rank','taxon_name','ec']).count().reset_index()
  return UnipeptFrameECTaxa



def FetchKeggECMapping():
    '''
    fetches the KEGG ec->pathway mapping and turns it into a dictionary
    :input : none required
    :return : {pathway:{ec,..}} dictionary
    '''
    #get Kegg info, create first dict
    response = requests.get("https://rest.kegg.jp/link/path/ec")
    if (response.status_code == 200):
        print("The request was a success bitch!")
        ec2path_mapping = str(response.text).split("\n")
        ec2path_dict = defaultdict(set)
        for i in range(len(ec2path_mapping)):
          line = ec2path_mapping[i]
          #print(line)
          if len(line) == 0:
             continue 
          pair = line.split("\t")
          if len(pair) != 2 or pair[1].startswith("path:map"):
            continue
          ec2path_dict[pair[0].split(':')[1]].add(pair[1])
    elif (response.status_code == 404):
        print("Result not found!")
    
    return ec2path_dict

def AddPathwayInfo(ECTaxaFrame, EC2PathDict):
  '''
  Maps Pathway information based on EC numbers into ec->tax->weight frame
  :input ECTaxaFrame: dataframe with ec->taxon_> weight info
  :input EC2PathDict: Dictionary wth ec 2 pathway map from KEGG
  :return : dataframe with everything we need 
  '''
  ECTaxaFrame['pathways']=ECTaxaFrame['ec'].map(EC2PathDict) 
  ECTaxaFrame = ECTaxaFrame.explode(['pathways'])
  ECTaxaFrameWithNA = ECTaxaFrame[ECTaxaFrame.isna().any(axis=1)]
  ECTaxaFrame = ECTaxaFrame.dropna()
  
  return ECTaxaFrame, ECTaxaFrameWithNA



peptides = readInput(args.PeptidesFile)
response = PostInfoFromUnipept(peptides)
Framyframe = RearrangeUnipeptResponse(response)
EC2PathDicty = FetchKeggECMapping()
FullFrame, AllNAs = AddPathwayInfo(Framyframe,EC2PathDicty)


FullFrame.to_csv(args.out)


