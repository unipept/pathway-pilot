<template>
    <v-btn @click="() => areaModalOpen = true">
        Click me
    </v-btn>

    <area-modal
        :model-value="areaModalOpen"
        @update:model-value="areaModalOpen = $event"
    />
</template>

<script setup lang="ts">
import AreaModal from '@/components/modals/AreaModal.vue';
import { ref } from 'vue';

const areaModalOpen = ref<boolean>(false);
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
