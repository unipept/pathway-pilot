import * as d3 from "d3";

export function useDivergingLog(interval: number[], color1: string, color2: string, color3: string) {
    const scale = d3.scaleDivergingSymlog(
        interval, d3.interpolateRgbBasis([color1, color2, color3])
    );

    const getColor = (position: number = 0.5) => {
        return scale(position);
    }
    
    return {
        getColor
    };
};
