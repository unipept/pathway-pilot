import { PathwayMap } from "../mappings/PathwayMap";
import { KoMap } from "../mappings/KoMap";

// TODO: Put file locations in config file
// TODO: Better error differentiation

/**
 * Finds the pathway mapping for the given pathwayId
 * 
 * @param pathwayId The pathwayId to find the mapping for
 * @returns         The mapping for the given pathwayId
 * @throws          Error if the pathwayId is not found
 */
export const findPathwayMapping = async (pathwayId: string) => {
    const mapping = await PathwayMap.fromPathwayMapFile("../../data/pathway");

    const pathway = mapping.get(pathwayId);
    if (!pathway) {
        throw new Error("Pathway not found");
    }

    return pathway;
};

/**
 * Finds all pathway mappings
 * 
 * @returns All pathway mappings
 */
export const findPathwayMappings = async () => {
    return await PathwayMap.fromPathwayMapFile("../../data/pathway");
};

/**
 * Finds the KO mapping for the given KO number
 * 
 * @param koId The KO number to find the mapping for
 * @returns    The mapping for the given KO number
 * @throws     Error if the KO number is not found
 */
export const findKoMapping = async (koId: string) => {
    const mapping = await KoMap.fromKoMapFile("../../data/ko");

    const pathway = mapping.get(koId);
    if (!pathway) {
        throw new Error("KO number not found");
    }

    return pathway;
};

/**
 * Finds all KO mappings
 * 
 * @returns All KO mappings
 */
export const findKoMappings = async () => {
    return await KoMap.fromKoMapFile("../../data/ko");
};
