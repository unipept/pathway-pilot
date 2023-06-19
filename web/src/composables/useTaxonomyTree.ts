import { TreeviewItem } from '@/components/visualisations/TreeviewItem';
import UnipeptCommunicator from '../logic/communicators/UnipeptCommunicator';

const RANKS = [
    'no rank',
    'superkingdom',
    'kingdom',
    'phylum',
    'class',
    'order',
    'family',
    'genus',
    'species',
    'strain'
];

export function useTaxonomyTree() {    
    const _compressRankTree = (tree: any, taxa: number[], highlight: boolean = true) => {
        if (highlight) {
            tree.highlighted = taxa.includes(tree.id) && tree.id !== 1;
        }

        const updatedChildren: any[] = [];
        for (const child of tree.children) {
            updatedChildren.push(..._compressRankTree(child, taxa));
        }

        if (RANKS.includes(tree.rank)) {
            tree.children = updatedChildren;
            tree.nameExtra = tree.rank;
            return [ tree ];
        } else {
            return updatedChildren;
        }
    }

    const compressRankTree = (tree: any, taxa: number[], highlight: boolean = true) => {
        return _compressRankTree(JSON.parse(JSON.stringify(tree)), taxa, highlight)[0];
    }

    const fetchTaxonomyTree = async (taxa: number[]) => {
        return await new UnipeptCommunicator().fetchTaxonomy(taxa);
    }

    const matchItem = (item: TreeviewItem, filter: string) => {
        return item.name.toLowerCase().indexOf(filter.toLowerCase());
    }

    const _filterTree = (node: TreeviewItem, filter: string): [ boolean, TreeviewItem ] => {
        if (filter === '') {
            return [ true, node ];
        }

        const updatedChildren: TreeviewItem[] = [];
        for (const child of node.children) {
            const [ keep, updatedChild ] = _filterTree(child, filter);

            if (keep) {
                updatedChildren.push(updatedChild);
            }
        }

        node.children = updatedChildren;

        const match = matchItem(node, filter);

        if (match !== -1) {
            node.match = { start: match, end: match + filter.length };
        }

        return [ updatedChildren.length > 0 || match !== -1, node ];
    }

    const filterTree = (node: TreeviewItem, filter: string): TreeviewItem => {
        return _filterTree(JSON.parse(JSON.stringify(node)), filter)[1];
    }

    return {
        fetchTaxonomyTree,
        compressRankTree,
        filterTree
    };
};
