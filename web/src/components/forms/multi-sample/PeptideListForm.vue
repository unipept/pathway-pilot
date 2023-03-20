<template>
    <v-card flat>
        <v-card-text>
            <v-select
                v-model="inputFormat"
                label="Select your input format"
                density="comfortable"
                :items="inputFormats"
            />

            <h1 class="mb-3">Add your samples</h1>
            <sample-table :items="samples" />
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import SampleTable from '@/components/tables/multi-sample/SampleTable.vue';
import { ref } from 'vue';

const inputFormats = ["Peptide list", "MaxQuant", "ProteomeDiscoverer", "PepShaker"]

const inputFormat = ref<string>()

const samples: any[] = [
    {
        name: "Human gut (Healty)",
        size: "2738 peptides"
    },
    {
        name: "Human gut (Cancer)",
        size: "10.547 peptides"
    },
    {
        name: "Human gut (Cancer)",
        size: "10.547 peptides"
    },
    {
        name: "Human gut (Cancer)",
        size: "10.547 peptides"
    }
];
</script>
