<template>
    <v-progress-circular
        v-model="loadingProgress"
        class="loading-spinner"
        size="100"
        width="10"
        color="primary"
    >
        <div class="loading-spinner-value">{{ loadingProgress }} %</div>
    </v-progress-circular>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

export interface Props {
    loading?: false | number;
};

const props = withDefaults(defineProps<Props>(), {
    loading: false,
});

const loadingProgress = ref<number>(props.loading || 100);

watch(() => props.loading, (value) => {
    loadingProgress.value = value || 100;
});
</script>

<style scoped>
.loading-spinner {
    position: absolute;
    top: calc(50% - 10px);
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: 600;
    font-size: 18px;
}

.loading-spinner-value {
    background-color: white;
    padding: 8px;
}
</style>
