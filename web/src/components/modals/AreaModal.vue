<template>
    <v-dialog
        v-model="dialogOpen"
        @click:outside="onClickOutside"
    >
        <v-card flat>
            <v-card-title>Dit is een titel</v-card-title>

            <v-card-text>
                Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

export interface Props {
    modelValue: boolean;
}

const props = defineProps<Props>();

const emits = defineEmits(['update:model-value']);

const dialogOpen = ref<boolean>(props.modelValue);

const onClickOutside = () => {
    emits('update:model-value', false);
};

watch(() => props.modelValue, (value) => {
    dialogOpen.value = value;
});
</script>
