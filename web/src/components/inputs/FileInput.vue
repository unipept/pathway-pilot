<template>
    <v-card
        @drop.prevent="onDrop($event)"
        @dragover.prevent="dragover = true"
        @dragenter.prevent="dragover = true"
        @dragleave.prevent="dragover = false"
        @click="openFilePicker"
        :disabled="disabled"
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
                    Drop your file here, or click to select a single file.
                </p>
                <p v-if="file" class="text-green mt-3">
                    {{ file.name }} ({{ file.size }} bytes)
                </p>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

export interface Props {
    modelValue: File | undefined;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false
});

const emits = defineEmits(["upload"]);

const file = ref<File | undefined>(props.modelValue);

const dragover = ref<boolean>(false);

const onDrop = (event: any) => {
    dragover.value = false;

    file.value = event.dataTransfer.files[0];
    emits("upload", file.value);
}

const openFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    // input.accept = '.csv';
    input.onchange = (event: any) => {
        file.value = event.target.files[0];
        emits("upload", file.value);
    }
    input.click();
}

watch(() => props.modelValue, (newVal: File | undefined) => {
    file.value = newVal;
});
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
