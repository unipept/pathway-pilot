<template>
    <h2>Select your pathway</h2>

    <div v-if="initialized" class="mt-3">
        <div v-if="pathwayItems.length > 0">
            <v-row>
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

                    <p class="mt-3 subtitle">
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

            <search-filter
                v-model:search="pathwaySearch" 
                v-model:filter="pathwayFilter"
                search-label="Search for an identifier or name"
                filter-label="Apply filters"
                @click:filter="filterOpen = true"
            />

            <pathway-table
                v-model="selectedPathway"
                :items="pathwayItems"
                :search="pathwaySearch"
            />

            <v-dialog v-model="filterOpen">
                <filter-view v-model:enzymes="pathwayFilter"/>
            </v-dialog>
        </div>

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
import SearchFilter from '@/components/inputs/SearchFilter.vue';
import FilterView from './FilterView.vue';

const keggStore = useKeggStore();
const mappingStore = useSingleSampleStore(); 
const visualisationStore = useVisualisationStore();

const { initialized, pathways } = storeToRefs(mappingStore);
const { pathway: selectedPathway } = storeToRefs(visualisationStore);
const { pathwayMapping } = storeToRefs(keggStore);

const pathwaySearch = ref<string>("");
const pathwayFilter = ref<string[]>([]);

const filterOpen = ref<boolean>(false);

const filteredPathways = computed(() => [ ...pathwayFilter.value ]
    .map((ec: string) => [ ...mappingStore.ecToPathways.get(ec)! ]).flat());

const isFiltered = computed(() => pathwayFilter.value.length > 0);

const pathwayItems = computed(() => [ ...(isFiltered.value ? filteredPathways.value : pathways.value) ]
    .map((pathway: string) => ({
            id: pathway,
            name: pathwayMapping.value.get(pathway)?.name ?? "",
            category: pathwayMapping.value.get(pathway)?.category ?? "",
            subCategory: pathwayMapping.value.get(pathway)?.subCategory ?? "",
            count: mappingStore.pathwaysToPeptideCounts.get(pathway)!
        })
    )
);

const onBubblePlotClick = (pathway: Pathway | undefined) => {
    visualisationStore.setPathway(pathway);
    visualisationStore.setHighlightedTaxa([]);
};

watch(selectedPathway, onBubblePlotClick);

onMounted(async () => {
    await keggStore.fetchPathwayMapping();
    await keggStore.fetchEcMapping();
});
</script>

