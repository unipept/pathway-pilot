<template>
    <div v-if="selectedPathway" class="mt-3">
        <v-row>
            <v-col v-if="selectedTaxa">
                <p class="subtitle mb-2">
                    By default, PathwayPilot highlights all nodes that correspond to a match between the selected pathway and your input data. However, to further refine the 
                    visualization, you have the option to select a <b>maximum of four taxa</b>. By doing so, the highlighting will be limited to nodes that are specifically 
                    associated with the selected pathway and the chosen taxa. This allows for a more focused and relevant representation of the pathway.
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
                    :expanded="expandTree"
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

const { taxaTree, compressedTaxaTree } = storeToRefs(mappingStore);
const { pathway: selectedPathway, highlightedTaxa: selectedTaxa } = storeToRefs(visualisationStore);

const tree = ref<TreeviewItem>(compressedTaxaTree.value);

const taxaSearch = ref<string>("");
const selectedItems = ref<TreeviewItem[]>([]);

const expandTree = ref<number>(2);

watch(() => taxaTree.value, () => {
    tree.value = compressedTaxaTree.value;
    taxaSearch.value = "";
    expandTree.value = 2;
});

watch(() => taxaSearch.value, (val) => {
    tree.value = filterTree(compressedTaxaTree.value, val);
    expandTree.value = val === '' ? 2 : expandTree.value + 10;
});

watch(() => selectedPathway.value, () => {
    visualisationStore.setHighlightedTaxa([]);
    tree.value = compressedTaxaTree.value;
    selectedItems.value = [];
    taxaSearch.value = "";
    expandTree.value = 2;
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
