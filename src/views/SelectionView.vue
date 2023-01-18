<template>
    <div>{{ fileStore.uploadedFile.name }}</div>
</template>

<script setup lang="ts">
import useFileStore from '@/stores/FileStore';

const fileStore = useFileStore();
</script>
