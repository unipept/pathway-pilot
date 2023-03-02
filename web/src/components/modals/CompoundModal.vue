<template>
    <v-dialog
        v-model="dialogOpen"
        @click:outside="onClickOutside"
        width="90%"
        max-height="90%"
    >
        <compound-information-view :compoundId="compoundId" />
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CompoundInformationView from '@/views/information/CompoundInformationView.vue';

export interface Props {
    modelValue: boolean;
    compoundId: string;
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
