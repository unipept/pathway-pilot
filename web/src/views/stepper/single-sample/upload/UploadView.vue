<template>
    <div>
        <component 
            :is="formatMap.get(fileFormat)?.component"
            :loading="sampleStore.processing"
            @submit="onSubmit"
            @reset="onReset"
        />

        <error-modal v-model="errors" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import useSingleSampleStore from '@/stores/sample/SingleSampleStore';
import VerifierError from '@/logic/verifiers/VerifierError';
import ErrorModal from '@/components/modals/ErrorModal.vue';
import FileFormat from '../../FileFormat';
import useVisualisationStore from '@/stores/VisualisationStore';

import PeptideListForm from '@/components/forms/single-sample/PeptideListForm.vue';
import ProteinListForm from '@/components/forms/single-sample/ProteinListForm.vue';

import PeptideListVerifier from '@/logic/verifiers/PeptideListVerifier';
import ProteinListVerifier from '@/logic/verifiers/ProteinListVerifier';

import PeptideListConverter from '@/logic/converters/PeptideListConverter';
import ProteinListConverter from '@/logic/converters/ProteinListConverter';

export interface Props {
    fileFormat: FileFormat;
}

const props = defineProps<Props>();

const sampleStore = useSingleSampleStore();
const visualisationStore = useVisualisationStore();

const errors = ref<VerifierError[]>([]);

const formatMap = new Map<FileFormat, { component: any, verifier: any, converter: any }>([
    [ FileFormat.PEPTIDE_LIST, { 
        component: PeptideListForm, 
        verifier: new PeptideListVerifier(), 
        converter: PeptideListConverter
    } ],
    [ FileFormat.PROTEIN_LIST, {
        component: ProteinListForm, 
        verifier: new ProteinListVerifier(),
        converter: ProteinListConverter
    } ]
]);

const onSubmit = async (inputList: string[]) => {
    errors.value = formatMap.get(props.fileFormat)?.verifier.verify(inputList);

    if (errors.value.length <= 0) {
        await sampleStore.initialize(inputList, formatMap.get(props.fileFormat)?.converter);
    }
};

const onReset = () => {
    sampleStore.reset();
    visualisationStore.reset();
    errors.value = [];
};
</script>
