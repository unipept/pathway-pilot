<template>
    <file-upload-button @upload="onUpload">
        <v-icon>mdi-paperclip-plus</v-icon>
        <span class="ms-1">Batch upload multiple samples</span>
    </file-upload-button>
</template>

<script lang="ts" setup>
import FileUploadButton from '@/components/inputs/FileUploadButton.vue';
import { useFileReader } from '@/composables/useFileReader';

const { readTextFile } = useFileReader();

const onUpload = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
        const fileContent = await readTextFile(files[i]);
        const fileName = files[i].name;
        console.log(fileName);
    }
}
</script>

<style scoped>

</style>
