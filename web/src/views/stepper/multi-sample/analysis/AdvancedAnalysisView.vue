<template>
    <h4>Advanced analysis</h4>

    <div v-if="area" class="mt-3">
        <linked-annotations-view :area="area" />

        <v-card class="mt-3">
            <v-card-title>Matched organisms</v-card-title>
            <v-card-text class="mt-n2 text-subtitle-1">
                The following entries contain a match against the selected node. The matched annotations are highlighted for each 
                entry in the Annotations column.
            </v-card-text>

            <v-card-text>
                <matched-input-table :items="MatchedInputItems" />
            </v-card-text>
        </v-card>
    </div>

    <info-alert v-else class="mt-3">
        You can <b>click</b> on any rectangular area in the visualisation to select it. Upon selection, more detailed information 
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
import MatchedInputTable from '@/components/tables/MatchedInputTable.vue';
import { MatchedInputTableItem } from '@/components/tables/MatchedInputTableItem';
import Taxon from '@/logic/entities/Taxon';
import useVisualisationStore from '@/stores/VisualisationStore';
import useGroupSampleStore from '@/stores/sample/GroupSampleStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import LinkedAnnotationsView from '@/views/information/LinkedAnnotationsView.vue';

export interface Props {
    area: any
};

const props = defineProps<Props>();

defineEmits(['click:filter', 'click:abundance', 'click:restore', 'click:download']);

const sampleStore = useGroupSampleStore();
const visualisationStore = useVisualisationStore();

const { groups } = storeToRefs(sampleStore);
const { highlightedItems: highlightedGroups } = storeToRefs(visualisationStore);

const filterColor = computed(() => highlightedGroups.value.length > 0 ? 'primary' : '');

const annotations = computed(() => [
    //...props.area.info.koNumbers.map((ko: any) => ko.id),
    ...props.area.info.ecNumbers.map((ec: any) => ec.id),
    //...props.area.info.reactions.map((reaction: any) => reaction.id)
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
</script>
