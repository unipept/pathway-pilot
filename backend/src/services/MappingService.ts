import { PathwayMap } from "../mappings/PathwayMap";
import { KoMap } from "../mappings/KoMap";
import { buildPathwayMap } from "./mapping/PathwayMappingService";
import { buildKoMap } from "./mapping/KoMappingService";
import { buildEcMap } from "./mapping/EcMappingService";

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
    const mapping = await buildPathwayMap();

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
    return await buildPathwayMap();
};

/**
 * Finds the KO mapping for the given KO number
 * 
 * @param koNumber  The KO number to find the mapping for
 * @returns         The mapping for the given KO number
 * @throws          Error if the KO number is not found
 */
export const findKoMapping = async (koNumber: string) => {
    const mapping = await buildKoMap();

    const pathway = mapping.get(koNumber);
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
    return await buildKoMap();
};

/**
 * Finds the EC mapping for the given EC number
 * 
 * @param ecNumber  The EC number to find the mapping for
 * @returns         The mapping for the given EC number
 * @throws          Error if the EC number is not found
 */
export const findEcMapping = async (ecNumber: string) => {
    const mapping = await buildEcMap();

    const pathway = mapping.get(ecNumber);
    if (!pathway) {
        throw new Error("EC number not found");
    }

    return pathway;
};

/**
 * Finds all EC mappings
 * 
 * @returns All EC mappings
 */
export const findEcMappings = async () => {
    return await buildEcMap();
};
