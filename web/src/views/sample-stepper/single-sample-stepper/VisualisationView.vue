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
                :abundance="abundance"
                :filter="filter"
                @download="onDownload"
                @restore="onRestore"
                @abundance="onAbundance"
                @filter="onFilter"
            >
                <div ref="image">
                    <!-- TODO: height has to be responsive here I guess -->
                    <v-card style="position: relative;" max-height="700px">
                        <taxon-legend v-if="imageLoaded && !showAbundanceView"
                            class="legend"
                            :items="legendItems"
                        />

                        <abundance-legend v-if="imageLoaded && showAbundanceView" 
                            class="abundance-legend"
                            :topItem="legendItems[0]"
                            :bottomItem="legendItems[1]"
                        />

                        <interactive-image
                            :scale="scale"
                            :translate="translate"
                            @update:scale="scale = $event"
                            @update:translate="translate = $event"
                        >
                            <reactive-image :src="pngUrl" @resize="onResize">
                                <image-overlay v-if="imageLoaded"
                                    :areas="coloredAreas"
                                    :scale="imageScale"
                                    :selected="selectedArea?.id ?? -1"
                                    :onClickArea="onClickArea"
                                    :onClickCompound="onClickCompound"
                                />
                            </reactive-image>
                        </interactive-image>
                    </v-card>
                </div>
            </image-controls>
        </v-card>

        <v-dialog 
            v-model="filterModalOpen"
            @click:outside="filterModalOpen = false"
            max-width="75%"
            height="100%"
        >
            <taxon-filter-view />
        </v-dialog>

        <area-modal
            :model-value="areaModalOpen"
            :area="selectedArea"
            @update:model-value="areaModalOpen = $event"
        />

        <compound-modal
            :model-value="compoundModalOpen"
            :compoundId="selectedCompound"
            @update:model-value="compoundModalOpen = $event"
        />
    </div>

    <warning-alert v-else-if="!pathway" class="mt-5">
        No pathway has been selected yet. Before proceeding, please follow the previous steps to select a pathway.
    </warning-alert>

    <div v-else class="loading-container">
        <v-progress-circular
            size="50"
            width="5"
            color="primary"
            indeterminate
        />
    </div>
</template>

<script setup lang="ts">
import ReactiveImage from '@/components/images/ReactiveImage.vue';
import ImageOverlay from '@/components/images/ImageOverlay.vue';
import useVisualisationStore from '@/stores/VisualisationStore';
import { computed, ref, watch } from "vue";
import ColorConstants from "@/logic/constants/ColorConstants";
import TaxonLegend from '@/components/legends/TaxonLegend.vue';
import AreaModal from '@/components/modals/AreaModal.vue';
import useSingleSampleStore from '@/stores/sample/SingleSampleStore';
import CompoundModal from '@/components/modals/CompoundModal.vue';
import InteractiveImage from '@/components/images/InteractiveImage.vue';
import WarningAlert from '@/components/alerts/WarningAlert.vue';
import { storeToRefs } from 'pinia';
import { useMapAnnotator } from '@/composables/useMapAnnotator';
import Taxon from '@/logic/entities/Taxon';
import ImageControls, { ActiveButtonValue, ToggleButtonValue } from '@/components/images/ImageControls.vue';
import { usePngDownloader } from '@/composables/download/usePngDownloader';
import AbundanceLegend from '@/components/legends/AbundanceLegend.vue';
import TaxonFilterView from '@/views/sample-stepper/single-sample-stepper/advanced/TaxonFilterView.vue';

const mappingStore = useSingleSampleStore();
const visualisationStore = useVisualisationStore();

const { colorAllAreas, colorHighlightedGroups, colorDifferential } = useMapAnnotator(
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

const imageLoaded = ref<boolean>(false);
const imageScale = ref<number>(1);

const areaModalOpen = ref<boolean>(false);
const compoundModalOpen = ref<boolean>(false);
const filterModalOpen = ref<boolean>(false);

const selectedArea = ref<any | undefined>(undefined);
const selectedCompound = ref<string>('');

const scale = ref<number>(1);
const translate = ref<{ x: number, y: number }>({ x: 0, y: 0 });

const { pathway, highlightedItems: highlightedTaxa } = storeToRefs(visualisationStore);

const abundance = ref<ToggleButtonValue>(false);
const showAbundanceView = ref<boolean>(false);

const filter = ref<ActiveButtonValue>(true);

const legendItems = computed(() => highlightedTaxa.value.map(taxonId => {
    const taxon = mappingStore?.taxon(taxonId) ?? new Taxon(taxonId, "Unknown", "Unknown");
    return {
        label: taxon.name,
        color: ColorConstants.LEGEND[highlightedTaxa.value.indexOf(taxon.id)]
    }
}));

const coloredAreas = computed(() => {
    if (showAbundanceView.value) {
        return colorDifferential(areas.value, highlightedTaxa.value[0], highlightedTaxa.value[1]);
    }

    if (highlightedTaxa.value.length === 0) {
        return colorAllAreas(areas.value);
    } else {
        return colorHighlightedGroups(areas.value, highlightedTaxa.value);
    }
});

const onResize = (event: any) => {
    if (event.width && event.width !== 0) {
        imageScale.value = event.width / event.naturalWidth;
        imageLoaded.value = true;
    }
}

const onClickArea = (area: any) => {
    if (selectedArea.value && selectedArea.value.id === area.id) {
        selectedArea.value = undefined;
        return;
    }
    selectedArea.value = area;
}

const onClickCompound = (compound: any) => {
    selectedCompound.value = compound.info.compounds[0].id;
    compoundModalOpen.value = true;
}

const onDownload = () => {
    if (image.value) {
        downloadPng(image.value, 'pathway.png');
    }
}

const onRestore = () => {
    scale.value = 1;
    translate.value = { x: 0, y: 0 };
}

const onAbundance = (value: boolean) => {
    showAbundanceView.value = value;
}

const onFilter = () => {
    filterModalOpen.value = true;
}

watch(pathway, async () => {
    pngUrl.value = undefined;
    
    // Fetch data from the store when loaded
    const data = await visualisationStore.getPathwayData();

    pngUrl.value = data?.image;
    areas.value  = data?.nodes.map((node: any, i: number) => {
        node.id = i;
        return node;
    }) ?? [];
});

watch(highlightedTaxa, () => {
    onAbundance(highlightedTaxa.value.length === 2 && showAbundanceView.value)
    abundance.value = highlightedTaxa.value.length !== 2 ? 'disabled' : true;
    filter.value = highlightedTaxa.value.length > 0 ? 'active' : true;
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

.legend {
    position: absolute;
    right: 0;
    margin: 12px;
    font-size: 90%;
    background-color: white;
    z-index: 1;
}

.abundance-legend {
    position: absolute;
    right: 0;
    margin: 12px;
    font-size: 90%;
    background-color: white;
    z-index: 1;
}
</style>

