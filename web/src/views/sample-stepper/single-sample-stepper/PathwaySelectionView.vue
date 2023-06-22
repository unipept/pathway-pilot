<template>
    <div v-if="initialized" class="mt-3">
        <v-row v-if="pathwayItems.length > 0">
            <v-col cols=5>
                <p class="subtitle">
                    Please select the pathway you would like to visualize from either the options presented in the table below or by utilizing the 
                    interactive bubble plot visualization on the right-hand side. In the case of a large number of pathways, you have the option to 
                    search for a specific pathway using its ID, name or category.
                </p>

                <p class="mt-3 subtitle">
                    Upon selecting a bubble or an entry from the table, PathwayPilot will retrieve the corresponding pathway image and generate an 
                    overlay to generate an interactive result. Based on the number of matches and/or Unipept results, it may be feasible 
                    to select multiple taxa in the next step. This selection offers a more specific color representation within the pathway, providing 
                    a more precise visualization.
                </p>

                <p v-if="pathwayItems.length <= 0" class="mt-3 subtitle">
                    Unfortunately, we were not able to visualise your input data on any pathway.
                </p>
                <p v-else class="mt-3 subtitle">
                    We have successfully visualized your input data across <b>{{ pathwayItems.length }}</b> distinct pathways.
                </p>
            </v-col>

            <v-col cols=7>
                <bubble-plot
                    v-model="selectedPathway"
                    :items="pathwayItems"
                    @update:model-value="onBubblePlotClick"    
                />
            </v-col>
        </v-row>

        <div v-if="pathwayItems.length > 0" class="d-flex align-center">
            <v-text-field
                class="mt-3 mb-n3"
                v-model="pathwaySearch"
                label="Search for an identifier or name"
                prepend-inner-icon="mdi-magnify"
                variant="solo"
                density="comfortable"
            />

            <v-btn class="ms-3" color="primary" variant="outlined" @click="onDownload">
                <v-icon left>mdi-download</v-icon>
                <span class="ms-1">Download table</span>
            </v-btn>
        </div>

        <pathway-table v-if="pathwayItems.length > 0"
            v-model="selectedPathway"
            :items="pathwayItems"
            :search="pathwaySearch"
        />

        <warning-alert v-else class="mt-3">
            Unfortunately, we were unable to identify any pathways that correspond to your input data. You may consider analyzing a different input sample to explore pathway associations.
        </warning-alert>
    </div>

    <warning-alert v-else class="mt-5">
        To get started with the selection process, please upload the necessary data first.
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
const { compressRankTree, fetchTaxonomyTree } = useTaxonomyTree();

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
        const taxa = Array.from(mappingStore.pathwaysToTaxa.get(pathway?.id)!);
        const tree = await fetchTaxonomyTree(taxa);

        mappingStore.setTree(tree);
        mappingStore.setCompressedTree(compressRankTree(tree, taxa, true));
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
