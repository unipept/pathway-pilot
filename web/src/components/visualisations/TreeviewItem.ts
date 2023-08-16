export interface TreeviewItem {
    id: number
    name: string
    nameExtra: string
    highlighted: boolean
    children: TreeviewItem[]

    match?: { start: number, end: number }
};

export const defaultTreeviewItem: TreeviewItem = { 
    id: 1, 
    name: "Organism", 
    nameExtra: "no rank", 
    highlighted: false, 
    children: [] 
};
