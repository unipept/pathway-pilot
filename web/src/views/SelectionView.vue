<template>
    <h1>TEST TITEL</h1>

    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>

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
            />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PathwayTable from '@/components/tables/PathwayTable.vue';
import SpeciesTable from '@/components/tables/SpeciesTable.vue';
import useFileStore from '@/stores/FileStore';

const fileStore = useFileStore();

const pathwaySearch = ref<string>("");
const speciesSearch = ref<string>("");

const pathwaySelected = ref<any>(undefined);
const speciesSelected = ref<any[]>([]);

const pathwayItems = [...fileStore.parsedFile?.pathways.keys()!].map((key: any) => {
    return {
        pathway: key,
        count: 0
    };
});

const speciesItems = [
{
        species: "A",
        count: 1
    },
    {
        species: "B",
        count: 2
    },
    {
        species: "C",
        count: 3
    },
    {
        species: "D",
        count: 1
    }
];
</script>
