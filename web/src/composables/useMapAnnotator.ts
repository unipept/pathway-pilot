import ColorConstants from "@/logic/constants/ColorConstants";
import EcNumber from "@/logic/entities/EcNumber";
import { useLinearGradient } from "./useLinearGradient";

export function useMapAnnotator(
    ecNumbers: Set<string>, 
    taxaToEcs: Map<number, Set<string>>,
    children: (taxonId: number) => number[],
) {
    const colorAllTaxa = (areas: any[]) => {
        return areas.map(area => {
            area.colors = [];
    
            if (area.info.ecNumbers.some((ec: EcNumber) => ecNumbers.has(ec.id))) {
                area.colors.push(ColorConstants.LEGEND[0]);
            }
    
            return area;
        });
    };

    const colorHighlightedTaxa = (areas: any[], highlightedTaxa: number[]) => {
        const color = (id: number) => ColorConstants.LEGEND[[ ...highlightedTaxa ].indexOf(id)];

        const taxaToEcNumbers = new Map<number, Set<string>>();
        for (const taxon of highlightedTaxa) {
            const ecNumbers = [ ...taxaToEcs.get(taxon) ?? [] ];
            const childrenEcNumbers = [ ...children(taxon) ]
                .map((child: number) => [ ...taxaToEcs.get(child) ?? []])
                .flat();

            taxaToEcNumbers.set(taxon, new Set([ ...ecNumbers, ...childrenEcNumbers ]));
        }

        return areas.map(area => {
            area.colors = new Set();

            for (const taxon of highlightedTaxa) {
                const ecNumbers = [ ...taxaToEcNumbers.get(taxon) ?? [] ];

                if (area.info.ecNumbers.some((ec: EcNumber) => ecNumbers.includes(ec.id))) {
                    area.colors.add(color(taxon));
                }
            }

            area.colors = [ ...area.colors ].sort();

            return area;
        });
    };

    const colorDifferential = (areas: any[], group1: number, group2: number) => {
        const { getColor } = useLinearGradient(ColorConstants.LEGEND[0], ColorConstants.LEGEND[1]);



        // TODO: look at the difference
        //  - Negative: Group 2 has more (Position in gradient > 0.5)
        //  - Positive: Group 1 has more (Position in gradient < 0.5)

        // TODO: How do we determine the color in the gradient?
    };

    return {
        colorAllTaxa,
        colorHighlightedTaxa
    };
};
