<template>
    <v-card
        @drop.prevent="onDrop($event)"
        @dragover.prevent="dragover = true"
        @dragenter.prevent="dragover = true"
        @dragleave.prevent="dragover = false"
        :class="{ 'grey lighten-2': dragover }"
        class="file-input d-flex align-center"
        flat
    >
        <v-card-text>
            <v-row class="d-flex flex-column" dense align="center" justify="center">
                <v-icon size="60">
                    mdi-tray-arrow-up
                </v-icon>
                <p>
                    Drop your file here, or click anywhere to select it.
                </p>
                <p v-if="uploadedFile" class="text-green mt-3">
                    {{ uploadedFile.name }} ({{ uploadedFile.size }} bytes)
                </p>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const dragover = ref<boolean>(false);
const uploadedFile = ref<any>(undefined);

const onDrop = (event: any) => {
    dragover.value = false;

    if (event.dataTransfer.files.length > 1) {
    console.log("TODO: error message");
    } else {
    uploadedFile.value = event.dataTransfer.files[0];
    }
}

const clearFile = () => {
    uploadedFile.value = undefined;
}
</script>

<style scoped>
.file-input {
    height: 200px;
    border: dashed 2px #ccc;
}

.file-input-files {
    width: 60%;
    justify-self: center;
}

.clear-file-action {
    flex-grow: 0;
}
</style>
