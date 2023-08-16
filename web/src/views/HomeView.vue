<template>
    <p class="mb-3">
        Welcome to PathwayPilot, a user-friendly web-based application for exploring and visualizing metabolic pathways using data 
        from the Kyoto Encyclopedia of Genes and Genomes (KEGG) database. Understanding the complex metabolic processes of living 
        organisms is critical for advancing our knowledge in various fields of biology, and KEGG provides a comprehensive resource 
        for studying these pathways. However, navigating through the vast amount of data and mapping identified peptides or proteins 
        to metabolic pathways can be a challenging and tedious task for researchers.
    </p>

    <p class="mb-3">
        That's where PathwayPilot comes in. Our tool makes it easy to explore and visualize metabolic pathways, whether you are working 
        with peptides or proteins, and whether you are interested in a single organism or comparing multiple organisms within a sample. 
        By mapping identified peptides or proteins onto Enzyme Commission numbers, taxon identifiers, and KEGG metabolic pathways, 
        PathwayPilot provides a clear and understandable visualization of the data. With our user-friendly interface, you can easily 
        navigate through the pathways and highlight specific peptides or proteins of interest.
    </p>

    <p class="mb-5">
        PathwayPilot is designed to streamline the analysis of metaproteomics data and help researchers gain deeper insights into the 
        biological processes of living organisms. We invite you to explore our tool and discover the power of visualizing metabolic 
        pathways with PathwayPilot. <b>To get started</b>, please select whether you want to analyse a single sample or compare multiple 
        samples between eachother.
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

