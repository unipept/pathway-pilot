<template>
    <h4>Advanced analysis</h4>

    <div v-if="area">
        <linked-annotations-view class="mt-3" :area="area" />
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
import { MatchedInputTableItem } from '@/components/tables/MatchedInputTableItem';
import Taxon from '@/logic/entities/Taxon';
import useVisualisationStore from '@/stores/VisualisationStore';
import useGroupSampleStore from '@/stores/sample/GroupSampleStore';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import LinkedAnnotationsView from '@/views/information/LinkedAnnotationsView.vue';
import MatchedTaxaView from '@/views/information/MatchedTaxaView.vue';
import CompoundInformationView from '@/views/information/CompoundInformationView.vue';

export interface Props {
    area: any | undefined
    compound: any | undefined
};

const props = defineProps<Props>();

const emits = defineEmits(['click:abundance']);

const sampleStore = useGroupSampleStore();
const visualisationStore = useVisualisationStore();

const abundance = ref<boolean>(false);

const { groups } = storeToRefs(sampleStore);
const { highlightedItems: highlightedGroups } = storeToRefs(visualisationStore);

const abundanceColor = computed(() => abundance.value ? 'primary' : '');
const abundanceDisabled = computed(() => highlightedGroups.value.length !== 2);

const annotations = computed(() => [
    ...props.area.info.ecNumbers.map((ec: any) => ec.id),
]);

const MatchedInputItems = computed(() => groups.value
    .map((group: any, i: number) => [ ...group.pathwayToTaxa(visualisationStore.pathway?.id!) ]
        .filter((taxon: any) => taxon.id !== 1)
        .map((taxon: number) => sampleStore.taxon(taxon)!)
        .map((taxon: Taxon) => ({
            taxon_id: taxon.id,
            taxon_name: taxon.name,
            taxon_rank: taxon.rank,
            group: group.name,
            node_annotations: annotations.value,
            matched_annotations: getMatchedAnnotations(i, taxon)
        }))
        .filter((item: MatchedInputTableItem) => item.matched_annotations.length > 0)
    ).flat()
);

const getMatchedAnnotations = (group: number, taxon: Taxon) => {
    return annotations.value.filter(a => sampleStore.group(group).taxonToEcs(taxon.id)?.has(a))
}

const onAbundance = () => {
    if (highlightedGroups.value.length === 2) {
        abundance.value = !abundance.value;
        emits('click:abundance', abundance.value);
    }
}

watch(highlightedGroups, () => {
    abundance.value = false;
    emits('click:abundance', false);
});
</script>
