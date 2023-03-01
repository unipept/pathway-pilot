<template>
    <h2>Create your selection</h2>

    <div v-if="initialized">
        <v-row>
            <v-col cols=6>
                <p>
                    TODO: Introduction (What is this selection phase)
                </p>
            </v-col>

            <v-col cols=6>
                <p style="height: 250px; background-color: lightblue;">
                    Bubbleplot
                </p>
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
                    v-model="pathwaySelected"
                    :items="pathwayItems"
                    :search="pathwaySearch"
                />
                <warning-alert v-else class="mt-3">
                    We were unable to match your input data with any pathways. You can always try to analyse a different input sample.
                </warning-alert>
            </v-col>

            <v-col v-if="pathwaySelected">
                <h3>Select multiple taxa <span style="font-size: x-small; color: #7a7a7a;">OPTIONAL</span></h3>
                <p class="subtitle">
                    By default we will highlight all nodes with a match between the selected pathway and your input data. By selecting <b>a maximum of 4</b> taxa, we can narrow 
                    this down to only highlight nodes that are associated with the selected pathway and taxa.
                </p>
                <div class="d-flex" v-if="speciesItems.length > 0">
                    <v-text-field 
                        class="mt-3 mb-n3"
                        v-model="speciesSearch"
                        label="Search for a taxon or rank" 
                        prepend-inner-icon="mdi-magnify"
                        variant="solo"
                        density="comfortable"
                    />
                    <v-label v-if="speciesSelected.length === 0" class="px-5">No taxa selected</v-label>
                    <v-label v-else class="px-5">{{ speciesSelected.length }} out of 4 taxa selected</v-label>
                </div>
                <species-table v-if="speciesItems.length > 0"
                    v-model="speciesSelected"
                    :items="speciesItems"
                    :search="speciesSearch"
                    :max=4
                />
                <warning-alert v-else class="mt-3">
                    It seems like all matches for this pathway point back to the taxonomic root. As a result, you will not be able 
                    to visualise more specific highlights for this pathway.
                </warning-alert>
            </v-col>
        </v-row>
    </div>

    <v-card v-else class="mt-5">
        <v-card-text class="d-flex justify-center align-center text-warning font-weight-bold">
            <v-icon class="me-2">mdi-alert-outline</v-icon> In order to create your selection, you need to upload the data first.
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import PathwayTable from '@/components/tables/selection/PathwayTable.vue';
import SpeciesTable from '@/components/tables/selection/SpeciesTable.vue';
import Pathway from '@/logic/entities/Pathway';
import Taxon from '@/logic/entities/Taxon';
import useMappingStore from '@/stores/MappingStore';
import { storeToRefs } from 'pinia';
import useVisualisationStore from '@/stores/VisualisationStore';
import useKeggStore from '@/stores/KeggStore';
import WarningAlert from '@/components/alerts/WarningAlert.vue';

export interface Props {
    doReset: boolean
};

const props = defineProps<Props>();

const mappingStore = useMappingStore();
const keggStore = useKeggStore();
const visualisationStore = useVisualisationStore(); // TODO: use v-model instead of store

const { initialized, pathways, pathwaysToTaxa } = storeToRefs(mappingStore);
const { pathwayMapping } = storeToRefs(keggStore);

const pathwaySearch = ref<string>("");
const speciesSearch = ref<string>("");

const pathwaySelected = ref<Pathway | undefined>(undefined);
const speciesSelected = ref<Taxon[]>([]);

const pathwayItems = computed(() => [...pathways.value.values()!]
    .filter((pathway: Pathway) => pathway.id)
    .map((pathway: Pathway) => ({
            id: pathway.id,
            name: pathwayMapping.value.get(pathway.id)?.name ?? "",
            count: mappingStore.pathwaysToPeptideCounts.get(pathway.id)!
        })
    )
);

const speciesItems = computed(() => {
    if (!pathwaySelected.value) {
        return [];
    }

    return [...pathwaysToTaxa.value.get(pathwaySelected.value?.id) ?? []]
        .filter((taxon: Taxon) => taxon.id !== 1)
        .map((taxon: Taxon) => ({
                id: taxon.id,
                name: taxon.name,
                rank: taxon.rank,
                count: 0
            })
        );
});

watch(pathwaySelected, (pathway: Pathway | undefined) => {
    visualisationStore.setPathwayId(pathway?.id);
    visualisationStore.setHighlightedTaxa([]);
    speciesSelected.value = [];
});

watch(speciesSelected, (taxa: Taxon[]) => {
    visualisationStore.setHighlightedTaxa(speciesSelected.value.map((s: Taxon) => s.id));
});

watch(() => props.doReset, () => {
    pathwaySearch.value = "";
    speciesSearch.value = "";

    pathwaySelected.value = undefined;
    speciesSelected.value = [];

    visualisationStore.reset();
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
