<template>
    <v-dialog
        v-model="dialogOpen"
        @click:outside="onClickOutside"
        max-width="75%"
    >
        <peptide-list-form @submit="onSubmit" />

        <error-modal v-model="errors" />
    </v-dialog>
</template>

<script setup lang="ts">
import PeptideListForm from '@/components/forms/multi-sample/PeptideListForm.vue';
import PeptideListVerifier from '@/logic/verifiers/PeptideListVerifier';
import VerifierError from '@/logic/verifiers/VerifierError';
import ErrorModal from '@/components/modals/ErrorModal.vue';
import { ref, watch } from 'vue';

export interface Props {
    modelValue: boolean;
}

const props = defineProps<Props>();

const emits = defineEmits(['update:model-value', 'submit']);

const dialogOpen = ref<boolean>(props.modelValue);

const errors = ref<VerifierError[]>([]);

const onClickOutside = () => {
    emits('update:model-value', false);
};

const onSubmit = (peptideList: string[], sampleName: string) => {
    errors.value = new PeptideListVerifier().verify(peptideList);

    if (errors.value.length <= 0) {
        emits('submit', peptideList, sampleName);
        emits('update:model-value', false);
    }
};

watch(() => props.modelValue, (value) => {
    dialogOpen.value = value;
});
</script>
