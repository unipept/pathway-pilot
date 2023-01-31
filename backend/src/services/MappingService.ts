import { PathwayMap } from "../mappings/PathwayMap";
import { KoMap } from "../mappings/KoMap";

export const findPathwayMapping = async (pathwayId: string) => {
    const mapping = await PathwayMap.fromPathwayMapFile("../../data/pathway");

    const pathway = mapping.get(pathwayId);
    if (!pathway) {
        throw new Error("Pathway not found");
    }

    return pathway;
};

export const findPathwayMappings = async () => {
    return await PathwayMap.fromPathwayMapFile("../../data/pathway");
};

export const findKoMapping = async (koId: string) => {
    const mapping = await KoMap.fromKoMapFile("../../data/ko");

    const pathway = mapping.get(koId);
    if (!pathway) {
        throw new Error("KO number not found");
    }

    return pathway;
};

export const findKoMappings = async () => {
    return await KoMap.fromKoMapFile("../../data/ko");
};
