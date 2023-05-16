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
    'species'
]

export function useTaxonomyTree() {    
    const compressTree = (tree: any, taxa: number[], highlight: boolean = true) => {
        const updatedChildren: any[] = [];
        for (const child of tree.children) {
            updatedChildren.push(...compressTree(child, taxa));
        }

        if (taxa.includes(tree.id)) {
            if (highlight) {
                tree.highlighted = tree.id !== 1;
            }

            tree.children = updatedChildren;
            tree.nameExtra = tree.rank;
            return [ tree ];
        } else {
            if (highlight) {
                tree.highlighted = false;
            }

            return updatedChildren;
        }
    }

    const compressRankTree = (tree: any, taxa: number[], highlight: boolean = true) => {
        if (highlight) {
            tree.highlighted = taxa.includes(tree.id) && tree.id !== 1;
        }

        const updatedChildren: any[] = [];
        for (const child of tree.children) {
            updatedChildren.push(...compressRankTree(child, taxa));
        }

        if (RANKS.includes(tree.rank)) {
            tree.children = updatedChildren;
            tree.nameExtra = tree.rank;
            return [ tree ];
        } else {
            return updatedChildren;
        }
    }

    const fetchTaxonomyTree = async (taxa: number[], compressRanks: boolean = true) => {
        const _tree = await new UnipeptCommunicator().fetchTaxonomy(taxa);

        // Filter the tree
        if (compressRanks) {
            return compressRankTree(_tree, taxa)[0];
        }
        return compressTree(_tree, taxa)[0];
    }

    const matchItem = (item: TreeviewItem, filter: string) => {
        return item.name.toLowerCase().indexOf(filter.toLowerCase());
    }

    const filterTree = (node: TreeviewItem, filter: string): [ boolean, TreeviewItem ] => {
        if (filter === '') {
            return [ true, node ];
        }

        const updatedChildren: TreeviewItem[] = [];
        for (const child of node.children) {
            const [ keep, updatedChild ] = filterTree(child, filter);

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

    return {
        fetchTaxonomyTree,
        filterTree
    };
};
