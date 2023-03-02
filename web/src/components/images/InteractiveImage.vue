<template>
    <div 
        ref="image"
        class="interactive-image-container"
    >
        <div :style="style">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const image = ref<HTMLDivElement | null>(null);

const scale = ref(1);
const translate = ref({ x: 0, y: 0 });

const style = computed(() => ({
    transform: `scale(${scale.value}) translate(${translate.value.x}px, ${translate.value.y}px)`
}));

let mouseDown = false;

const onMouseDown = (e: MouseEvent) => {
    // Only allow left click
    if (e.button !== 0) {
        return;
    }

    e.preventDefault();
    
    mouseDown = true;
};

const onMouseMove = (e: MouseEvent) => {
    if (!mouseDown) {
        return;
    }

    e.preventDefault();

    translate.value.x += e.movementX / scale.value;
    translate.value.y += e.movementY / scale.value;
};

const onMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    mouseDown = false;
};

const onZoom = (e: WheelEvent) => {
    e.preventDefault();

    scale.value += e.deltaY * -0.005;
    scale.value = Math.min(Math.max(.250, scale.value), 4);
};

onMounted(() => {
    image.value?.addEventListener('mousedown', onMouseDown);
    image.value?.addEventListener('mousemove', onMouseMove);
    image.value?.addEventListener('mouseup', onMouseUp);
    image.value?.addEventListener('mouseleave', onMouseUp);

    image.value?.addEventListener('wheel', onZoom);
});
</script>

<style scoped>
.interactive-image-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}
</style>
