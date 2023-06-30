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
    alt?: string
};

withDefaults(defineProps<Props>(), {
    alt: ''
});

const emits = defineEmits(['resize']);

const reactiveImage = ref<typeof VImg>();

const width = ref<number>(0);
const height = ref<number>(0);

const naturalWidth = ref<number>(0);
const naturalHeight = ref<number>(0);

// Observe the internal image element for changes
// We need this because the image element is not reactive and 
// We cannot access the image element directly
const observer = new MutationObserver(() => onResize());

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
    addEventListener('resize', () => {
        // Disconnect the observer from listening to changes
        observer.disconnect();
        onResize();
    });

    observer.observe(reactiveImage.value?.$el, {
        attributes: true,
        childList: true,
        subtree: true
    });
});

onBeforeUnmount(() => {
    removeEventListener('resize', () => {});
});
</script>

<style scoped>
.select-none {
    user-select: none;
    overflow: visible;
}
</style>
