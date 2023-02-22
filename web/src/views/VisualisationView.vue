<template>
    <div v-if="pngUrl">
        <div ref="image">
            <!-- TODO: height has to be responsive here I guess -->
            <v-card elevation="5" max-height="700px" style="position: relative;">
                <taxon-legend v-if="imageLoaded"
                    class="legend"
                    :items="computeItems()"
                />

                <interactive-image>
                    <reactive-image
                        class="image-container"
                        :src="pngUrl" 
                        alt="Pathway"
                        @resize="onResize"
                    >
                        <image-overlay v-if="imageLoaded"
                            :areas="areas"
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

        <v-btn class="mt-5" color="primary" @click="() => onBack($router)">
            Back
        </v-btn>

        <v-btn class="mt-5 float-right" color="primary" @click="onDownload">
            Download
        </v-btn>
    </div>

    <v-row v-else>
        <v-progress-circular
            class="progress-loader"
            size="50"
            width="5"
            color="secondary"
            indeterminate
        ></v-progress-circular>
    </v-row>
</template>

<script setup lang="ts">
import ReactiveImage from '@/components/images/ReactiveImage.vue';
import ImageOverlay from '@/components/images/ImageOverlay.vue';
import useVisualisationStore from '@/stores/VisualisationStore';
import { onMounted, ref } from "vue";
import ColorConstants from "@/logic/constants/ColorConstants";
import { Router } from 'vue-router';
import TaxonLegend from '@/components/legends/TaxonLegend.vue';
import AreaModal from '@/components/modals/AreaModal.vue';
import useMappingStore from '@/stores/MappingStore';
import { toPng } from 'html-to-image';
import CompoundModal from '@/components/modals/CompoundModal.vue';
import InteractiveImage from '@/components/images/InteractiveImage.vue';

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

const computeItems = () => {
    return visualisationStore.highlightedTaxa.map(taxonId => {
        return {
            label: mappingStore.taxa.get(taxonId)?.name ?? "Unknown",
            color: computeTaxonColor(taxonId)
        };
    });
};

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

        for (const taxonId of visualisationStore.highlightedTaxa) {
            const taxonEcs = [...mappingStore.taxaToEcs.get(taxonId) ?? []].map(e => e.id);

            for (const ecNumber of area.info.ecNumbers) {
                if (taxonEcs.includes(ecNumber.id)) {
                    area.colors.push(computeTaxonColor(taxonId));
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

const onBack = (router: Router) => {
    router.push("/selection");
};

const onClickArea = (area: any) => {
    selectedArea.value = area;
    areaModalOpen.value = true;
}

const onClickCompound = (compound: any) => {
    selectedCompound.value = compound.info.compounds[0].id;
    compoundModalOpen.value = true;
}

const computeTaxonColor = (taxonId: number) => {
    return ColorConstants.LEGEND[visualisationStore.highlightedTaxa.indexOf(taxonId)];
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

onMounted(async () => {
    const response = await fetch(`http://localhost:4000/pathway/${visualisationStore.pathwayId!.replace("path:ec", "map")}`);
    const data     = await response.json();

    pngUrl.value = data.image;

    if (visualisationStore.highlightedTaxa.length === 0) {
        areas.value = colorAll(data.nodes);
    } else {
        areas.value = colorHighlighted(data.nodes);
    }
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

.legend {
    position: absolute;
    right: 0;
    margin: 12px;
    font-size: 90%;
    background-color: white;
    z-index: 1;
}
</style>
