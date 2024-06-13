import ColorConstants from "@/logic/constants/ColorConstants";
import EcNumber from "@/logic/entities/EcNumber";
import { intersection } from "@/logic/util/SetUtil";
import FileFormat from "@/views/stepper/FileFormat";
import { useDivergingLog } from "./useDivergingLog";

export function useMapAnnotator(
    ecNumbers: Set<string>,
    getSize: () => number,
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

    const colorDifferential = (fileFormat: FileFormat, areas: any[], group1: number, group2: number) => {
        console.log(fileFormat)

        const group1EcNumbers = groupToEcNumbers(group1);
        const group2EcNumbers = groupToEcNumbers(group2);

        const range = [ 0, 0 ];
        const differenceAreas = areas.map(area => {
            area.colors = [];

            const group1EcInArea: Set<string> = intersection(group1EcNumbers, new Set(area.info.ecNumbers.map((ec: EcNumber) => ec.id)));
            const group2EcInArea: Set<string> = intersection(group2EcNumbers, new Set(area.info.ecNumbers.map((ec: EcNumber) => ec.id)));

            const group1Peptides = new Set([ ...group1EcInArea ].map(ec => ecToPeptides(ec)).flat());
            const group2Peptides = new Set([ ...group2EcInArea ].map(ec => ecToPeptides(ec)).flat());
            
            if (fileFormat === FileFormat.PEPTIDE_LIST) {
                const group1PeptideCount = [ ...group1Peptides ].map(peptide => peptideToCount(peptide)).reduce((a, b) => a + b, 0) / getSize();
                const group2PeptideCount = [ ...group2Peptides ].map(peptide => peptideToCount(peptide)).reduce((a, b) => a + b, 0) / getSize();

                if (group1PeptideCount > 0 || group2PeptideCount > 0) {
                    const difference = group2PeptideCount - group1PeptideCount;
                    range[0] = Math.min(range[0], difference);
                    range[1] = Math.max(range[1], difference);

                    area.colors = [ difference ];
                }

                area.info.counts = [ 
                    "Relative amount of matches group 1: " + group1PeptideCount.toPrecision(5),
                    "Relative amount of matches group 2: " + group2PeptideCount.toPrecision(5)
                ];

                return area;
            }

            const group1PeptideCount = [ ...group1Peptides ].map(peptide => peptideToCount(peptide)).reduce((a, b) => a + b, 1);
            const group2PeptideCount = [ ...group2Peptides ].map(peptide => peptideToCount(peptide)).reduce((a, b) => a + b, 1);

            if (group1PeptideCount > 1 || group2PeptideCount > 1) {
                const log2FoldChange = Math.log2(group2PeptideCount) - Math.log2(group1PeptideCount);

                range[0] = Math.min(range[0], log2FoldChange);
                range[1] = Math.max(range[1], log2FoldChange);

                area.colors = [ log2FoldChange ];
            }

            area.info.counts = [ 
                "Log2 intensity group 1: " + Math.log2(group1PeptideCount).toPrecision(7),
                "Log2 intensity group 2: " + Math.log2(group2PeptideCount).toPrecision(7)
            ];

            return area;
        });

        const { getColor } = useDivergingLog(
            [ range[0], 0, range[1] ],
            ColorConstants.LEGEND[0], "#ffffe0", ColorConstants.LEGEND[1]
        );
    
        return differenceAreas.map(area => {
            area.colors = area.colors.map((n: number) => getColor(n));
            return area;
        });
    };

    const color = (fileFormat: FileFormat, areas: any[], highlightedGroups: number[], abundance: boolean = false) => {
        if (abundance) {
            return colorDifferential(fileFormat, areas, highlightedGroups[0], highlightedGroups[1]);
        }
    
        if (highlightedGroups.length > 0) {
            return colorHighlightedGroups(areas, highlightedGroups);
        }

        return colorAllAreas(areas);
    };

    return {
        colorAllAreas,
        colorHighlightedGroups,
        colorDifferential,
        color
    };
};
