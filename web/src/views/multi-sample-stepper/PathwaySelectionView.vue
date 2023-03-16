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

            </v-col>
        </v-row>

        <v-row class="mt-5">
            <v-col cols=12>
                <h3>Select your pathway</h3>
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
                />
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
import Bubble from '@/components/Bubble.vue';

const sample1 = useSingleSampleStore('sample1');
const sample2 = useSingleSampleStore('sample2');

const { initialized: init1, pathways: pathways1 } = storeToRefs(sample1);
const { initialized: init2, pathways: pathways2 } = storeToRefs(sample2);

const keggStore = useKeggStore();
const visualisationStore = useVisualisationStore(); // TODO: use v-model instead of store

const { pathway: selectedPathway } = storeToRefs(visualisationStore);
const { pathwayMapping } = storeToRefs(keggStore);

const pathwaySearch = ref<string>("");

const pathwayItems = computed(() => [...pathways.value.values()!]
    .filter((pathway: Pathway) => pathway.id)
    .map((pathway: Pathway) => ({
            id: pathway.id,
            name: pathwayMapping.value.get(pathway.id)?.name ?? "",
            count: (sample1.pathwaysToPeptideCounts.get(pathway.id) ?? 0) + (sample2.pathwaysToPeptideCounts.get(pathway.id) ?? 0),
        })
    )
);

const initialized = computed(() => init1.value && init2.value);

const pathways = computed(() => {
    const pathways = new Map<string, Pathway>();
    pathways1.value.forEach((pathway: Pathway) => pathways.set(pathway.id, pathway));
    pathways2.value.forEach((pathway: Pathway) => pathways.set(pathway.id, pathway));
    return pathways;
});

watch(selectedPathway, (pathway: Pathway | undefined) => {
    pathwaySearch.value = "";
    visualisationStore.setPathway(pathway);
    visualisationStore.setHighlightedTaxa([]);
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
