import argparse
import pandas as pd
from collections import defaultdict
import format_importers

parser = argparse.ArgumentParser()

parser.add_argument('--inputType', type = str, required = True, help = 'type of input file, possible values: [Pout, PepShaker, MaxQuant, ProteomeDiscoverer]')
parser.add_argument('--input', type = str, required = True, help = 'path to search engine input')
parser.add_argument('--out', type = str, required = True, help = 'output to peptides output file')


args = parser.parse_args()

if args.inputType == "Pout":
  peptides = format_importers.Poutparser(args.input, 0.01, "")
elif args.inputType == "PepShaker":
  peptides = format_importers.PepShakerPeptides(args.input)
elif args.inputType == "MaxQuant":
  peptides = format_importers.MaxQuantParser(args.input, "score", 50.0)
elif args.inputType == "ProteomeDiscoverer":
  peptides = format_importers.ProteomeDiscovererParser(args.input, "Percolator q-Value", 0.05)
elif args.inputType == "MetaProteomeAnalyzer":
  peptides = format_importers.MetaProteomeAnalyzerParser(args.input, 0.05)

print(peptides[1:10])
print(len(peptides))
#peptides.to_csv(args.out)


