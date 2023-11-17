<template>
    <p class="mb-3">
        Welcome to PathwayPilot, your go-to web tool for effortlessly exploring and visualizing metabolic pathways using KEGG database data. 
        Navigating the intricate world of living organisms' metabolic processes can be challenging, and that's where PathwayPilot shines. Whether 
        you're dealing with peptides or proteins, analyzing a single organism or comparing multiple, our user-friendly interface simplifies the 
        mapping of data onto Enzyme Commission numbers, taxon identifiers, and KEGG metabolic pathways. Gain clear insights and easily highlight 
        peptides or proteins of interest. PathwayPilot streamlines metaproteomics data analysis, offering a powerful way to delve into biological 
        processes. Explore now and experience the simplicity of visualizing metabolic pathways. <b>To get started</b>, Choose between analyzing a 
        single sample or comparing multiple samples.
    </p>

    <v-row>
        <v-col cols="6">
            <v-card 
                height="50" 
                color="primary" 
                :variant="selectedAnalysis === 0 ? 'flat' : 'outlined'" 
                @click="selectedAnalysis = 0"
            >
                <v-card-text class="center-card">
                    Compare multiple organisms
                </v-card-text>
            </v-card>
        </v-col>

        <v-col cols="6">
            <v-card 
                height="50" 
                color="primary" 
                :variant="selectedAnalysis === 1 ? 'flat' : 'outlined'" 
                @click="selectedAnalysis = 1"
            >
                <v-card-text class="center-card">
                    Compare multiple samples
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

    <component v-if="selectedAnalysis >= 0"
        class="mt-5"
        :is="analysis[selectedAnalysis]"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SampleComparisonView from './SampleComparisonView.vue';
import TaxonComparisonView from './TaxonComparisonView.vue';

const selectedAnalysis = ref<number>(0);

const analysis = [
    TaxonComparisonView,
    SampleComparisonView
];
</script>

<style scoped>
.center-card {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: x-large;
}
</style>

