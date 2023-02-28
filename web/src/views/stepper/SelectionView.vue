<template>
    <h2>Create your selection</h2>

    <div v-if="initialized">
        <p>
            TODO
        </p>

        <v-row class="mt-5">
            <v-col cols=12>
                <h3>Select your pathway</h3>
                <v-text-field 
                    class="mt-3 mb-n3"
                    v-model="pathwaySearch"
                    label="Search for an identifier or name"
                    prepend-inner-icon="mdi-magnify"
                    variant="solo"
                />
                <pathway-table
                    v-model="pathwaySelected"
                    :items="pathwayItems"
                    :search="pathwaySearch"
                />
            </v-col>

            <v-col>
                <h3>Select multiple taxa <span style="font-size: x-small; color: #7a7a7a;">OPTIONAL</span></h3>
                <v-text-field 
                    class="mt-3 mb-n3"
                    v-model="speciesSearch"
                    label="Search for a taxon or rank" 
                    prepend-inner-icon="mdi-magnify"
                    variant="solo"
                />
                <species-table
                    v-model="speciesSelected"
                    :items="speciesItems"
                    :search="speciesSearch"
                    :max=4
                />
            </v-col>
        </v-row>
    </div>

    <v-card v-else>
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

const mappingStore = useMappingStore();
const keggStore = useKeggStore();
const visualisationStore = useVisualisationStore(); // TODO: use v-model instead of store

const { initialized } = storeToRefs(mappingStore);
const { pathwayMapping } = storeToRefs(keggStore);

const pathwaySearch = ref<string>("");
const speciesSearch = ref<string>("");

const pathwaySelected = ref<Pathway | undefined>(undefined);
const speciesSelected = ref<Taxon[]>([]);

const pathwayItems = computed(() => [...mappingStore.pathways.values()!]
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

    return [...mappingStore.pathwaysToTaxa.get(pathwaySelected.value?.id)!]
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
});

watch(speciesSelected, (taxa: Taxon[]) => {
    visualisationStore.setHighlightedTaxa(speciesSelected.value.map((s: Taxon) => s.id));
});

onMounted(async () => {
    await keggStore.fetchPathwayMapping();
});
</script>
