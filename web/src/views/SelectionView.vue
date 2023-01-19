<template>
    <h1>DETECTED PATHWAYS</h1>

    <p>
        On the left, the pathways are shown where at least one protein could be matched to. Selecting a pathway will show which species carry this protein on the right. <br>
        To view the KEGG pathway, select a pathway, the species you want to visualize (up to 4), and click on Continue.    </p>

    <v-row class="mt-5">
        <v-col>
            <h3>Select a pathway</h3>
            <v-text-field label="Search" v-model="pathwaySearch" />
            <pathway-table
                v-model="pathwaySelected"
                :items="pathwayItems"
                :search="pathwaySearch"
            />
        </v-col>

        <v-col>
            <h3>Select species</h3>
            <v-text-field label="Search" v-model="speciesSearch" />
            <species-table
                v-model="speciesSelected"
                :items="speciesItems"
                :search="speciesSearch"
                max="4"
            />
        </v-col>
    </v-row>

    <v-btn class="mt-5 float-right" color="primary" @click="() => onContinue($router)" >
        Continue
    </v-btn>

    <v-btn class="me-5 mt-5 float-right" color="error" @click="clearSelection">
        <v-icon class="me-2">mdi-delete-outline</v-icon> Clear selection
    </v-btn>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import PathwayTable from '@/components/tables/PathwayTable.vue';
import SpeciesTable from '@/components/tables/SpeciesTable.vue';
import useFileStore from '@/stores/FileStore';
import { Router } from 'vue-router';
import useVisualisationStore from '@/stores/VisualisationStore';
import Taxon from '@/logic/entities/Taxon';
import PathwayEntry from '@/logic/entities/PathwayEntry';

const fileStore = useFileStore();
const visualisationStore = useVisualisationStore();

const pathwaySearch = ref<string>("");
const speciesSearch = ref<string>("");

const pathwaySelected = ref<PathwayEntry | undefined>(undefined);
const speciesSelected = ref<Taxon[]>([]);

const speciesItems = computed(() => {
    if (!pathwaySelected.value) {
        return [];
    }

    return [...fileStore.parsedFile?.pathwaysToTaxa.get(pathwaySelected.value?.id)!].map((taxon: Taxon) => {
        return {
            species: taxon,
            count: 0
        };
    });
})

const pathwayItems = [...fileStore.parsedFile?.pathways.values()!].map((pathway: PathwayEntry) => {
    return {
        pathway: pathway,
        count: 0
    };
});

const clearSelection = () => {
    pathwaySearch.value = "";
    speciesSearch.value = "";
    
    pathwaySelected.value = undefined;
    speciesSelected.value = [];
};

const onContinue = async (router: Router) => {
    // visualisationStore.setPathwayId("path:ec00592");
    // visualisationStore.setHighlightedTaxa([3398, 3814]);
    visualisationStore.setPathwayId(pathwaySelected.value?.id!);
    visualisationStore.setHighlightedTaxa(speciesSelected.value.map((s: Taxon) => s.id));
    await router.push("/visualisation");
};
</script>
