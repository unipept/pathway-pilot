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
        v-model="selectedItems"
        :node="tree"
        :max="4"
    />

    <div>
        <h4 v-for="item of selectedItems">{{ item.name }}</h4>
    </div>

    <v-btn class="mt-5" @click="selectedItems = []">
        Clear selection
    </v-btn>
</template>

<script lang="ts" setup>
import Treeview from '@/components/visualisations/Treeview.vue';
import { TreeviewItem } from '@/components/visualisations/TreeviewItem';
import { ref } from 'vue';
import { useTaxonomyTree } from '@/composables/useTaxonomyTree';
import { computed } from 'vue';
import { watch } from 'vue';

const { filterTree } = useTaxonomyTree();

const search = ref<string>("");
const selectedItems = ref<TreeviewItem[]>([]);

const test = JSON.parse('{"id":1,"name":"Organism","rank":"no rank","data":{"count":8,"self_count":1},"children":[{"id":2,"name":"Bacteria","rank":"superkingdom","data":{"count":6,"self_count":1},"children":[{"id":1239,"name":"Firmicutes","rank":"phylum","data":{"count":2,"self_count":1},"children":[{"id":186802,"name":"Eubacteriales","rank":"order","data":{"count":1,"self_count":1},"children":[],"highlighted":true,"nameExtra":"order"}],"highlighted":true,"nameExtra":"phylum"},{"id":201174,"name":"Actinobacteria","rank":"phylum","data":{"count":2,"self_count":0},"children":[{"id":85004,"name":"Bifidobacteriales","rank":"order","data":{"count":2,"self_count":0},"children":[{"id":31953,"name":"Bifidobacteriaceae","rank":"family","data":{"count":2,"self_count":1},"children":[{"id":1678,"name":"Bifidobacterium","rank":"genus","data":{"count":1,"self_count":1},"children":[],"highlighted":true,"nameExtra":"genus"}],"highlighted":true,"nameExtra":"family"}],"highlighted":false,"nameExtra":"order"}],"highlighted":false,"nameExtra":"phylum"},{"id":976,"name":"Bacteroidetes","rank":"phylum","data":{"count":1,"self_count":0},"children":[{"id":171549,"name":"Bacteroidales","rank":"order","data":{"count":1,"self_count":1},"children":[],"highlighted":true,"nameExtra":"order"}],"highlighted":false,"nameExtra":"phylum"}],"highlighted":true,"nameExtra":"superkingdom"},{"id":2759,"name":"Eukaryota","rank":"superkingdom","data":{"count":1,"self_count":0},"children":[{"id":4751,"name":"Fungi","rank":"kingdom","data":{"count":1,"self_count":0},"children":[{"id":4890,"name":"Ascomycota","rank":"phylum","data":{"count":1,"self_count":0},"children":[{"id":4892,"name":"Saccharomycetales","rank":"order","data":{"count":1,"self_count":0},"children":[{"id":4893,"name":"Saccharomycetaceae","rank":"family","data":{"count":1,"self_count":0},"children":[{"id":4930,"name":"Saccharomyces","rank":"genus","data":{"count":1,"self_count":1},"children":[],"highlighted":true,"nameExtra":"genus"}],"highlighted":false,"nameExtra":"family"}],"highlighted":false,"nameExtra":"order"}],"highlighted":false,"nameExtra":"phylum"}],"highlighted":false,"nameExtra":"kingdom"}],"highlighted":false,"nameExtra":"superkingdom"}],"highlighted":false,"nameExtra":"no rank"}')

const tree = ref<TreeviewItem>(test);

watch(() => search.value, (newVal) => {
    tree.value = filterTree(JSON.parse(JSON.stringify(test)), search.value)[1];
    console.log(tree.value);
});
</script>
