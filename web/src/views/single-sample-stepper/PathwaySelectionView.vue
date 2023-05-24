<template>
    <div v-if="initialized" class="mt-5">
        <v-row>
            <v-col cols=5>
                <p class="subtitle">
                    Please select a pathway you wish to visualise. You can either use the table below or utilise the bubbleplot visualisation 
                    on the right. In case of a large amount of pathways, you can always look for the pathway using the ID or name.
                </p>

                <p class="mt-3 subtitle">
                    Depending on the amount of matches and the Unipept results for your chosen pathway, it might be possible to select 
                    multiple taxa. This will allow you to visualise the pathway with a more specific coloring.
                </p>

                <p v-if="pathwayItems.length <= 0" class="mt-3 subtitle">
                    Unfortunately, we were not able to visualise your input data on any pathway.
                </p>
                <p v-else class="mt-3 subtitle">
                    We were able to visualise your input data on <b>{{ pathwayItems.length }}</b> unique pathways.
                </p>
            </v-col>

            <v-col cols=7>
                <bubble-plot v-if="pathwayItems.length > 0"
                    v-model="selectedPathway"
                    :items="pathwayItems"
                    @update:model-value="onBubblePlotClick"    
                />
            </v-col>
        </v-row>

        <v-row class="mt-5">
            <v-col cols=12>
                <p class="subtitle">
                    The table below list all the pathways that have at least one node in common with your input data. You can either 
                    scroll through the table or use the search bar to find the specific pathway you wish to visualise.
                </p>
                <v-text-field v-if="pathwayItems.length > 0"
                    class="mt-3 mb-n3"
                    v-model="pathwaySearch"
                    label="Search for an identifier or name"
                    prepend-inner-icon="mdi-magnify"
                    variant="solo"
                    density="comfortable"
                />
                <pathway-table v-if="pathwayItems.length > 0"
                    v-model="selectedPathway"
                    :items="pathwayItems"
                    :search="pathwaySearch"
                >
                    <template #download>
                        <v-btn class="ms-3" color="primary" variant="outlined" @click="onDownload">
                            <v-icon left>mdi-download</v-icon>
                            <span class="ms-1">Download table</span>
                        </v-btn>
                    </template>
                </pathway-table>
                <warning-alert v-else class="mt-3">
                    We were unable to match your input data with any pathways. You can always try to analyse a different input sample.
                </warning-alert>
            </v-col>
        </v-row>
    </div>

    <warning-alert v-else class="mt-5">
        In order to create your selection, you need to upload the data first.
    </warning-alert>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import PathwayTable from '@/components/tables/selection/PathwayTable.vue';
import Pathway from '@/logic/entities/Pathway';
import useSingleSampleStore from '@/stores/SingleSampleStore';
import { storeToRefs } from 'pinia';
import useVisualisationStore from '@/stores/VisualisationStore';
import useKeggStore from '@/stores/KeggStore';
import WarningAlert from '@/components/alerts/WarningAlert.vue';
import BubblePlot from '@/components/visualisations/BubblePlot.vue';
import { useCsvDownloader } from '@/composables/download/useCsvDownloader';
import UnipeptCommunicator from '@/logic/communicators/UnipeptCommunicator';
import { useTaxonomyTree } from '@/composables/useTaxonomyTree';

const { downloadCsv } = useCsvDownloader();
const { fetchTaxonomyTree } = useTaxonomyTree();

const mappingStore = useSingleSampleStore();
const keggStore = useKeggStore();
const visualisationStore = useVisualisationStore(); // TODO: use v-model instead of store

const { initialized, pathways, filtered, filteredPathways } = storeToRefs(mappingStore);
const { pathway: selectedPathway } = storeToRefs(visualisationStore);
const { pathwayMapping } = storeToRefs(keggStore);

const pathwaySearch = ref<string>("");

const pathwayItems = computed(() => [ ... (filtered.value ? filteredPathways.value : pathways.value) ]
    .map((pathway: string) => ({
            id: pathway,
            name: pathwayMapping.value.get(pathway)?.name ?? "",
            category: pathwayMapping.value.get(pathway)?.category ?? "",
            subCategory: pathwayMapping.value.get(pathway)?.subCategory ?? "",
            count: mappingStore.pathwaysToPeptideCounts.get(pathway)!
        })
    )
);

const onBubblePlotClick = (pathway: Pathway) => {
    visualisationStore.setPathway(pathway);
    visualisationStore.setHighlightedTaxa([]);
};

const onDownload = () => {
    const csvHeader = "id,name,category,subCategory,count";
    const csvData   =[...pathwayItems.value].sort((a, b) => b.count - a.count).map((pathway) => {
        return `${pathway.id},${pathway.name},${pathway.category},${pathway.subCategory},${pathway.count}`;
    });

    downloadCsv(csvData, "pathway-table.csv", csvHeader);
};

watch(selectedPathway, async (pathway: Pathway | undefined) => {
    visualisationStore.setPathway(pathway);
    visualisationStore.setHighlightedTaxa([]);

    if (pathway) {
        const tree = await fetchTaxonomyTree(Array.from(mappingStore.pathwaysToTaxa.get(pathway?.id)!), true);

        mappingStore.setTree(tree);
    }
});

onMounted(async () => {
    await keggStore.fetchPathwayMapping();
});
</script>

<style scoped>
.subtitle {
    color: #454545;
}
</style>
