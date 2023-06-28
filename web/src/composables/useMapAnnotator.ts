import ColorConstants from "@/logic/constants/ColorConstants";
import EcNumber from "@/logic/entities/EcNumber";
import { useLinearGradient } from "./useLinearGradient";
import { intersection } from "@/logic/util/SetUtil";

export function useMapAnnotator(
    ecNumbers: Set<string>,
    ecToPeptides: (ec: string) => string[], 
    groupToEcs: (group: number) => string[],
    peptideToCount: (peptide: string) => number, 
    children?: (taxonId: number) => number[],
) {
    const groupToEcNumbers = (groupId: number) => {
        const ecNumbers = groupToEcs(groupId);

        if (!children) {
            return new Set(ecNumbers);
        }

        const childrenEcNumbers = [ ...children(groupId) ]
            .map((child: number) => groupToEcs(child))
            .flat();

        return new Set([ ...ecNumbers, ...childrenEcNumbers ]);
    }

    const colorAllAreas = (areas: any[]) => {
        return areas.map(area => {
            area.colors = [];
    
            if (area.info.ecNumbers.some((ec: EcNumber) => ecNumbers.has(ec.id))) {
                area.colors.push(ColorConstants.LEGEND[0]);
            }
    
            return area;
        });
    };

    const colorHighlightedGroups = (areas: any[], highlightedGroups: number[]) => {
        const getColor = (id: number) => ColorConstants.LEGEND[[ ...highlightedGroups ].indexOf(id)];

        const groupsToEcNumbers = new Map<number, Set<string>>();
        for (const group of highlightedGroups) {
            groupsToEcNumbers.set(group, groupToEcNumbers(group));
        }

        return areas.map(area => {
            area.colors = new Set();

            for (const group of highlightedGroups) {
                const ecNumbers = [ ...groupsToEcNumbers.get(group) ?? [] ];

                if (area.info.ecNumbers.some((ec: EcNumber) => ecNumbers.includes(ec.id))) {
                    area.colors.add(getColor(group));
                }
            }

            area.colors = [ ...area.colors ].sort();

            return area;
        });
    };

    const colorDifferential = (areas: any[], group1: number, group2: number) => {
        const { getColor } = useLinearGradient(ColorConstants.LEGEND[0], ColorConstants.LEGEND[1]);

        const group1EcNumbers = groupToEcNumbers(group1);
        const group2EcNumbers = groupToEcNumbers(group2);

        const range = [ 0, 0 ];
        const differenceAreas = areas.map(area => {
            area.colors = [];

            const group1EcInArea: Set<string> = intersection(group1EcNumbers, new Set(area.info.ecNumbers.map((ec: EcNumber) => ec.id)));
            const group2EcInArea: Set<string> = intersection(group2EcNumbers, new Set(area.info.ecNumbers.map((ec: EcNumber) => ec.id)));

            const group1Peptides = new Set([ ...group1EcInArea ].map(ec => ecToPeptides(ec)).flat());
            const group2Peptides = new Set([ ...group2EcInArea ].map(ec => ecToPeptides(ec)).flat());
            
            const group1PeptideCount = [ ...group1Peptides ].map(peptide => peptideToCount(peptide)).reduce((a, b) => a + b, 0);
            const group2PeptideCount = [ ...group2Peptides ].map(peptide => peptideToCount(peptide)).reduce((a, b) => a + b, 0);

            if (group1PeptideCount > 0 || group2PeptideCount > 0) {
                const difference = group2PeptideCount - group1PeptideCount;
                range[0] = Math.min(range[0], difference);
                range[1] = Math.max(range[1], difference);

                area.colors = [ difference ];
            }

            return area;
        });

        const scale = (n: number, min: number, max: number, minR: number, maxR: number) => {
            if (min === max) {
                return 0.5;
            }
            return (maxR - minR) * (n - min) / (max - min) + minR;
        }

        let lower = 0;
        let upper = 1;
        if (range[0] >= 0 && range[1] >= 0) {
            lower = 0.5;
        } else if (range[0] <= 0 && range[1] <= 0) {
            upper = 0.5;
        }

        return differenceAreas.map(area => {
            area.colors = area.colors.map((n: number) => getColor(scale(n, range[0], range[1], lower, upper)));
            return area;
        });
    };

    return {
        colorAllAreas,
        colorHighlightedGroups,
        colorDifferential,
    };
};
