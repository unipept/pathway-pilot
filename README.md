# Van 't pathje
Van 't pathje is a taxonomy assignment and pathway visualisation tool for metaproteomics data. It combines Unipept [[1]](#1) and KEGG [[2]](#2) to provide pathway visualisations showing which pathways are represented in which species. It works both with peptide and protein input. 

![Workflow](/readme_images/workflow2.png) 

### Peptide-centric approach 
Given a list of peptides, Van 't pathje will first do taxonomy assignment and functional annotation with Unipept. Pathway visualisations are retrieved by querying the KEGG API.

### Protein-centric approach 
Given a list of proteins, Van 't pathje first maps the UniProt IDs to KEGG Identifiers (EC numbers). Pathway visualisations are retrieved by querying the KEGG API.

## Usage
Van 't pathje is available as a webserver via www.vantpathje.com.
If you find Van 't pathje useful for your research, please cite *TODO*

## References
<a id="1">[1]</a> 
Unipept 4.0: Functional Analysis of Metaproteome Data. Singh et al., J. Proteome Res. 2019, 18, 2, 606–615, https://doi.org/10.1021/acs.jproteome.8b00716 \
<a id="2">[2]</a> 
KEGG: Kyoto Encyclopedia of Genes and Genomes. Minoru Kanehisa, Susumu Goto, Nucleic Acids Research, Volume 28, Issue 1, 1 January 2000, Pages 27–30, https://doi.org/10.1093/nar/28.1.27
