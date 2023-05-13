<template>
    <v-text-field
        class="mt-3 mb-n3"
        v-model="search"
        label="Search for an identifier or name"
        prepend-inner-icon="mdi-magnify"
        variant="solo"
        density="comfortable"
    />

    <treeview v-if="test"
        expanded
        :node="test"
        :amount-selected="0"
        :max-selected="4"
    />
</template>

<script lang="ts" setup>
import Treeview from '@/components/visualisations/Treeview.vue';
import { ref } from 'vue';

const search = ref<string>("");

const test = JSON.parse('{"id":1,"name":"Organism","rank":"no rank","data":{"count":8,"self_count":1},"children":[{"id":2,"name":"Bacteria","rank":"superkingdom","data":{"count":6,"self_count":1},"children":[{"id":1239,"name":"Firmicutes","rank":"phylum","data":{"count":2,"self_count":1},"children":[{"id":186802,"name":"Eubacteriales","rank":"order","data":{"count":1,"self_count":1},"children":[],"highlighted":true,"nameExtra":"order"}],"highlighted":true,"nameExtra":"phylum"},{"id":201174,"name":"Actinobacteria","rank":"phylum","data":{"count":2,"self_count":0},"children":[{"id":85004,"name":"Bifidobacteriales","rank":"order","data":{"count":2,"self_count":0},"children":[{"id":31953,"name":"Bifidobacteriaceae","rank":"family","data":{"count":2,"self_count":1},"children":[{"id":1678,"name":"Bifidobacterium","rank":"genus","data":{"count":1,"self_count":1},"children":[],"highlighted":true,"nameExtra":"genus"}],"highlighted":true,"nameExtra":"family"}],"highlighted":false,"nameExtra":"order"}],"highlighted":false,"nameExtra":"phylum"},{"id":976,"name":"Bacteroidetes","rank":"phylum","data":{"count":1,"self_count":0},"children":[{"id":171549,"name":"Bacteroidales","rank":"order","data":{"count":1,"self_count":1},"children":[],"highlighted":true,"nameExtra":"order"}],"highlighted":false,"nameExtra":"phylum"}],"highlighted":true,"nameExtra":"superkingdom"},{"id":2759,"name":"Eukaryota","rank":"superkingdom","data":{"count":1,"self_count":0},"children":[{"id":4751,"name":"Fungi","rank":"kingdom","data":{"count":1,"self_count":0},"children":[{"id":4890,"name":"Ascomycota","rank":"phylum","data":{"count":1,"self_count":0},"children":[{"id":4892,"name":"Saccharomycetales","rank":"order","data":{"count":1,"self_count":0},"children":[{"id":4893,"name":"Saccharomycetaceae","rank":"family","data":{"count":1,"self_count":0},"children":[{"id":4930,"name":"Saccharomyces","rank":"genus","data":{"count":1,"self_count":1},"children":[],"highlighted":true,"nameExtra":"genus"}],"highlighted":false,"nameExtra":"family"}],"highlighted":false,"nameExtra":"order"}],"highlighted":false,"nameExtra":"phylum"}],"highlighted":false,"nameExtra":"kingdom"}],"highlighted":false,"nameExtra":"superkingdom"}],"highlighted":false,"nameExtra":"no rank"}')

const children = (taxonId: number) => {
    const collectChildren = (root: any) => {
        const _children = [];

        const nodes = [ ...root.children ];
        while (nodes.length > 0) {
            const node = nodes.pop();

            // TODO: check whether this node is in the list of taxa
            _children.push(node.id);

            nodes.push(...node.children)
        }

        return _children;
    }

    const nodes = [ test ];
    while (nodes.length > 0) {
        const node = nodes.pop();

        if (node.id === taxonId) {
            return collectChildren(node);
        }

        nodes.push(...node.children);
    }

    return [];
}

console.log(children(976))
</script>
