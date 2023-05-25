export function useLinearGradient(color1: string, color2: string) {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);

    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const getColor = (position: number = 0.5) => {
        const r = Math.round(r1 + (r2 - r1) * position);
        const g = Math.round(g1 + (g2 - g1) * position);
        const b = Math.round(b1 + (b2 - b1) * position);

        return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    }
    
    return {
        getColor
    };
};
