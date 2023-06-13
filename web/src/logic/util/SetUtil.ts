export const intersection = (setA: Set<any>, setB: Set<any>): Set<any> => {
    const intersection = new Set();

    for (const elem of setB) {
        if (setA.has(elem)) {
            intersection.add(elem);
        }
    }

    return intersection;
};
