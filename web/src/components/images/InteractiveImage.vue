<template>
    <div ref="image" class="interactive-image-container">
        <div :style="style">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

export interface Props {
    scale?: number
    translate?: { x: number, y: number }
};

const props = withDefaults(defineProps<Props>(), {
    scale: 1,
    translate: () => ({ x: 0, y: 0 })
});

const emits = defineEmits(['update:scale', 'update:translate']);

const image = ref<HTMLDivElement | null>(null);

const _scale = ref(props.scale);
const _translate = ref(props.translate);

const style = computed(() => ({
    transform: `scale(${_scale.value}) translate(${_translate.value.x}px, ${_translate.value.y}px)`
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

    _translate.value.x += e.movementX / _scale.value;
    _translate.value.y += e.movementY / _scale.value;

    emits('update:translate', _translate.value);
};

const onMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    mouseDown = false;
};

const onZoom = (e: WheelEvent) => {
    e.preventDefault();

    _scale.value += e.deltaY * -0.005;
    _scale.value = Math.min(Math.max(.250, _scale.value), 4);

    emits('update:scale', _scale.value);
};

watch(() => props.scale, (scale) => {
    _scale.value = scale;
});

watch(() => props.translate, (translate) => {
    _translate.value = translate;
});

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
    overflow: visible;
}
</style>
