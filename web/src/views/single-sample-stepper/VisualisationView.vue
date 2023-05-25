<template>
    <div v-if="pngUrl">
        <warning-alert v-if="highlightedTaxa.length === 0" class="mt-3">
            You selected no taxa during the previous step. Therefore <b>all nodes with at least one match</b> are shown in the same color. You can always update your selection 
            in the previous step.
        </warning-alert>

        <v-card class="mt-3" elevation="5">
            <image-controls
                download
                restore
                :abundance="abundance"
                @download="onDownload"
                @restore="onRestore"
                @abundance="onAbundance"
            >
                <div ref="image">
                    <!-- TODO: height has to be responsive here I guess -->
                    <v-card style="position: relative;" max-height="700px">
                        <taxon-legend v-if="imageLoaded"
                            class="legend"
                            :items="legendItems"
                        />

                        <interactive-image
                            :scale="scale"
                            :translate="translate"
                            @update:scale="scale = $event"
                            @update:translate="translate = $event"
                        >
                            <reactive-image
                                class="image-container"
                                :src="pngUrl"
                                alt="Pathway"
                                @resize="onResize"
                            >
                                <image-overlay v-if="imageLoaded"
                                    :areas="coloredAreas"
                                    :scale="imageScale"
                                    :onClick="onClickArea"
                                    :onClickCompound="onClickCompound"
                                />
                            </reactive-image>
                        </interactive-image>
                    </v-card>
                </div>
            </image-controls>
        </v-card>

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
        No pathway selected. Please select a pathway first.
    </warning-alert>

    <div v-else class="loading-container">
        <v-progress-circular
            size="50"
            width="5"
            color="primary"
            indeterminate
        ></v-progress-circular>
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
import useSingleSampleStore from '@/stores/SingleSampleStore';
import CompoundModal from '@/components/modals/CompoundModal.vue';
import InteractiveImage from '@/components/images/InteractiveImage.vue';
import WarningAlert from '@/components/alerts/WarningAlert.vue';
import { storeToRefs } from 'pinia';
import Pathway from '@/logic/entities/Pathway';
import { useMapAnnotator } from '@/composables/useMapAnnotator';
import Taxon from '@/logic/entities/Taxon';
import ImageControls, { ToggleButtonValue } from '@/components/images/ImageControls.vue';
import { usePngDownloader } from '@/composables/download/usePngDownloader';

const mappingStore = useSingleSampleStore();
const visualisationStore = useVisualisationStore();

const { colorAllTaxa, colorHighlightedTaxa } = useMapAnnotator(
    mappingStore.ecs, mappingStore.taxaToEcs, mappingStore.children
);
const { downloadPng } = usePngDownloader();

const image = ref<HTMLElement | null>(null);

const pngUrl = ref<string | undefined>(undefined)
const areas  = ref<any[]>([])

const imageLoaded = ref<boolean>(false)
const imageScale = ref<number>(1)

const areaModalOpen = ref<boolean>(false)
const compoundModalOpen = ref<boolean>(false)

const selectedArea = ref<any | undefined>(undefined)
const selectedCompound = ref<string>('')

const scale = ref<number>(1);
const translate = ref<{ x: number, y: number }>({ x: 0, y: 0 });

const { pathway, highlightedTaxa } = storeToRefs(visualisationStore);

const abundance = ref<ToggleButtonValue>(false);
const showAbundanceView = ref<boolean>(false);

const legendItems = computed(() => highlightedTaxa.value.map(taxon => ({
        label: taxon.name,
        color: ColorConstants.LEGEND[visualisationStore.highlightedTaxa.map(t => t.id).indexOf(taxon.id)]
    }))
);

const coloredAreas = computed(() => {
    if (highlightedTaxa.value.length === 0) {
        return colorAllTaxa(areas.value);
    } else {
        return colorHighlightedTaxa(areas.value, highlightedTaxa.value.map((t: Taxon) => t.id));
    }
});

const onResize = (event: any) => {
    if (event.width && event.width !== 0) {
        imageScale.value = event.width / event.naturalWidth;
        imageLoaded.value = true;
    }
}

const onClickArea = (area: any) => {
    selectedArea.value = area;
    areaModalOpen.value = true;
}

const onClickCompound = (compound: any) => {
    selectedCompound.value = compound.info.compounds[0].id;
    compoundModalOpen.value = true;
}

const onDownload = async () => {
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

watch(pathway, async (pathway: Pathway | undefined) => {
    pngUrl.value = undefined;
    
    // Fetch data from the store when loaded
    const data = await visualisationStore.getPathwayData();

    pngUrl.value = data?.image;
    areas.value  = data?.nodes ?? [];
});

watch(highlightedTaxa, () => {
    abundance.value = highlightedTaxa.value.length !== 2 ? 'disabled' : true;
});
</script>

<style scoped>
.image-container {
    position: relative;
    outline-color: white;
    outline-style: solid;
    outline-width: 10px;
    outline-offset: -5px;
}

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
</style>

