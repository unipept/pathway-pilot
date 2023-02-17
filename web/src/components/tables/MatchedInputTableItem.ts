export interface MatchedInputTableItem {
    raw_input: string,
    taxon_id: number,
    taxon_name: string,
    taxon_rank: string,

    node_annotations: string[],
    matched_annotations: string[]
};
