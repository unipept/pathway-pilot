<template>
    <v-card>
        <v-card-title>Associated input</v-card-title>
        <v-card-subtitle class="mt-n2 text-subtitle-1">
            The following entries contain a match against the selected node. The matched annotations are highlighted for each entry in the Annotations column.
        </v-card-subtitle>

        <v-card-text>
            <matched-input-table :items="MatchedInputItems" />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MatchedInputTable from '@/components/tables/MatchedInputTable.vue';
import useSingleSampleStore from '@/stores/SingleSampleStore';
import Taxon from '@/logic/entities/Taxon';
import EcNumber from '@/logic/entities/EcNumber';
import useVisualisationStore from '@/stores/VisualisationStore';

export interface Props {
    annotations: string[]
}

const props = defineProps<Props>();

const mappingStore = useSingleSampleStore('single-sample');
const visualisationStore = useVisualisationStore();

const pathwayTaxa = computed(() => {
    return [...mappingStore.pathwaysToTaxa.get(visualisationStore.pathway?.id!) ?? []]
        .filter((taxon: any) => taxon.id !== 1);
});

const MatchedInputItems = computed(() => {
    return pathwayTaxa.value
        .map((taxon: number) => mappingStore.taxa.get(taxon)!)
        .map((taxon: Taxon) => {
            return {
                taxon_id: taxon.id,
                taxon_name: taxon.name,
                taxon_rank: taxon.rank,
                node_annotations: props.annotations,
                matched_annotations: getMatchedAnnotations(taxon)
            };
        });
});

const getMatchedAnnotations = (taxon: Taxon) => {
    return props.annotations.filter(a => mappingStore.taxaToEcs.get(taxon.id)?.has(a))
}
</script>
