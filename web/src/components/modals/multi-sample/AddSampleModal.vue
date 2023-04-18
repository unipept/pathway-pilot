<template>
    <v-dialog
        v-model="dialogOpen"
        @click:outside="onClickOutside"
        max-width="75%"
    >
        <component 
            :is="formatMap.get(fileFormat)?.component"
            @submit="onSubmit"
        />

        <error-modal v-model="errors" />
    </v-dialog>
</template>

<script setup lang="ts">
import VerifierError from '@/logic/verifiers/VerifierError';
import ErrorModal from '@/components/modals/ErrorModal.vue';
import { ref, watch } from 'vue';
import FileFormat from '@/views/FileFormat';

import PeptideListForm from '@/components/forms/multi-sample/PeptideListForm.vue';
import PeptideShakerForm from '@/components/forms/multi-sample/PeptideShakerForm.vue';

import PeptideListVerifier from '@/logic/verifiers/PeptideListVerifier';
import PeptideShakerVerifier from '@/logic/verifiers/PeptideShakerVerifier';

export interface Props {
    modelValue: boolean;
    fileFormat: FileFormat;
}

const props = defineProps<Props>();

const emits = defineEmits(['update:model-value', 'submit']);

const dialogOpen = ref<boolean>(props.modelValue);

const errors = ref<VerifierError[]>([]);

const formatMap = new Map<FileFormat, { component: any, verifier: any }>([
    [ FileFormat.PEPTIDE_LIST, { 
        component: PeptideListForm, 
        verifier: new PeptideListVerifier()
    } ],
    [ FileFormat.PEPTIDE_SHAKER, { 
        component: PeptideShakerForm, 
        verifier: new PeptideShakerVerifier()
    } ],
]);

const onClickOutside = () => {
    emits('update:model-value', false);
};

const onSubmit = (peptideList: string[], sampleName: string) => {
    errors.value = formatMap.get(props.fileFormat)?.verifier.verify(peptideList);

    if (errors.value.length <= 0) {
        emits('submit', peptideList, sampleName);
        emits('update:model-value', false);
    }
};

watch(() => props.modelValue, (value) => {
    dialogOpen.value = value;
});
</script>
