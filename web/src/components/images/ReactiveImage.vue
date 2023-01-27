<template>
    <v-img
        ref="reactiveImage"
        class="select-none"
        :src="src" 
        :alt="alt"
    >
        <slot></slot>
    </v-img>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { VImg } from 'vuetify/components';

export interface Props {
    src: string
    alt: string
};
defineProps<Props>();

const emits = defineEmits(['resize']);

const reactiveImage = ref<typeof VImg>();

const width = ref<number>(0);
const height = ref<number>(0);

const naturalWidth = ref<number>(0);
const naturalHeight = ref<number>(0);

const onResize = () => {
    naturalWidth.value = reactiveImage.value?.image.naturalWidth;
    naturalHeight.value = reactiveImage.value?.image.naturalHeight;

    width.value = reactiveImage.value?.image.clientWidth;
    height.value = reactiveImage.value?.image.clientHeight;

    emits('resize', {
        width: width.value,
        height: height.value,
        naturalWidth: naturalWidth.value,
        naturalHeight: naturalHeight.value
    });
};

onMounted(() => {
    addEventListener('resize', onResize)

    // Timeout is required because the image inside the v-img component is not loaded yet
    // This solution is not sufficient, but it works for now (TODO: find a better solution)
    setTimeout(() => {
        onResize();
    }, 500);
});

onBeforeUnmount(() => {
    removeEventListener('resize', () => {});
});
</script>

<style scoped>
.select-none {
    user-select: none;
}
</style>
