# PathwayPilot
PathwayPilot [[1]](#1) is a taxonomy assignment and pathway visualisation tool for metaproteomics data. It combines Unipept [[2]](#2) and KEGG [[3]](#3) to provide pathway visualisations showing which pathways are represented in which species. It works both with peptide and protein input. 

## Usage
PathwayPilot is available as a webapplication via [pathwaypilot.ugent.be](https://pathwaypilot.ugent.be).

## Local development

### Repository layout

| directory | what it is |
|---|---|
| `web/`        | the Vue 3 + Vuetify frontend — this is the application users see |
| `backend/`    | an Express + TypeScript API that proxies and caches KEGG data |

The frontend talks to `backend/` for KEGG pathway maps and annotation mappings, and
calls the [Unipept](https://unipept.ugent.be) and
[EBI Proteins](https://www.ebi.ac.uk/proteins/api/doc/) APIs directly from the browser
for taxonomy and protein lookups.

### Backend

```bash
cd backend
cp .env.example .env      # the defaults are ready to use
npm ci
npm run build
npm run refresh-data      # first time only: fetches ~8 MB from KEGG, takes ~3 min
npm start
```

`backend/data/` holds KEGG's enzyme, orthology, reaction, compound, module and pathway
tables. It is **not tracked in git** — it is refreshed from
[rest.kegg.jp](https://rest.kegg.jp), so `npm run refresh-data` seeds it on a fresh
checkout and updates it later. The server reads it at startup and will not start without
it.

The server listens on the port set in `.env` (`3000` by default). All 26 configuration
variables are documented in [`backend/.env.example`](backend/.env.example).

For development with reload, `npm run serve` runs the TypeScript directly instead of
`npm run build && npm start`.

To skip the KEGG fetch entirely, generate a throwaway stand-in — enough to boot and answer
mapping queries, not a real dataset:

```bash
npm run fixture
DATA_DIR=.fixture/ LINK_DIR=.fixture/link/ npm run serve
npm run fixture -- --clean    # when you are done
```

### Frontend

```bash
cd web
npm ci
npm run dev
```

The frontend defaults to the **production** backend at
`https://pathwaypilot.ugent.be/api`. To develop against the backend running on your own
machine, point it there:

```bash
cp .env.example .env.local     # then uncomment VITE_API_BASE_URL
```

### Running the checks

These are the same commands CI runs on every pull request:

```bash
cd web     && npm run build     # typechecks with vue-tsc, then builds
cd web     && npm run lint      # reports; `npm run lint:fix` rewrites
cd backend && npx tsc --noEmit
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## References
<a id="1">[1]</a> 
PathwayPilot: A User-Friendly Tool for Visualizing and Navigating Metabolic Pathways. Vande Moortele et al., Mol. Cell. Proteomics 2025, 24, 3, 100918, https://doi.org/10.1016/j.mcpro.2025.100918 \
<a id="2">[2]</a> 
Unipept 4.0: Functional Analysis of Metaproteome Data. Singh et al., J. Proteome Res. 2019, 18, 2, 606–615, https://doi.org/10.1021/acs.jproteome.8b00716 \
<a id="3">[3]</a> 
KEGG: Kyoto Encyclopedia of Genes and Genomes. Minoru Kanehisa, Susumu Goto, Nucleic Acids Research, Volume 28, Issue 1, 1 January 2000, Pages 27–30, https://doi.org/10.1093/nar/28.1.27
