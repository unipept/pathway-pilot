import argparse
from ete3 import NCBITaxa
import re
import pandas as pd
import requests
from collections import defaultdict

ncbi = NCBITaxa()

parser = argparse.ArgumentParser()

parser.add_argument('--ProteinFile', type = str, required = True, help = 'path to txt file protein-weight pairs per line')
parser.add_argument('--out', type = str, required = True, help = 'output path')

args = parser.parse_args()

def make_urls(accession_file, chunksize = 100): 
    '''
    reads CSV file with uniprot accession numbers and returns list of URLs to retrieve EC numbers
    :input accession_file: csv wiht protein acession in first column and corresponding weights (from lfq or psm count etc) in the second
    :return url_list: list of URLs to query UniProt in chunks
    :return frame: dataframe f protein accession an weights  
    '''
    pandaframe = pd.read_csv(accession_file, names=['accession','Weights'])
    accessions_list = pandaframe["accession"].to_list()
    #make all URLs
    lists_of_acc = [accessions_list[i:i + chunksize] for i in range(0, len(accessions_list), chunksize)]
    url_list=set()
    for acc_list in lists_of_acc:
        url1='http://rest.uniprot.org/uniprotkb/search?query='
        url3='&format=tsv'
        final_URL = url1
        for url2 in acc_list:
            final_URL+='(accession:'+url2+')OR'
        final_URL = final_URL[:-2] + url3
        url_list.add(final_URL)
    return url_list, pandaframe

def get_ec(accession_file):
    '''
    retrieves EC numbers given protein accesion list
    :input accession_file: csv wiht protein acession in first column and corresponding weights (from lfq or psm count etc) in the second
    :return ec_dict: nested dictionary of ec to taxon and protein accession mapping
    :return frame: dataframe f protein accession an weights  
    '''
    ec_numbers = []
    ec_dict={}
    urls,frame = make_urls(accession_file, 100)
    for url in urls:
        response = requests.post(url)
        if response.ok:
            text = response.text
            lines = text.split("\n")#chop by row
            for line in lines[1:]:#iterate over lines except for first one
                if len(line) == 0:
                    continue
                entries = line.split("\t")
                #index 0=accession, 3=EC, 5=Organism
                accession_numbers = entries[0]
                ec_numbers.extend(re.findall(r'\(EC [0-9.-]+\)', entries[3]))
                if len(ec_numbers)!=0:#checks if accession has no EC
                    for ec in range(len(ec_numbers)):  # refine EC
                        ec_numbers[ec] = ec_numbers[ec].replace('(EC ', '').replace(')', '')
                    for ec_key in ec_numbers:
                        if ec_key not in ec_dict.keys():
                            ec_dict[ec_key]={"accession": [accession_numbers],"taxon": [entries[5]]}
                        else:
                            ec_dict[ec_key]["accession"].append(accession_numbers)
                            ec_dict[ec_key]["taxon"].append(entries[5])
                ec_numbers=[]
    return ec_dict, frame


def ECTaxonFrame(ECDictionary, ProteinWeightFrame):
    '''
    Creates dataframe of ec numbers, taxa, associated weights
    :input ECDictionary: nested dictionary of {ecnr{accession:[],weights:[]}}
    :input ProteinWeightFrame: Dataframe of protein accessions and weights
    :return : Dataframe with taxa, ec numbers and weights
    '''
    ec_dict = ECDictionary
    frame = ProteinWeightFrame
    ec_pandas=pd.DataFrame.from_dict(ec_dict)
    ec_pandas=ec_pandas.T
    ec_pandas.index.name = 'ec'
    ec_pandas.reset_index(inplace=True)
    ec_pandas=ec_pandas.explode('accession')
    ec_pandas=ec_pandas.explode('taxon')
    ec_pandas=pd.merge(ec_pandas, frame, on = 'accession')
    ec_pandas['taxon']=ec_pandas['taxon'].apply(lambda x: re.sub("\(.*?\)", "", x)[:-1])
    ec_pandas['taxid'] = ec_pandas['taxon'].apply(lambda x:ncbi.get_name_translator([x])[x][0])
    ec_pandas['rank']='species'
    ec_pandas=ec_pandas.groupby(['ec', 'taxon', 'taxid', 'rank'])['Weights'].sum().reset_index()
    return ec_pandas

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

ec_dict, protein_data = get_ec(args.ProteinFile)
InputFrame = ECTaxonFrame(ec_dict, protein_data)

EC2PathDicty = FetchKeggECMapping()
FullFrame, AllNAs = AddPathwayInfo(InputFrame,EC2PathDicty)
FullFrame.to_csv(args.out)


