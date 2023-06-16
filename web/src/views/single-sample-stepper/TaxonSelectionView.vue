<template>
    <div v-if="selectedPathway" class="mt-5">
        <v-row class="mt-5">
            <v-col v-if="selectedTaxa">
                <p class="subtitle">
                    By default we will highlight all nodes with a match between the selected pathway and your input data. By selecting <b>a maximum of 4</b> taxa, we can narrow 
                    this down to only highlight nodes that are associated with the selected pathway and taxa.
                </p>

                <div class="d-flex">
                    <v-text-field 
                        class="mt-3 mb-n3"
                        v-model="taxaSearch"
                        label="Search for a taxon or rank" 
                        prepend-inner-icon="mdi-magnify"
                        variant="solo"
                        density="comfortable"
                    />
                    <v-label v-if="selectedTaxa.length === 0" class="px-5">No taxa selected</v-label>
                    <v-label v-else class="px-5">{{ selectedTaxa.length }} out of 4 taxa selected</v-label>
                </div>

                <treeview v-if="tree"
                    v-model="selectedItems"
                    :node="tree"
                    :max="4"
                    expanded
                />

                <warning-alert v-else class="mt-3">
                    It seems like all matches for this pathway point back to the taxonomic root. As a result, you will not be able 
                    to visualise more specific highlights for this pathway.
                </warning-alert>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import Taxon from '@/logic/entities/Taxon';
import useSingleSampleStore from '@/stores/SingleSampleStore';
import { storeToRefs } from 'pinia';
import useVisualisationStore from '@/stores/VisualisationStore';
import WarningAlert from '@/components/alerts/WarningAlert.vue';
import Treeview from '@/components/visualisations/Treeview.vue';
import { TreeviewItem } from '@/components/visualisations/TreeviewItem';
import { useTaxonomyTree } from '@/composables/useTaxonomyTree';

const mappingStore = useSingleSampleStore();
const visualisationStore = useVisualisationStore();

const { filterTree } = useTaxonomyTree();

const { taxaTree } = storeToRefs(mappingStore);
const { pathway: selectedPathway, highlightedTaxa: selectedTaxa } = storeToRefs(visualisationStore);

const tree = ref<TreeviewItem>(taxaTree.value);
const taxaSearch = ref<string>("");
const selectedItems = ref<TreeviewItem[]>([]);

watch(() => taxaTree.value, () => {
    tree.value = taxaTree.value;
    taxaSearch.value = "";
});

watch(() => taxaSearch.value, (val) => {
    tree.value = filterTree(JSON.parse(JSON.stringify(taxaTree.value)), val)[1];
});

watch(() => selectedPathway.value, () => {
    taxaSearch.value = "";
    selectedItems.value = [];
    tree.value = taxaTree.value;
    visualisationStore.setHighlightedTaxa([]);
});

watch(() => selectedItems.value, () => {
    visualisationStore.setHighlightedTaxa(selectedItems.value.map(item => 
        new Taxon(item.id, item.name, item.nameExtra)
    ));
});
</script>

<style scoped>
.subtitle {
    color: #454545;
}
</style>
