<template>
    <h2>Export your analysis</h2>

    <div v-if="initialized" class="mt-3">
        <v-btn @click="onDownloadPathways">
            <v-icon>mdi-download</v-icon>
            <span>Download pathways</span>
        </v-btn>

        <v-btn @click="onDownloadStore">
            <v-icon>mdi-download</v-icon>
            <span>Download store</span>
        </v-btn>
    </div>
</template>

<script setup lang="ts">
import { useCsvDownloader } from '@/composables/download/useCsvDownloader';
import useKeggStore from '@/stores/KeggStore';
import useMultiSampleStore from '@/stores/MultiSampleStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { watch } from 'vue';

export interface Props {
    pathways: any[];
}

const props = defineProps<Props>();

const sampleStore = useMultiSampleStore();
const keggStore = useKeggStore();

const { downloadCsv } = useCsvDownloader();

const { initialized } = storeToRefs(sampleStore);

const onDownloadStore = () => {
        const csvHeader = [ 'sample', 'peptide', 'peptide_count', 'taxon id', 'taxon rank', 'taxon name', 'pathways', 'pathway names' ].join(';');

        const csvData = [ ...sampleStore.samples ].map(sample => {
            return [ ...sample.peptides ].map(peptide => {
                const taxon = sample.peptideToTaxa.get(peptide)!;
                const pathways = [ ...sample.peptideToPathways.get(peptide) ?? [] ]
                    .filter(p => props.pathways.map(pp => pp.id).includes(p)).join(',');
                const pathwayNames = pathways.length === 0 ? "" : pathways
                    .split(',')
                    .map(pathway => keggStore.pathwayMapping.get(pathway)?.name ?? "Unknown")
                    .join(',');

                return [
                    sample.name,
                    peptide,
                    sample.peptideToCounts.get(peptide),
                    taxon.id,
                    taxon.rank,
                    taxon.name,
                    pathways,
                    pathwayNames
                ].join(';')
            })
        }).flat();

        downloadCsv(csvData, 'store.csv', csvHeader);
};

const onDownloadPathways = () => {
    const csvHeader = [ 'id', 'name', 'category', 'subCategory', 'count' ].join(',');
    const csvData   =[ ...props.pathways ].sort((a, b) => b.count - a.count).map((pathway) => {
        return `${pathway.id},${pathway.name},${pathway.category},${pathway.subCategory},${pathway.count}`;
    });

    downloadCsv(csvData, "pathway-table.csv", csvHeader);
};

onMounted(async () => {
    await keggStore.fetchPathwayMapping();
})
</script>
