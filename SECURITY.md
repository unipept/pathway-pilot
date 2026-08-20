# Security policy

## Reporting a vulnerability

Please do **not** open a public issue for a security problem in PathwayPilot.

Report it privately through GitHub's
[private vulnerability reporting](https://github.com/unipept/pathway-pilot/security/advisories/new)
instead. That creates a draft advisory visible only to you and the maintainers.

Include, as far as you can:

- what the problem is and where it lives (a file, an endpoint, a dependency)
- how to reproduce it
- what an attacker could do with it

We will acknowledge your report within **10 working days** and keep you updated
while we work on a fix. If you would like to be credited in the advisory, say so
in your report.

## Scope

This policy covers:

- the code in this repository (`web/` and `backend/`)
- the hosted instance at [pathwaypilot.ugent.be](https://pathwaypilot.ugent.be)

PathwayPilot calls three external services that are outside this policy — report
problems in those to their own maintainers:

| service | who to contact |
|---|---|
| [Unipept API](https://unipept.ugent.be) | the Unipept team |
| [KEGG](https://www.kegg.jp) | Kanehisa Laboratories |
| [EBI Proteins API](https://www.ebi.ac.uk/proteins/api/doc/) | EMBL-EBI |

## Supported versions

PathwayPilot is a hosted web application without tagged releases. Only the
currently deployed version is supported; there are no older versions to patch.
