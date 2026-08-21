#!/usr/bin/env bash
#
# Generate a throwaway KEGG fixture for booting the backend without a network.
#
#   npm run fixture                 # writes backend/.fixture/
#   npm run fixture -- --clean      # removes it again
#
# The real backend/data/ is ~8 MB fetched from rest.kegg.jp by
# `npm run refresh-data`. That is far too slow for a smoke test and too large
# to commit, so this writes a tiny stand-in with the same filenames and the
# same tab-separated format.
#
# It is generated rather than committed so that no file which merely *looks*
# like KEGG data ever sits in the source tree. The output is gitignored.
#
# The slice is centred on EC 1.1.1.1 and joins across every file, so a request
# for it exercises the parsers and the cross-file mapping rather than only
# proving the process started:
#
#   GET /mapping/ec/1.1.1.1
#   {"names":["alcohol dehydrogenase", ...],
#    "pathways":[{"id":"map00010","name":"Glycolysis / Gluconeogenesis"}],
#    "koNumbers":["K00001"],"reactionIds":["R00623"]}
#
# Every file needs at least one well-formed line. Empty files are NOT a valid
# fixture: the parsers split on tab and dereference the second column, so a
# zero-byte file fails at startup with
#   TypeError: Cannot read properties of undefined (reading 'trim')
#
# This is not a sample of current KEGG content and is not kept in step with it.
# Drift between the real KEGG format and these parsers is caught monthly by
# .github/workflows/kegg-refresh-check.yml, which does a real refresh.

set -euo pipefail

BACKEND="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$BACKEND/.fixture"

if [ "${1:-}" = "--clean" ]; then
    rm -rf "$OUT"
    echo "Removed $OUT"
    exit 0
fi

rm -rf "$OUT"
mkdir -p "$OUT/link"

# --- entity tables: <id>\t<description> -------------------------------------
printf '%s\n' \
    $'1.1.1.1\talcohol dehydrogenase; aldehyde reductase; ADH' \
    $'2.7.1.1\thexokinase; glucokinase'                          > "$OUT/ec"
printf '%s\n' \
    $'K00001\tE1.1.1.1, adh; alcohol dehydrogenase [EC:1.1.1.1]' \
    $'K00844\tHK; hexokinase [EC:2.7.1.1]'                       > "$OUT/ko"
printf '%s\n' \
    $'R00623\talcohol dehydrogenase reaction; aldehyde reductase reaction' \
    $'R00299\thexokinase reaction'                               > "$OUT/reaction"
printf '%s\n' \
    $'C00001\tH2O; Water' \
    $'C00022\tPyruvate'                                          > "$OUT/compound"
printf '%s\n' \
    $'M00001\tGlycolysis (Embden-Meyerhof pathway), glucose => pyruvate' > "$OUT/module"
printf '%s\n' \
    $'map00010\tGlycolysis / Gluconeogenesis' \
    $'map01100\tMetabolic pathways'                              > "$OUT/pathway"

# --- link tables: <id>\t<id> ------------------------------------------------
printf '%s\n' $'1.1.1.1\tK00001'  $'2.7.1.1\tK00844'   > "$OUT/link/ec2ko"
printf '%s\n' $'1.1.1.1\tR00623'  $'2.7.1.1\tR00299'   > "$OUT/link/ec2reaction"
printf '%s\n' $'1.1.1.1\tC00001'                       > "$OUT/link/ec2compound"
printf '%s\n' $'1.1.1.1\tmap00010' $'2.7.1.1\tmap00010' > "$OUT/link/ec2pathway"
printf '%s\n' $'2.7.1.1\tM00001'                       > "$OUT/link/ec2module"
printf '%s\n' $'K00001\tR00623'                        > "$OUT/link/ko2reaction"
printf '%s\n' $'K00001\tmap00010'                      > "$OUT/link/ko2pathway"
printf '%s\n' $'K00844\tM00001'                        > "$OUT/link/ko2module"
printf '%s\n' $'R00623\tC00001'                        > "$OUT/link/reaction2compound"
printf '%s\n' $'R00623\tmap00010'                      > "$OUT/link/reaction2pathway"
printf '%s\n' $'R00299\tM00001'                        > "$OUT/link/reaction2module"
printf '%s\n' $'C00022\tmap00010'                      > "$OUT/link/compound2pathway"
printf '%s\n' $'C00267\tM00001' $'C00022\tM00001'      > "$OUT/link/compound2module"

echo "Wrote $(find "$OUT" -type f | wc -l | tr -d ' ') files to $OUT"
echo "Point the backend at it with:"
echo "  DATA_DIR=.fixture/ LINK_DIR=.fixture/link/ npm run serve"
