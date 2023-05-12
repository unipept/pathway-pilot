import { ref } from 'vue';
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
    const filterTree = (tree: any, taxa: number[]) => {
        const updatedChildren: any[] = [];
        for (const child of tree.children) {
            updatedChildren.push(...filterTree(child, taxa));
        }

        if (taxa.includes(tree.id)) {
            tree.highlighted = tree.id !== 1;
            tree.children = updatedChildren;
            tree.nameExtra = tree.rank;
            return [ tree ];
        } else {
            tree.highlighted = false;
            return updatedChildren;
        }
    }

    const filterRankTree = (tree: any, taxa: number[]) => {
        tree.highlighted = taxa.includes(tree.id) && tree.id !== 1;

        const updatedChildren: any[] = [];
        for (const child of tree.children) {
            updatedChildren.push(...filterRankTree(child, taxa));
        }

        if (RANKS.includes(tree.rank)) {
            tree.children = updatedChildren;
            tree.nameExtra = tree.rank;
            return [ tree ];
        } else {
            return updatedChildren;
        }
    }

    const fetchTaxonomyTree = async (taxa: number[], filterRanks: boolean = true) => {
        const _tree = await new UnipeptCommunicator().fetchTaxonomy(taxa);

        // Filter the tree
        if (filterRanks) {
            return filterRankTree(_tree, taxa)[0];
        }
        return filterTree(_tree, taxa)[0];
    }

    return {
        fetchTaxonomyTree
    };
};
