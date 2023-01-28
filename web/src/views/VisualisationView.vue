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
            />
        </reactive-image>
        <taxon-legend
            class="legend"
            title="Legend"
            :items="[
                {label: 'Het eerste item', color: '#75B9BE'},
                {label: 'Het tweede item', color: '#ED9390'},
            ]"
        />
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

    <v-row>
        <v-btn class="mt-5" color="primary" @click="() => onBack($router)">
            Back
        </v-btn>
    </v-row>
</template>

<script setup lang="ts">
import ReactiveImage from '@/components/images/ReactiveImage.vue';
import ImageOverlay from '@/components/images/ImageOverlay.vue';
import useFileStore from '@/stores/FileStore';
import useVisualisationStore from '@/stores/VisualisationStore';
import {onMounted, ref} from "vue";
import ColorConstants from "@/logic/constants/ColorConstants";
import { Router } from 'vue-router';
import TaxonLegend from '@/components/legends/TaxonLegend.vue';

const l = console.log

const fileStore = useFileStore();
const visualisationStore = useVisualisationStore();

const pngUrl = ref<string | undefined>(undefined)
const areas  = ref<any[]>([])

const imageLoaded = ref<boolean>(false)
const scale = ref<number>(1)

const onResize = (event: any) => {
    if (event.width && event.width !== 0) {
        scale.value = event.width / event.naturalWidth;
        imageLoaded.value = true;
    }
}

onMounted(async () => {
    const response = await fetch(`http://localhost:4000/pathway/${visualisationStore.pathwayId!.replace("path:ec", "map")}`);
    const data     = await response.json();
    pngUrl.value = data.image;
    areas.value  = data.nodes;
});

const computeTaxonColor = (taxonId: number) => {
    return ColorConstants.LEGEND[visualisationStore.highlightedTaxa.indexOf(taxonId)];
}

const onBack = (router: Router) => {
    router.push("/selection");
};
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
