<template>
    <div v-if="pngUrl">
        <warning-alert v-if="highlightedTaxa.length === 0" class="mt-3">
            You selected no taxa during the previous step. Therefore <b>all nodes with at least one match</b> are shown in the same color. You can always update your selection 
            in the previous step.
        </warning-alert>

        <div ref="image" class="mt-3">
            <!-- TODO: height has to be responsive here I guess -->
            <v-card elevation="5" max-height="700px" style="position: relative;">
                <taxon-legend v-if="imageLoaded"
                    class="legend"
                    :items="legendItems"
                />

                <interactive-image>
                    <reactive-image
                        class="image-container"
                        :src="pngUrl"
                        alt="Pathway"
                        @resize="onResize"
                    >
                        <image-overlay v-if="imageLoaded"
                            :areas="coloredAreas"
                            :scale="scale"
                            :onClick="onClickArea"
                            :onClickCompound="onClickCompound"
                        />
                    </reactive-image>
                </interactive-image>
            </v-card>
        </div>

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

        <v-btn class="mt-5 float-right" color="primary" @click="onDownload">
            Download
        </v-btn>
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
import useMappingStore from '@/stores/MappingStore';
import { toPng } from 'html-to-image';
import CompoundModal from '@/components/modals/CompoundModal.vue';
import InteractiveImage from '@/components/images/InteractiveImage.vue';
import WarningAlert from '@/components/alerts/WarningAlert.vue';
import { storeToRefs } from 'pinia';
import Pathway from '@/logic/entities/Pathway';

const mappingStore = useMappingStore();
const visualisationStore = useVisualisationStore();

const image = ref<HTMLElement | null>(null);

const pngUrl = ref<string | undefined>(undefined)
const areas  = ref<any[]>([])

const imageLoaded = ref<boolean>(false)
const scale = ref<number>(1)

const areaModalOpen = ref<boolean>(false)
const compoundModalOpen = ref<boolean>(false)

const selectedArea = ref<any | undefined>(undefined)
const selectedCompound = ref<string>('')

const { pathway, highlightedTaxa } = storeToRefs(visualisationStore);

const legendItems = computed(() => highlightedTaxa.value.map(taxon => ({
        label: mappingStore.taxa.get(taxon.id)?.name ?? "Unknown",
        color: computeTaxonColor(taxon.id)
    }))
);

const coloredAreas = computed(() => {
    if (highlightedTaxa.value.length === 0) {
        return colorAll(areas.value);
    } else {
        return colorHighlighted(areas.value);
    }
});

// TODO: move coloring to a different file
const colorAll = (areas: any[]) => {
    return areas.map(area => {
        area.colors = [];
        for (const ecNumber of area.info.ecNumbers) {
            if (mappingStore.ecs.has(ecNumber.id)) {
                area.colors = [ColorConstants.LEGEND[0]];
                break;
            }
        }

        return area;
    });
};

const colorHighlighted = (areas: any[]) => {
    return areas.map(area => {
        area.colors = [];

        for (const taxon of highlightedTaxa.value) {
            const taxonEcs = [...mappingStore.taxaToEcs.get(taxon.id) ?? []].map(e => e.id);

            for (const ecNumber of area.info.ecNumbers) {
                if (taxonEcs.includes(ecNumber.id)) {
                    area.colors.push(computeTaxonColor(taxon.id));
                    break;
                }
            }
        }

        return area;
    });
};

const onResize = (event: any) => {
    if (event.width && event.width !== 0) {
        scale.value = event.width / event.naturalWidth;
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

const computeTaxonColor = (taxonId: number) => {
    return ColorConstants.LEGEND[visualisationStore.highlightedTaxa.map(t => t.id).indexOf(taxonId)];
}

const onDownload = async () => {
    if (!image.value) {
        return;
    }

    const url = await toPng(image.value, { pixelRatio: 4 });

    const link = document.createElement('a');
    link.download = 'pathway.png';
    link.href = url;
    link.click();
}

watch(pathway, async (pathway: Pathway | undefined) => {
    pngUrl.value = undefined;
    
    // Fetch data from the store when loaded
    const data = await visualisationStore.getPathwayData();

    pngUrl.value = data?.image;
    areas.value  = data?.nodes ?? [];
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

