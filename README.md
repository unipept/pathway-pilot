# PathwayPilot
PathwayPilot is a taxonomy assignment and pathway visualisation tool for metaproteomics data. It combines Unipept [[1]](#1) and KEGG [[2]](#2) to provide pathway visualisations showing which pathways are represented in which species. It works both with peptide and protein input. 

## Usage
PathwayPilot is available as a webapplication via [pathwaypilot.ugent.be](https://pathwaypilot.ugent.be).

## Local development

### Repository layout

| directory | what it is |
|---|---|
| `web/`        | the Vue 3 + Vuetify frontend — this is the application users see |
| `backend/`    | an Express + TypeScript API that proxies and caches KEGG data |
| `script/`     | one-off Python tooling used to prepare KEGG import files |
| `test-data/`  | sample input files in each supported format, useful for manual testing |

The frontend talks to `backend/` for KEGG pathway maps and annotation mappings, and
calls the [Unipept](https://unipept.ugent.be) and
[EBI Proteins](https://www.ebi.ac.uk/proteins/api/doc/) APIs directly from the browser
for taxonomy and protein lookups.

### Backend

```bash
cd backend
cp .env.example .env    # the defaults work against the committed data/ tree
npm ci
npm run serve
```

The server listens on the port set in `.env` (`3000` by default). All 26 configuration
variables are documented in [`backend/.env.example`](backend/.env.example).

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
Unipept 4.0: Functional Analysis of Metaproteome Data. Singh et al., J. Proteome Res. 2019, 18, 2, 606–615, https://doi.org/10.1021/acs.jproteome.8b00716 \
<a id="2">[2]</a> 
KEGG: Kyoto Encyclopedia of Genes and Genomes. Minoru Kanehisa, Susumu Goto, Nucleic Acids Research, Volume 28, Issue 1, 1 January 2000, Pages 27–30, https://doi.org/10.1093/nar/28.1.27
