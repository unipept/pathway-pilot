<template>
    <v-progress-circular
        v-model="loadingProgress"
        class="loading-spinner"
        :size="size"
        :width="width"
        :color="color"
    >
        <div v-if="label" class="loading-spinner-value">{{ loadingProgress }} %</div>
    </v-progress-circular>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

export interface Props {
    loading?: false | number;
    size?: number;
    width?: number;
    color?: string;
    label?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    size: 100,
    width: 10,
    color: 'primary',
    label: true
});

const loadingProgress = ref<number>(props.loading === false ? 0 : props.loading);

watch(() => props.loading, (value) => {
    loadingProgress.value = value || 100;
});
</script>

<style scoped>
.loading-spinner {
    font-weight: 600;
    font-size: 18px;
}

.loading-spinner-value {
    background-color: white;
    padding: 8px;
}
</style>
