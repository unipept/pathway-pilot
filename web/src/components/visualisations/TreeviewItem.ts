export interface TreeviewItem {
    id: number
    name: string
    nameExtra: string
    highlighted: boolean
    children: TreeviewItem[]

    match?: { start: number, end: number }
};
