<template>
    <h2>Export your analysis</h2>

    <v-row v-if="initialized" class="mt-3">
        <v-col cols="6">
            <p>
                You can download all pathways (step 2), linked to your input data. The pathways are sorted by their associated number of peptides.
            </p>
            <v-btn class="mt-3" @click="onDownloadPathways">
                <v-icon>mdi-download</v-icon>
                <span>Download pathways</span>
            </v-btn>
        </v-col>

        <v-col cols="6">
            <p>
                You can download our internal mapping file. This csv file stores the taxonomic information for each peptide, as well as the pathways it 
                is associated with.
            </p>
            <v-btn class="mt-3" @click="onDownloadStore">
                <v-icon>mdi-download</v-icon>
                <span>Download store</span>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useCsvDownloader } from '@/composables/download/useCsvDownloader';
import useKeggStore from '@/stores/KeggStore';
import useGroupSampleStore from '@/stores/sample/GroupSampleStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

export interface Props {
    pathways: any[];
}

const props = defineProps<Props>();

const sampleStore = useGroupSampleStore();
const keggStore = useKeggStore();

const { downloadCsv } = useCsvDownloader();

const { initialized } = storeToRefs(sampleStore);

const onDownloadStore = () => {
        const csvHeader = [ 'group', 'sample', 'peptide', 'peptide_count', 'taxon id', 'taxon rank', 'taxon name', 'pathways', 'pathway names' ].join(';');

        const csvData = [ ...sampleStore.groups ].map(group =>
            [ ...group.samples ].map(sample =>
                sample.peptides().map((peptide: string) => {
                    const taxon = sample.peptideToTaxon(peptide)!;
                    const pathways = sample.peptideToPathways(peptide)
                        .filter((p: string) => props.pathways.map(pp => pp.id).includes(p)).join(',');
                    const pathwayNames = pathways.length === 0 ? "" : pathways
                        .split(',')
                        .map((pathway: string) => keggStore.pathwayMapping.get(pathway)?.name ?? "Unknown")
                        .join(',');

                    return [
                        group.name,
                        sample.name,
                        peptide,
                        sample.peptideToCounts(peptide),
                        taxon.id,
                        taxon.rank,
                        taxon.name,
                        pathways,
                        pathwayNames
                    ].join(';')
                })
            ).flat()
        ).flat();

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
