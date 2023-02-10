<template>
    <h1>DETECTED PATHWAYS</h1>

    <p>
        On the left, the pathways are shown where at least one protein could be matched to. Selecting a pathway will show which species carry this protein on the right. <br>
        To view the KEGG pathway, select a pathway, the species you want to visualize (up to 4), and click on Continue.    </p>

    <v-row class="mt-5">
        <v-col>
            <h3>Select a pathway</h3>
            <v-text-field 
                class="mt-3"
                v-model="pathwaySearch"
                label="Search a pathway"
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
            <h3>Select multiple species <span style="font-size: x-small; color: #7a7a7a;">OPTIONAL</span></h3>
            <v-text-field 
                class="mt-3"
                v-model="speciesSearch"
                label="Search for a species" 
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

    <v-btn class="mt-5" color="primary" @click="() => onBack($router)">
        Back
    </v-btn>

    <v-btn class="mt-5 float-right" color="primary" @click="() => onContinue($router)" :disabled="!canContinue">
        Continue
    </v-btn>

    <v-btn class="me-5 mt-5 float-right" color="error" @click="clearSelection" :disabled="!canClearSelection">
        <v-icon class="me-2">mdi-delete-outline</v-icon> Clear selection
    </v-btn>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import PathwayTable from '@/components/tables/PathwayTable.vue';
import SpeciesTable from '@/components/tables/SpeciesTable.vue';
import { Router } from 'vue-router';
import useVisualisationStore from '@/stores/VisualisationStore';
import Taxon from '@/logic/entities/Taxon';
import PathwayEntry from '@/logic/entities/PathwayEntry';
import useMappingStore from '@/stores/MappingStore';

const mappingStore = useMappingStore();
const visualisationStore = useVisualisationStore();

const pathwaySearch = ref<string>("");
const speciesSearch = ref<string>("");

const pathwaySelected = ref<PathwayEntry | undefined>(undefined);
const speciesSelected = ref<Taxon[]>([]);

const speciesItems = computed(() => {
    if (!pathwaySelected.value) {
        return [];
    }

    return [...mappingStore.pathwaysToTaxa.get(pathwaySelected.value?.id)!]
        .filter((taxon: Taxon) => taxon.id !== 1)
        .map((taxon: Taxon) => {
            return {
                id: taxon.id,
                name: taxon.name,
                rank: taxon.rank,
                count: 0
            };
        });
})

const pathwayItems = [...mappingStore.pathways.values()!]
    .filter((pathway: PathwayEntry) => pathway.id)
    .map((pathway: PathwayEntry) => {
        return {
            id: pathway.id,
            count: mappingStore.pathwaysToPeptideCounts.get(pathway.id)!
        };
    });

const canClearSelection = computed(() => {
    return pathwaySelected.value !== undefined 
        || speciesSelected.value.length > 0 
        || pathwaySearch.value !== "" 
        || speciesSearch.value !== "";
});

const clearSelection = () => {
    pathwaySearch.value = "";
    speciesSearch.value = "";
    
    pathwaySelected.value = undefined;
    speciesSelected.value = [];
};

const canContinue = computed(() => {
    return pathwaySelected.value !== undefined;
});

const onContinue = async (router: Router) => {
    // visualisationStore.setPathwayId("path:ec00592");
    // visualisationStore.setHighlightedTaxa([3398, 3814]);
    visualisationStore.setPathwayId(pathwaySelected.value?.id!);
    visualisationStore.setHighlightedTaxa(speciesSelected.value.map((s: Taxon) => s.id));
    await router.push("/visualisation");
};

const onBack = (router: Router) => {
    router.push("/");
};
</script>
