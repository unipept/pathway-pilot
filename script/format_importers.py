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
                pepList = list(PepList)

          
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


def PepShakerPeptides(filepath:
    '''returns confidence value and peptide names from PeptideShaker default PSm results'''
    pepIDs= pd.read_csv (filepath, sep = '\t', error_bad_lines=False) #error bad lines should be remove when development is done
    pepnames = pepIDs['Sequence'].tolist()
    pepscores = pepIDs['Confidence [%]'].tolist()

    #directly remove IDS with zero confidence
    pepnames = [pepnames[i] for i in range(len(pepscores)) if pepscores[i] != 0]



    return pepnames