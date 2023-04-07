import os
import pandas as pd
import re

def PoutMS2RescoreParser(pout_file, fdr_threshold, decoy_flag):
    '''
    Parses the ms2rescore pout file for peptides, psm numbers and peptide scores
    :param pout_file: str, path to pout file
    :param fdr_threshold: float, fdr threshold below which psms are kept
    :param decoy_flag: str, can be emtpy string, decoy flag in pout file
    :return: list of peptides
    '''
    
    assert os.path.exists(pout_file), "input file or folder does not exist"

    with open(pout_file, "r") as f:
        next(f)  # skip header
        pepList = set()
        for line in f:
            # skip empty lines
            if line.rstrip() == "":
                continue
            splitted_line = line.rstrip().split("\t", maxsplit=5)
            assert len(splitted_line) >= 6, "Input file is wrongly formatted. Make sure that the input is a valid .pout file."
            psm_id, _, q, pep, peptide,_ = splitted_line
            if float(q) < fdr_threshold:
                peptide = re.sub("\[.*?\]", "", peptide)
                peptide = peptide.split(".")[1]
                pepList.add(peptide)
    pepList = list(pepList)
          
    return pepList



def PepShakerProteins(filepath):
    '''take PeptideShaker default PSM results and retrieve all identified protein accessions into list'''
    pepIDs= pd.read_csv (filepath, sep = '\t', error_bad_lines=False) #error bad lines should be remove when development is done
    proteins_all = pepIDs['Protein(s)'].tolist()
    proteins = []
    for protein in proteins_all:
        protein.split(',')
        proteins.append(protein)
    proteins.extend()

    return proteins


def PepShakerPeptides(filepath, conf_threshold = None):
    '''
    Parses the PeptideShaker default PSm results for identified peptides
    :param filepath: str, path to PeptideShaker results file
    :param conf_threshold: float, confidence threshold above which psms are kept
    :return: list of peptides
    '''
    pepIDs= pd.read_csv (filepath, sep = '\t', error_bad_lines=False) #error bad lines should be remove when development is done
    pepnames = pepIDs['Sequence'].tolist()
    pepscores = pepIDs['Confidence [%]'].tolist()

    #directly remove IDS with zero confidence
    pepnames_filtered = [pepnames[i] for i in range(len(pepscores)) if pepscores[i] >= conf_threshold]

    return pepnames_filtered


def MaxQuantParser(filepath, cutoff = 0.01):
    '''
    Parses MaxQuant output file filtered by "PEP"
    Assumes sequence column name is "Sequence"
    mq_file: str, path to file
    cutoff: float, value to filter.
    returns the list of peptides
    '''
    
    pep_df= pd.read_csv(filepath, sep = '\t') 
    sub_df = pep_df.loc[pep_df['PEP'] < cutoff]
    return list(sub_df['Sequence'])


def ProteomeDiscovererParser(filepath, cutoff = 0.01):
    '''
    Parses ProteomeDiscoverer output file filtered by "Percolator PEP"
    Assumes sequence column name is "Annotated Sequence"
    filepath: str, path to file
    cutoff: float, value to filter.
    returns the list of peptides
    '''

    pep_df= pd.read_csv(filepath, sep = '\t') 
    sub_df = pep_df.loc[pep_df['Percolator PEP'] < cutoff]
    seqs = sub_df['Annotated Sequence'].apply(lambda x: x.split('.')[1].upper())
    return list(seqs)
    

def MetaProteomeAnalyzerParser(mpa_file, score_cutoff):
    '''returns peptides from MetaProteomeAnalyzer default results'''
    peptide_list = set()
    with open(mpa_file, 'r') as f:
        for line in f:
            splitted_line = line.rstrip().split("\t", maxsplit=7)
            #print(len(splitted_line))
            # assert len(splitted_line) >= 7, "Input file is wrongly formatted. Make sure that the input is a valid file."
            _, protein_id, peptide, _, _, _, score = splitted_line
            if float(score) < score_cutoff:
                peptide_list.add(peptide)
    peptide_list = list(peptide_list)
    return peptide_list
