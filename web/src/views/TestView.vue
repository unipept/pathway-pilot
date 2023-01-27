<template>
    <div v-if="pngUrl" class="pathway-container">
        <reactive-image 
            :src="pngUrl" 
            alt="Pathway"
            @resize="onResize"
        >
            <image-overlay 
                :areas="areas"
                :scale="width / naturalWidth"
                :onClick="onClick"
            />
        </reactive-image>
    </div>

    <div v-else>
        <v-progress-circular
            class="progress-loader"
            size="50"
            width="5"
            color="secondary"
            indeterminate
        ></v-progress-circular>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import ReactiveImage from '@/components/images/ReactiveImage.vue';
import ImageOverlay from '@/components/images/ImageOverlay.vue';

const pngUrl = ref<string | undefined>(undefined)
const areas  = ref<any[]>([])

const naturalWidth  = ref<number>(0)
const naturalHeight = ref<number>(0)
const width         = ref<number>(0)
const height        = ref<number>(0)

const imageLoaded = computed(() => width.value !== 0)

const onClick = () => {
    console.log("ok")
}

const onResize = (event: any) => {
    naturalWidth.value  = event.naturalWidth
    naturalHeight.value = event.naturalHeight
    width.value         = event.width
    height.value        = event.height
}

onMounted(async () => {
    const response = await fetch("http://localhost:4000/pathway/map00053");
    const data     = await response.json();
    pngUrl.value = data.image;
    areas.value  = data.nodes
});
</script>

<style scoped>
svg {
    z-index: 1;
}

.pathway-container {
    position: relative;
    height: max-content;
}

.progress-loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
