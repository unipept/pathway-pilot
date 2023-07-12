<template>
    <v-card flat height="100%">
        <v-card-title>
            <h3 class="text-h5">Use the taxonomy to filter your sample</h3>
        </v-card-title>

        <v-card-text v-if="selectedPathway">
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

            <treeview v-if="filteredTaxaTree"
                v-model="selectedItems"
                :node="filteredTaxaTree"
                :max="4"
                :expanded="expandTree"
            />

            <warning-alert v-else class="mt-3">
                It seems like all matches for this pathway point back to the taxonomic root. As a result, you will not be able 
                to visualise more specific highlights for this pathway.
            </warning-alert>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import Taxon from '@/logic/entities/Taxon';
import useSingleSampleStore from '@/stores/sample/SingleSampleStore';
import { storeToRefs } from 'pinia';
import useVisualisationStore from '@/stores/VisualisationStore';
import WarningAlert from '@/components/alerts/WarningAlert.vue';
import Treeview from '@/components/visualisations/Treeview.vue';
import { TreeviewItem } from '@/components/visualisations/TreeviewItem';
import { useTaxonomyTree } from '@/composables/useTaxonomyTree';
import { computed } from 'vue';

const mappingStore = useSingleSampleStore();
const visualisationStore = useVisualisationStore();

const { fetchTaxonomyTree, compressRankTree, filterTree } = useTaxonomyTree();

const { taxaTree } = storeToRefs(mappingStore);
const { pathway: selectedPathway, highlightedItems: selectedTaxa } = storeToRefs(visualisationStore);

const taxa = computed(() => mappingStore.pathwayToTaxa(selectedPathway.value?.id!));

const compressedTaxaTree = computed(() => compressRankTree(taxaTree.value, taxa.value, true));
const filteredTaxaTree = ref<TreeviewItem>(compressedTaxaTree.value);

const taxaSearch = ref<string>("");
const selectedItems = ref<TreeviewItem[]>(selectedTaxa.value.map(taxonId => {
    const taxon = mappingStore?.taxon(taxonId) ?? new Taxon(taxonId, "Unknown", "Unknown");
    return {
        id: taxonId,
        name: taxon.name,
        nameExtra: taxon.rank,
        highlighted: false,
        children: []
    };
}));

const expandTree = ref<number>(15);

watch(taxaSearch, (val) => {
    filteredTaxaTree.value = filterTree(compressedTaxaTree.value, val);
    expandTree.value = val === '' ? 15 : expandTree.value + 10;
});

watch(selectedPathway, async () => {
    if (selectedPathway.value) {
        mappingStore.updateTree(await fetchTaxonomyTree(taxa.value));
    }

    taxaSearch.value = "";
    expandTree.value = 15;
    selectedItems.value = [];
    filteredTaxaTree.value = compressedTaxaTree.value;
});

watch(selectedItems, () => {
    visualisationStore.setHighlightedItems(selectedItems.value.map(item => item.id));
});
</script>
