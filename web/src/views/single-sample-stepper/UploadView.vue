<template>
    <div class="mt-5">
        <component 
            :is="formatMap.get(fileFormat)?.component"
            :loading="processing"
            @submit="onSubmit"
            @reset="onReset"
        />

        <error-modal v-model="errors" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import useSingleSampleStore from '@/stores/SingleSampleStore';
import VerifierError from '@/logic/verifiers/VerifierError';
import ErrorModal from '@/components/modals/ErrorModal.vue';
import UnipeptCommunicator from '@/logic/communicators/UnipeptCommunicator';
import FileFormat from '../FileFormat';

import PeptideListForm from '@/components/forms/PeptideListForm.vue';
import PeptideShakerForm from '@/components/forms/single-sample/PeptideShakerForm.vue';

import PeptideListVerifier from '@/logic/verifiers/PeptideListVerifier';
import PeptideShakerVerifier from '@/logic/verifiers/PeptideShakerVerifier';

import PeptideListConverter from '@/logic/converters/PeptideListConverter';
import PeptideShakerConverter from '@/logic/converters/PeptideShakerConverter';

export interface Props {
    fileFormat: FileFormat;
}

const props = defineProps<Props>();

defineEmits(['submit']);

const sampleStore = useSingleSampleStore('single-sample');

const processing = ref<boolean>(false);

const errors = ref<VerifierError[]>([]);

const formatMap = new Map<FileFormat, { component: any, verifier: any, converter: any }>([
    [ FileFormat.PEPTIDE_LIST, { 
        component: PeptideListForm, 
        verifier: new PeptideListVerifier(), 
        converter: new PeptideListConverter({ onProgressUpdate: () => {} })
    } ],
    [ FileFormat.PEPTIDE_SHAKER, { 
        component: PeptideShakerForm, 
        verifier: new PeptideShakerVerifier(),
        converter: new PeptideShakerConverter({ onProgressUpdate: () => {} })
    } ],
]);

const onSubmit = async (peptideList: string[]) => {
    processing.value = true;

    errors.value = formatMap.get(props.fileFormat)?.verifier.verify(peptideList);

    if (errors.value.length <= 0) {
        sampleStore.initialize(await formatMap.get(props.fileFormat)?.converter.convert(peptideList), peptideList);
        sampleStore.setTree(await new UnipeptCommunicator().fetchTaxonomy(Array.from(sampleStore.taxa.keys())))
    }

    processing.value = false;
};

const onReset = () => {
    sampleStore.reset();
    errors.value = [];
};
</script>

<style scoped>
.subtitle {
    color: #454545;
}
</style>
