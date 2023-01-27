import dotenv from 'dotenv';

dotenv.config();

const keggUrl = (path: string) => {
    return `${process.env.KEGG_API_ENDPOINT__BASE}${path}`;
}

const config = {
    port: process.env.PORT,
    keggPathwayEndpoint: keggUrl(process.env.KEGG_API_ENDPOINT__PATHWAY!),
    keggPathwayPngEndpoint: keggUrl(process.env.KEGG_API_ENDPOINT__PATHWAY_PNG!)
};

export default config;
