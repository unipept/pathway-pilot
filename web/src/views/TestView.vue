<template>
    <div v-if="pngUrl" class="pathway-container">
        <reactive-image 
            :src="pngUrl" 
            alt="Pathway"
            @resize="onResize"
        >
            <svg v-if="imageLoaded" width="100%" height="100%">
                <rect v-for="area in areas.filter(a => a.shape === 'rect')"
                    :x="area.x1 / naturalWidth * width"
                    :y="area.y1 / naturalHeight * height"
                    :width="(area.x2 - area.x1) / naturalWidth * width"
                    :height="(area.y2 - area.y1) / naturalHeight * height"
                    stroke="green"
                    fill="green"
                    fill-opacity="0.1"
                    :onclick="onClick"
                />

                <circle v-for="area in areas.filter(a => a.shape === 'circle')"
                    :cx="area.x / naturalWidth * width"
                    :cy="area.y / naturalHeight * height"
                    :r="area.r / naturalWidth * width"
                    stroke="red"
                    fill="red"
                    fill-opacity="0.1"
                    :onclick="onClick"
                />
            </svg>
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
    const response = await fetch("http://localhost:4000/pathway/map00620");
    const data     = await response.json();
    pngUrl.value = data.image;
    areas.value  = data.nodes;
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
