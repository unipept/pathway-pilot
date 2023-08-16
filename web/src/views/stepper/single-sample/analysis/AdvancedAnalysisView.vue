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
        <v-btn class="me-3" icon="mdi-filter-outline" size="small" :color="filterColor" @click="onFilter" />
        <p>
            Apply some additional filtering based on the present organisms or groups. A <b style="color: #306ccf;">blue</b> filter icon indicates 
            that the filter is active.
        </p>
    </div>
    
    <div class="d-flex mt-2 align-center">
        <v-btn 
            class="me-3" 
            icon="mdi-vector-difference" 
            size="small" 
            :color="abundanceColor" 
            :disabled="abundanceDisabled"
            @click="onAbundance"
        />
        <p>
            Switch between a differential abbundance vieuw and the absolute values. A <b style="color: #306ccf;">blue</b> icon indicates 
            that the differential abbundance view is active. <b>This option is only available when comparing either 2 organisms or 2 sample groups!</b>
        </p>
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
import { ref, watch } from 'vue';

export interface Props {
    area: any | undefined
    compound: any | undefined
};

const props = defineProps<Props>();

const emits = defineEmits(['click:filter', 'click:abundance']);

const sampleStore = useSingleSampleStore('single-sample');
const visualisationStore = useVisualisationStore();

const abundance = ref<boolean>(false);

const { highlightedItems: highlightedTaxa } = storeToRefs(visualisationStore);

const filterColor = computed(() => highlightedTaxa.value.length > 0 ? 'primary' : '');

const abundanceColor = computed(() => abundance.value ? 'primary' : '');
const abundanceDisabled = computed(() => highlightedTaxa.value.length !== 2);

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

const onAbundance = () => {
    if (highlightedTaxa.value.length === 2) {
        abundance.value = !abundance.value;
        emits('click:abundance', abundance.value);
    }
}

const onFilter = () => {
    emits('click:filter');
}

watch(highlightedTaxa, () => {
    abundance.value = false;
    emits('click:abundance', false);
});
</script>
