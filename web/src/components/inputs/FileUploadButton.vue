<template>
    <v-btn
        color="primary"
        variant="outlined"
        @click="openFilePicker"
    >
        <slot></slot>
    </v-btn>
</template>

<script setup lang="ts">
const emits = defineEmits(["upload"]);

const openFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    // input.accept = '.csv';
    input.onchange = (event: any) => {
        emits("upload", Array.from(event.target.files));
    }
    input.click();
}
</script>
