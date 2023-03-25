import argparse
import pandas as pd
from collections import defaultdict
import format_importers

parser = argparse.ArgumentParser()

parser.add_argument('--inputType', type = str, required = True, help = 'type of input file, possible values: [Pout, PepShaker, MaxQuant, ProteomeDiscoverer]')
parser.add_argument('--input', type = str, required = True, help = 'path to search engine input')
parser.add_argument('--out', type = str, required = True, help = 'path to peptides output file')


args = parser.parse_args()

if args.inputType == "PoutMS2Rescore":
  peptides = format_importers.PoutMS2RescoreParser(args.input, 0.01, "")
elif args.inputType == "PepShaker":
  peptides = format_importers.PepShakerPeptides(args.input, 90.0)
elif args.inputType == "MaxQuant":
  peptides = format_importers.MaxQuantParser(args.input, "score", 50.0)
elif args.inputType == "ProteomeDiscoverer":
  peptides = format_importers.ProteomeDiscovererParser(args.input, "Percolator q-Value", 0.05)
elif args.inputType == "MetaProteomeAnalyzer":
  peptides = format_importers.MetaProteomeAnalyzerParser(args.input, 0.05)

#print(peptides[0:10])
print(len(peptides))

with open(args.out, 'w') as fp:
    fp.write('\n'.join(peptides))


