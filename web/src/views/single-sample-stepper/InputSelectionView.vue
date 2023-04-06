<template>
    <v-select
        class="mt-3 mb-n5"
        v-model="inputFormat"
        label="Select your input format"
        density="comfortable"
        :items="inputFormats"
    />
</template>

<script setup lang="ts">
import inputFormats from '../FileFormat';
import { ref } from 'vue';

const inputFormat = ref<string>(inputFormats[0]);
</script>
