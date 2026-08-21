import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const REQUIRED_ENV_VARS = [
    'PORT',
    'KEGG_API_ENDPOINT__BASE',
    'KEGG_API_ENDPOINT__PATHWAY',
    'KEGG_API_ENDPOINT__PATHWAY_PNG',
    'KEGG_API_ENDPOINT__PATHWAY_NAMES',
    'DATA_DIR',
    'LINK_DIR',
    'EC_DATA_FILE',
    'KO_DATA_FILE',
    'REACTION_DATA_FILE',
    'COMPOUND_DATA_FILE',
    'MODULE_DATA_FILE',
    'PATHWAY_DATA_FILE',
    'EC_KO_LINK_FILE',
    'EC_REACTION_LINK_FILE',
    'EC_COMPOUND_LINK_FILE',
    'EC_PATHWAY_LINK_FILE',
    'EC_MODULE_LINK_FILE',
    'KO_REACTION_LINK_FILE',
    'KO_PATHWAY_LINK_FILE',
    'KO_MODULE_LINK_FILE',
    'REACTION_COMPOUND_LINK_FILE',
    'REACTION_PATHWAY_LINK_FILE',
    'REACTION_MODULE_LINK_FILE',
    'COMPOUND_PATHWAY_LINK_FILE',
    'COMPOUND_MODULE_LINK_FILE'
];

const missingEnvVars = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);

if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variables:\n  ${missingEnvVars.join(', ')}\nSee backend/.env.example`);
    process.exit(1);
}

// All variables in REQUIRED_ENV_VARS are confirmed present at this point, so
// this accessor can safely hand back a string instead of string | undefined.
const env = (name: string): string => process.env[name] as string;

const keggUrl = (path: string) => {
    return `${env('KEGG_API_ENDPOINT__BASE')}${path}`;
}

const dataLocation = (loc: string) => {
    return path.join(__dirname, `../../${env('DATA_DIR')}${loc}`);
}

const linkLocation = (loc: string) => {
    return path.join(__dirname, `../../${env('LINK_DIR')}${loc}`);
}

const config = {
    port: env('PORT'),
    keggPathwayEndpoint: keggUrl(env('KEGG_API_ENDPOINT__PATHWAY')),
    keggPathwayPngEndpoint: keggUrl(env('KEGG_API_ENDPOINT__PATHWAY_PNG')),
    keggPathwayNamesEndpoint: keggUrl(env('KEGG_API_ENDPOINT__PATHWAY_NAMES')),

    ecDataFile: dataLocation(env('EC_DATA_FILE')),
    koDataFile: dataLocation(env('KO_DATA_FILE')),
    reactionDataFile: dataLocation(env('REACTION_DATA_FILE')),
    compoundDataFile: dataLocation(env('COMPOUND_DATA_FILE')),
    moduleDataFile: dataLocation(env('MODULE_DATA_FILE')),
    pathwayDataFile: dataLocation(env('PATHWAY_DATA_FILE')),

    ecKoLinkFile: linkLocation(env('EC_KO_LINK_FILE')),
    ecReactionLinkFile: linkLocation(env('EC_REACTION_LINK_FILE')),
    ecCompoundLinkFile: linkLocation(env('EC_COMPOUND_LINK_FILE')),
    ecPathwayLinkFile: linkLocation(env('EC_PATHWAY_LINK_FILE')),
    ecModuleLinkFile: linkLocation(env('EC_MODULE_LINK_FILE')),
    koReactionLinkFile: linkLocation(env('KO_REACTION_LINK_FILE')),
    koPathwayLinkFile: linkLocation(env('KO_PATHWAY_LINK_FILE')),
    koModuleLinkFile: linkLocation(env('KO_MODULE_LINK_FILE')),
    reactionCompoundLinkFile: linkLocation(env('REACTION_COMPOUND_LINK_FILE')),
    reactionPathwayLinkFile: linkLocation(env('REACTION_PATHWAY_LINK_FILE')),
    reactionModuleLinkFile: linkLocation(env('REACTION_MODULE_LINK_FILE')),
    compoundPathwayLinkFile: linkLocation(env('COMPOUND_PATHWAY_LINK_FILE')),
    compoundModuleLinkFile: linkLocation(env('COMPOUND_MODULE_LINK_FILE'))
};

export default config;
