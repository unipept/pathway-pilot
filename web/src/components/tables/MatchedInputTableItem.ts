export interface MatchedInputTableItem {
    taxon_id: number,
    taxon_name: string,
    taxon_rank: string,

    node_annotations: string[],
    matched_annotations: string[]
};
