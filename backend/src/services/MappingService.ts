import pathwayMap from "../mappings/PathwayMap";
import koMap from "../mappings/KoMap";
import ecMap from "../mappings/EcMap";
import reactionMap from "../mappings/ReactionMap";

// TODO: Better error differentiation

/**
 * Finds the pathway mapping for the given pathwayId
 * 
 * @param pathwayId The pathwayId to find the mapping for
 * @returns         The mapping for the given pathwayId
 * @throws          Error if the pathwayId is not found
 */
export const findPathwayMapping = async (pathwayId: string) => {
    const pathway = pathwayMap.get(pathwayId);
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
    return pathwayMap;
};

/**
 * Finds the KO mapping for the given KO number
 * 
 * @param koNumber  The KO number to find the mapping for
 * @returns         The mapping for the given KO number
 * @throws          Error if the KO number is not found
 */
export const findKoMapping = (koNumber: string) => {
    const ko = koMap.get(koNumber);
    if (!ko) {
        throw new Error("KO number not found");
    }

    return ko;
};

/**
 * Finds all KO mappings
 * 
 * @returns All KO mappings
 */
export const findKoMappings = () => {
    return koMap;
};

/**
 * Finds the EC mapping for the given EC number
 * 
 * @param ecNumber  The EC number to find the mapping for
 * @returns         The mapping for the given EC number
 * @throws          Error if the EC number is not found
 */
export const findEcMapping = async (ecNumber: string) => {
    const ec = ecMap.get(ecNumber);
    if (!ec) {
        throw new Error("EC number not found");
    }

    return ec;
};

/**
 * Finds all EC mappings
 * 
 * @returns All EC mappings
 */
export const findEcMappings = async () => {
    return ecMap;
};

/**
 * Finds the Reaction mapping for the given Reaction id
 * 
 * @param reactionId    The Reaction id to find the mapping for
 * @returns             The mapping for the given Reaction id
 * @throws              Error if the Reaction id is not found
 */
export const findReactionMapping = async (reactionId: string) => {
    const reaction = reactionMap.get(reactionId);
    if (!reaction) {
        throw new Error("Reaction id not found");
    }

    return reaction;
};

/**
 * Finds all Reaction mappings
 * 
 * @returns All Reaction mappings
 */
export const findReactionMappings = async () => {
    return reactionMap;
};
