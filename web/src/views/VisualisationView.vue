<template>
    <div v-if="pngUrl" class="image-container">
        <reactive-image 
            :src="pngUrl" 
            alt="Pathway"
            @resize="onResize"
        >
            <image-overlay 
                v-if="imageLoaded"
                :areas="areas"
                :scale="scale"
                :onClick="onClickArea"
            />
        </reactive-image>
        <taxon-legend
            v-if="imageLoaded"
            class="legend"
            :items="computeItems()"
        />

        <area-modal
            :model-value="areaModalOpen"
            @update:model-value="areaModalOpen = $event"
        />

        <v-btn class="mt-5" color="primary" @click="() => onBack($router)">
            Back
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
import useFileStore from '@/stores/FileStore';
import useVisualisationStore from '@/stores/VisualisationStore';
import { onMounted, ref } from "vue";
import ColorConstants from "@/logic/constants/ColorConstants";
import { Router } from 'vue-router';
import TaxonLegend from '@/components/legends/TaxonLegend.vue';
import AreaModal from '@/components/modals/AreaModal.vue';

const fileStore = useFileStore();
const visualisationStore = useVisualisationStore();

const pngUrl = ref<string | undefined>(undefined)
const areas  = ref<any[]>([])

const imageLoaded = ref<boolean>(false)
const scale = ref<number>(1)

const areaModalOpen = ref<boolean>(false)

const computeItems = () => {
    return visualisationStore.highlightedTaxa.map(taxonId => {
        return {
            label: fileStore.parsedFile?.taxa.get(taxonId)?.name ?? "Unknown",
            color: computeTaxonColor(taxonId)
        };
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
    areaModalOpen.value = true;
}

const computeTaxonColor = (taxonId: number) => {
    return ColorConstants.LEGEND[visualisationStore.highlightedTaxa.indexOf(taxonId)];
}

onMounted(async () => {
    const response = await fetch(`http://localhost:4000/pathway/${visualisationStore.pathwayId!.replace("path:ec", "map")}`);
    const data     = await response.json();
    pngUrl.value = data.image;

    const tmp = []
    for (const node of data.nodes) {
        const area = node
        area.colors = []

        if (area.info.ecNumbers.length === 0) {
            tmp.push(area);

            continue;
        }

        for (const taxonId of visualisationStore.highlightedTaxa) {
            const ec = Array.from(fileStore.parsedFile?.taxaToEcs.get(taxonId)!).map(e => e.id);
            if (ec.includes(area.info.ecNumbers[0].id)) {
                area.colors.push(computeTaxonColor(taxonId));
            }
        }

        tmp.push(area);
    }

    areas.value = tmp;
});
</script>

<style scoped>
.image-container {
  position: relative;
}

.legend {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
  background-color: white;
}
</style>
