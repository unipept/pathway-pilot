# PathwayPilot
PathwayPilot is a taxonomy assignment and pathway visualisation tool for metaproteomics data. It combines Unipept [[1]](#1) and KEGG [[2]](#2) to provide pathway visualisations showing which pathways are represented in which species. It works both with peptide and protein input. 

## Usage
PathwayPilot is available as a webapplication via [pathwaypilot.ugent.be](https://pathwaypilot.ugent.be).

## Local development

The repository holds two runnable components:

| directory | what it is |
|---|---|
| `web/`     | the Vue 3 + Vuetify frontend |
| `backend/` | an Express + TypeScript API that proxies and caches KEGG data |

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

## References
<a id="1">[1]</a> 
Unipept 4.0: Functional Analysis of Metaproteome Data. Singh et al., J. Proteome Res. 2019, 18, 2, 606–615, https://doi.org/10.1021/acs.jproteome.8b00716 \
<a id="2">[2]</a> 
KEGG: Kyoto Encyclopedia of Genes and Genomes. Minoru Kanehisa, Susumu Goto, Nucleic Acids Research, Volume 28, Issue 1, 1 January 2000, Pages 27–30, https://doi.org/10.1093/nar/28.1.27
