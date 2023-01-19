<template>
    <div>{{ fileStore.uploadedFile.name }}</div>
    <div>{{ JSON.stringify(fileStore.parsedFile) }}</div>
</template>

<script setup lang="ts">
import useFileStore from '@/stores/FileStore';

const fileStore = useFileStore();
</script>
