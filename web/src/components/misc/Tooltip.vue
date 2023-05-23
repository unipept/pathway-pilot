<template>
    <v-tooltip
        v-model="hovering"
        location="top center"
        origin="auto"
    >
        <template v-slot:activator="{ props }">
            <slot :props="props"></slot>
        </template>

        <span>{{ message }}</span>
    </v-tooltip>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

export interface Props {
    message: string
};

defineProps<Props>();

const hovering = ref<boolean>(false);

watch(hovering, async () => {
    // La crème de crème of hacks
    // nextTick is needed to make sure the incorrect rendering is finished
    // Then we have to use scrollTo twice to simulate a scroll
    // We can not use dispatchEvent because it does not spawn trusted events
    await nextTick(() => {
        window.scrollTo(window.scrollX, window.scrollY - 1);
        window.scrollTo(window.scrollX, window.scrollY + 1);
    });
});
</script>

