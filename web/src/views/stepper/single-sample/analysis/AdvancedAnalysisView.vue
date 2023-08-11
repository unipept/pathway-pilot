<template>
    <h4>Advanced analysis</h4>

    <div v-if="area" class="mt-3">
        <linked-annotations-view :area="area" />
        <matched-taxa-view class="mt-3" :items="MatchedInputItems" />
    </div>

    <div v-else-if="compound">
        <compound-information-view class="mt-3" :compoundId="compound.info.compounds[0].id" />
    </div>

    <info-alert v-else class="mt-3">
        You can <b>click</b> on any node in the visualisation to select it. Upon selection, more detailed information 
        will be displayed here.
    </info-alert>

    <v-divider class="mt-3 mb-2" />

    <p>
        Use the advanced controls to further filter your data or to switch between different visualisations.
    </p>

    <div class="d-flex mt-2 align-center">
        <v-btn class="me-3" icon="mdi-filter-outline" size="small" :color="filterColor" @click="$emit('click:filter')" />
        <p>
            Apply some additional filtering based on the present organisms or groups. A <b style="color: #306ccf;">blue</b> filter icon indicates 
            that the filter is active.
        </p>
    </div>
    
    <div class="d-flex mt-2 align-center">
        <v-btn class="me-3" icon="mdi-vector-difference" size="small" @click="$emit('click:abundance')" />
        <p>
            Switch between a differential abbundance vieuw and the absolute values. A <b style="color: #306ccf;">blue</b> icon indicates 
            that the differential abbundance view is active. <b>This option is only available when comparing either 2 organisms or 2 sample groups!</b>
        </p>
    </div>

    <div class="d-flex mt-2 align-center">
        <v-btn class="me-3" icon="mdi-restore" size="small" @click="$emit('click:restore')" />
        <p>Reset the visualisation to its original state.</p>
    </div>
    
    <div class="d-flex mt-2 align-center">
        <v-btn class="me-3" icon="mdi-download" size="small" @click="$emit('click:download')" />
        <p>Download the current visualisation view as a .png file.</p>
    </div>
</template>

<script setup lang="ts">
import InfoAlert from '@/components/alerts/InfoAlert.vue';
import LinkedAnnotationsView from '@/views/information/LinkedAnnotationsView.vue';
import { MatchedInputTableItem } from '@/components/tables/MatchedInputTableItem';
import Taxon from '@/logic/entities/Taxon';
import useVisualisationStore from '@/stores/VisualisationStore';
import useSingleSampleStore from '@/stores/sample/SingleSampleStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import MatchedTaxaView from '@/views/information/MatchedTaxaView.vue';
import CompoundInformationView from '@/views/information/CompoundInformationView.vue';

export interface Props {
    area: any | undefined
    compound: any | undefined
};

const props = defineProps<Props>();

defineEmits(['click:filter', 'click:abundance', 'click:restore', 'click:download']);

const sampleStore = useSingleSampleStore('single-sample');
const visualisationStore = useVisualisationStore();

const { highlightedItems: highlightedTaxa } = storeToRefs(visualisationStore);

const filterColor = computed(() => highlightedTaxa.value.length > 0 ? 'primary' : '');

const annotations = computed(() => [
    ...props.area.info.ecNumbers.map((ec: any) => ec.id),
]);

const pathwayTaxa = computed(() => {
    return sampleStore.pathwayToTaxa(visualisationStore.pathway?.id!)
        .filter((taxon: any) => taxon.id !== 1);
});

const MatchedInputItems = computed(() => {
    return pathwayTaxa.value
        .map((taxon: number) => sampleStore.taxon(taxon)!)
        .map((taxon: Taxon) => {
            return {
                taxon_id: taxon.id,
                taxon_name: taxon.name,
                taxon_rank: taxon.rank,
                node_annotations: annotations.value,
                matched_annotations: getMatchedAnnotations(taxon)
            };
        })
        .filter((item: MatchedInputTableItem) => item.matched_annotations.length > 0);
});

const getMatchedAnnotations = (taxon: Taxon) => {
    return annotations.value.filter(a => sampleStore.taxonToEcs(taxon.id)?.includes(a))
}
</script>
