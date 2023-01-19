import main
from ete3 import NCBITaxa
import re

ncbi = NCBITaxa()

def make_urls(accession_file): #reads CSV or TSV file with uniprot accession numbers and returns list of URLs to retrieve EC numbers
    pandaframe = pd.read_csv(accession_file, names=['accession','Weights'])
    url2=pandaframe["accession"].to_list()
    #make all URLs
    url1='https://rest.uniprot.org/uniprotkb/'
    url3='?format=tsv'
    url_list=[]
    for urli in url2:
        final_URL=url1+urli+url3
        url_list.append(final_URL)
    return url_list, pandaframe



def get_ec(accession_file):
    '''
    retrieves EC numbers given protein accesion list
    :inputaccession_file: csv wiht protein acession inf first column and corresponding weights(from lfq or psm count etc) in the second
    :return ec_dict: nested dictionary of ec to taxon and protein accession mapping
    :return frame: dataframe f protein accession an weights  
    '''
    #retrieves EC numbers from uniprot from list of URLs
    ec_numbers = []
    ec_dict={}
    urls,frame = make_urls(accession_file)
    for url in urls:
        response = requests.get(url)
        if response.ok:
            text = response.text
            entries = text.split("\n")#chop by row
            entries = entries[1].split("\t")#remove first row
            #index 0=accession, 3=EC, 5=Organism
            accession_numbers = entries[0]
            ec_numbers.extend(re.findall(r'\(EC [0-9.-]+\)', entries[3]))
            if len(ec_numbers)!=0:#checks if accession has no EC
                for ec in range(len(ec_numbers)):  # refine EC
                    ec_numbers[ec] = ec_numbers[ec].replace('(', '').replace(')', '')
                for ec_key in ec_numbers:
                    if ec_key not in ec_dict.keys():
                        ec_dict[ec_key]={"accession": [accession_numbers],"taxon" : [entries[5]]}
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
    ec_pandas=ec_pandas.groupby(['ec', 'taxon', 'taxid', 'rank'])['Weights'].sum()

    return ec_pandas


