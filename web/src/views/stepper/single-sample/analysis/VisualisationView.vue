<template>
    <h2>Analyse your pathway</h2>

    <div v-if="pngUrl">
        <warning-alert v-if="highlightedTaxa.length === 0" class="mt-3">
            Based on your previous selection, no taxa were chosen. Consequently, <b>all nodes with at least one match</b> are displayed using a uniform color. 
            It is possible to modify your selection in the preceding step to refine the visualization.
        </warning-alert>

        <v-card class="mt-3" elevation="5">
            <image-controls
                download
                restore
                @download="onDownload"
                @restore="onRestore"
            >
                <div ref="image">
                    <v-card style="position: relative;" max-height="700px">
                        <taxon-legend v-if="!abundance" :items="legendItems" />

                        <abundance-legend v-else :topItem="legendItems[0]" :bottomItem="legendItems[1]" />

                        <interactive-image
                            v-model:scale="scale"
                            v-model:translate="translate"
                        >
                            <reactive-image :src="pngUrl" v-slot="{ width, naturalWidth }">
                                <image-overlay v-if="naturalWidth > 0"
                                    v-model:area="selectedArea"
                                    v-model:compound="selectedCompound"
                                    :areas="coloredAreas"
                                    :scale="width / naturalWidth"
                                    @update:area="$emit('update:area', $event)"
                                    @update:compound="$emit('update:compound', $event)"
                                />
                            </reactive-image>
                        </interactive-image>
                    </v-card>
                </div>
            </image-controls>
        </v-card>
    </div>

    <warning-alert v-else-if="!pathway" class="mt-5">
        No pathway has been selected yet. Before proceeding, please follow the previous steps to select a pathway.
    </warning-alert>

    <div v-else class="loading-container">
        <v-progress-circular size="50" width="5" color="primary" indeterminate />
    </div>
</template>

<script setup lang="ts">
import ReactiveImage from '@/components/images/ReactiveImage.vue';
import ImageOverlay from '@/components/images/ImageOverlay.vue';
import useVisualisationStore from '@/stores/VisualisationStore';
import { computed, ref, watch } from "vue";
import ColorConstants from "@/logic/constants/ColorConstants";
import TaxonLegend from '@/components/legends/TaxonLegend.vue';
import useSingleSampleStore from '@/stores/sample/SingleSampleStore';
import InteractiveImage from '@/components/images/InteractiveImage.vue';
import WarningAlert from '@/components/alerts/WarningAlert.vue';
import { storeToRefs } from 'pinia';
import { useMapAnnotator } from '@/composables/useMapAnnotator';
import Taxon from '@/logic/entities/Taxon';
import ImageControls from '@/components/images/ImageControls.vue';
import { usePngDownloader } from '@/composables/download/usePngDownloader';
import AbundanceLegend from '@/components/legends/AbundanceLegend.vue';

export interface Props {
    area: any
    compound: any
    abundance: boolean
};

const props = defineProps<Props>();

defineEmits(['update:area', 'update:compound']);

const mappingStore = useSingleSampleStore();
const visualisationStore = useVisualisationStore();

const { color } = useMapAnnotator(
    mappingStore.ecs,
    mappingStore.ecToPeptides,
    mappingStore.taxonToEcs,
    mappingStore.peptideToCounts,
    mappingStore.children
);
const { downloadPng } = usePngDownloader();

const image = ref<HTMLElement | null>(null);

const pngUrl = ref<string | undefined>(undefined);
const areas  = ref<any[]>([]);

const scale = ref<number>(1);
const translate = ref<{ x: number, y: number }>({ x: 0, y: 0 });

const selectedArea = ref<any | undefined>(props.area);
const selectedCompound = ref<any | undefined>(props.compound);

const { pathway, highlightedItems: highlightedTaxa } = storeToRefs(visualisationStore);

const legendItems = computed(() => highlightedTaxa.value.map(taxonId => {
    const taxon = mappingStore?.taxon(taxonId) ?? new Taxon(taxonId, "Unknown", "Unknown");
    return {
        label: taxon.name,
        color: ColorConstants.LEGEND[highlightedTaxa.value.indexOf(taxon.id)]
    }
}));

const coloredAreas = computed(() => color(areas.value, highlightedTaxa.value, props.abundance));

const onDownload = () => {
    if (image.value) {
        downloadPng(image.value, 'pathway.png');
    }
}

const onRestore = () => {
    scale.value = 1;
    translate.value = { x: 0, y: 0 };
}

watch(pathway, async () => {
    pngUrl.value = undefined;
    
    // Fetch data from the store when loaded
    const data = await visualisationStore.getPathwayData();

    pngUrl.value = data?.image;
    areas.value  = data?.nodes.map((node: any, i: number) => ({ ...node, id: i })) ?? [];
});
</script>

<style scoped>
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 100px);
}
</style>

