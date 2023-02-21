import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const keggUrl = (path: string) => {
    return `${process.env.KEGG_API_ENDPOINT__BASE}${path}`;
}

const dataLocation = (loc: string) => {
    return path.join(__dirname, `../../${process.env.DATA_DIR}${loc}`);
}

const linkLocation = (loc: string) => {
    return path.join(__dirname, `../../${process.env.LINK_DIR}${loc}`);
}

const config = {
    port: process.env.PORT,
    keggPathwayEndpoint: keggUrl(process.env.KEGG_API_ENDPOINT__PATHWAY!),
    keggPathwayPngEndpoint: keggUrl(process.env.KEGG_API_ENDPOINT__PATHWAY_PNG!),
    keggPathwayNamesEndpoint: keggUrl(process.env.KEGG_API_ENDPOINT__PATHWAY_NAMES!),

    ecDataFile: dataLocation(process.env.EC_DATA_FILE!),
    koDataFile: dataLocation(process.env.KO_DATA_FILE!),
    reactionDataFile: dataLocation(process.env.REACTION_DATA_FILE!),
    compoundDataFile: dataLocation(process.env.COMPOUND_DATA_FILE!),
    moduleDataFile: dataLocation(process.env.MODULE_DATA_FILE!),
    pathwayDataFile: dataLocation(process.env.PATHWAY_DATA_FILE!),

    ecKoLinkFile: linkLocation(process.env.EC_KO_LINK_FILE!),
    ecReactionLinkFile: linkLocation(process.env.EC_REACTION_LINK_FILE!),
    ecCompoundLinkFile: linkLocation(process.env.EC_COMPOUND_LINK_FILE!),
    ecPathwayLinkFile: linkLocation(process.env.EC_PATHWAY_LINK_FILE!),
    ecModuleLinkFile: linkLocation(process.env.EC_MODULE_LINK_FILE!),
    koReactionLinkFile: linkLocation(process.env.KO_REACTION_LINK_FILE!),
    koPathwayLinkFile: linkLocation(process.env.KO_PATHWAY_LINK_FILE!),
    koModuleLinkFile: linkLocation(process.env.KO_MODULE_LINK_FILE!),
    reactionCompoundLinkFile: linkLocation(process.env.REACTION_COMPOUND_LINK_FILE!),
    reactionPathwayLinkFile: linkLocation(process.env.REACTION_PATHWAY_LINK_FILE!),
    reactionModuleLinkFile: linkLocation(process.env.REACTION_MODULE_LINK_FILE!),
    compoundPathwayLinkFile: linkLocation(process.env.COMPOUND_PATHWAY_LINK_FILE!),
    compoundModuleLinkFile: linkLocation(process.env.COMPOUND_MODULE_LINK_FILE!)
};

export default config;
