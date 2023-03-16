import os
import pandas as pd
import re

def Poutparser(pout_file, fdr_threshold, decoy_flag):
    '''
    Parses the ms2rescore pout file for peptides, psm numbers and peptide scores
    :param pout_file: str, path to pout file
    :param fdr_threshold: float, fdr threshold below which psms are kept
    :param decoy_flag: str, can be emtpy string, decoy flag in pout file
    :return: list of peptides
    '''
    
    pep_score = dict()
    pep_psm = dict()
    pep_score_psm = dict()

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


def PepShakerPeptides(filepath):
    '''returns confidence value and peptide names from PeptideShaker default PSm results'''
    pepIDs= pd.read_csv (filepath, sep = '\t', error_bad_lines=False) #error bad lines should be remove when development is done
    pepnames = pepIDs['Sequence'].tolist()
    pepscores = pepIDs['Confidence [%]'].tolist()

    #directly remove IDS with zero confidence
    pepnames = [pepnames[i] for i in range(len(pepscores)) if pepscores[i] != 0]

    return pepnames


def MaxQuantParser(mq_file, filter_by = None, cutoff = None):
    '''
    Parses MaxQuant output file with filter option
    Assumes sequence column name is "Sequence"
    mq_file: str, path to file
    filter_by: str, "PEP", "score", "delta_score"
    cutoff: float, value to filter.
    returns the list of peptides
    '''
    
    cols = ['Sequence'] 
    if filter_by in set(["PEP", "score", "delta_score"]) and type(cutoff) == float:
        cols += filter_by
        
    peptide_score_list = []
    with open(mq_file, 'r') as f:
        header = next(f)
        colnames = header.split('\t')
        col_idx = []
        for c in cols:
            try:
                col_idx.append(colnames.index(c))
            except ValueError:
                ## warning no column
                continue
        
        for l in f:
            peptide_score_list.append([l.strip().split('\t')[i] for i in col_idx]) # [peptide, filter_param]
    
    if col_idx > 1:
        if filter_by == 'PEP':
            peptide_list = [i for i,j in peptide_score_list if float(j) < cutoff] # pep lower better
        else:
            peptide_list = [i for i,j in peptide_score_list if float(j) > cutoff] # score higher better
    else:
        peptide_list = [i for [i] in peptide_score_list]
        
    return peptide_list


def ProteomeDiscovererParser(pd_file, filter_by = None, cutoff = None):
    '''
    Parses ProteomeDiscoverer output file with filter option
    Assumes sequence column name is "Annotated Sequence"
    pd_file: str, path to file
    filter_by: str, "DeltaScore", "Percolator q-Value", "Percolator PEP"
    cutoff: float, value to filter.
    returns the list of peptides
    '''

    cols = ['Annotated Sequence'] ## assume this sequence column name exists
    if filter_by in set(["DeltaScore", "Percolator q-Value", "Percolator PEP"]) and type(cutoff) == float:
        cols += filter_by
        
    peptide_score_list = []
    with open(pd_file, 'r') as f:
        header = next(f)
        colnames = header.split('\t')
        col_idx = []
        for c in cols:
            try:
                col_idx.append(colnames.index(c))
            except ValueError:
                ## warning no column
                continue
        
        for l in f:
            list_item = [l.strip().split('\t')[i] for i in col_idx]
            list_item[0] = list_item[0].split('.')[1].upper()
            peptide_score_list.append(list_item) # [peptide, filter_param]
    
    if col_idx > 1:
        if filter_by == 'DeltaScore':
            peptide_list = [i for i,j in peptide_score_list if float(j) > cutoff] # score higher better
        else:
            peptide_list = [i for i,j in peptide_score_list if float(j) < cutoff] # pep, qval lower better
    else:
        peptide_list = [i for [i] in peptide_score_list]

    return peptide_list


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
