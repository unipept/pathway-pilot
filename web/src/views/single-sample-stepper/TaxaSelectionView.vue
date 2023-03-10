<template>
    <div v-if="selectedPathway" class="mt-5">
        <v-row class="mt-5">
            <v-col v-if="selectedTaxa">
                <h3>Select multiple taxa <span style="font-size: x-small; color: #7a7a7a;">OPTIONAL</span></h3>
                <p class="subtitle">
                    By default we will highlight all nodes with a match between the selected pathway and your input data. By selecting <b>a maximum of 4</b> taxa, we can narrow 
                    this down to only highlight nodes that are associated with the selected pathway and taxa.
                </p>
                <div class="d-flex" v-if="speciesItems.length > 0">
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
                <species-table v-if="speciesItems.length > 0"
                    v-model="selectedTaxa"
                    :items="speciesItems"
                    :search="taxaSearch"
                    :max=4
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
import { computed, ref, watch } from 'vue';
import SpeciesTable from '@/components/tables/selection/SpeciesTable.vue';
import Taxon from '@/logic/entities/Taxon';
import useSingleSampleStore from '@/stores/SingleSampleStore';
import { storeToRefs } from 'pinia';
import useVisualisationStore from '@/stores/VisualisationStore';
import WarningAlert from '@/components/alerts/WarningAlert.vue';

const mappingStore = useSingleSampleStore('single-sample');
const visualisationStore = useVisualisationStore();

const { pathwaysToTaxa } = storeToRefs(mappingStore);
const { pathway: selectedPathway, highlightedTaxa: selectedTaxa } = storeToRefs(visualisationStore);

const taxaSearch = ref<string>("");

const speciesItems = computed(() => {
    if (!selectedPathway.value) {
        return [];
    }

    return [...pathwaysToTaxa.value.get(selectedPathway.value.id) ?? []]
        .filter((taxon: Taxon) => taxon.id !== 1)
        .map((taxon: Taxon) => ({
                id: taxon.id,
                name: taxon.name,
                rank: taxon.rank,
                count: 0
            })
        );
});

watch(() => selectedPathway.value, () => {
    taxaSearch.value = "";
    visualisationStore.setHighlightedTaxa([]);
});
</script>

<style scoped>
.subtitle {
    color: #454545;
}
</style>
