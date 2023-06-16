<template>
    <div>
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

import PeptideListForm from '@/components/forms/single-sample/peptide/PeptideListForm.vue';
import PeptideShakerForm from '@/components/forms/single-sample/peptide/PeptideShakerForm.vue';
import MaxQuantForm from '@/components/forms/single-sample/peptide/MaxQuantForm.vue';
import ProteomeDiscovererForm from '@/components/forms/single-sample/peptide/ProteomeDiscovererForm.vue';
import MetaProteomeAnalyzerForm from '@/components/forms/single-sample/peptide/MetaProteomeAnalyzerForm.vue';
import ProteinListForm from '@/components/forms/single-sample/protein/ProteinListForm.vue';

import PeptideListVerifier from '@/logic/verifiers/peptide/PeptideListVerifier';
import PeptideShakerVerifier from '@/logic/verifiers/peptide/PeptideShakerVerifier';
import MaxQuantVerifier from '@/logic/verifiers/peptide/MaxQuantVerifier';
import ProteomeDiscovererVerifier from '@/logic/verifiers/peptide/ProteomeDiscovererVerifier';
import MetaProteomeAnalyzerVerifier from '@/logic/verifiers/peptide/MetaProteomeAnalyzerVerifier';
import ProteinListVerifier from '@/logic/verifiers/protein/ProteinListVerifier';

import PeptideListConverter from '@/logic/converters/peptide/PeptideListConverter';
import PeptideShakerConverter from '@/logic/converters/peptide/PeptideShakerConverter';
import MaxQuantConverter from '@/logic/converters/peptide/MaxQuantConverter';
import ProteomeDiscovererConverter from '@/logic/converters/peptide/ProteomeDiscovererConverter';
import MetaProteomeAnalyzerConverter from '@/logic/converters/peptide/MetaProteomeAnalyzerConverter';
import ProteinListConverter from '@/logic/converters/protein/ProteinListConverter';

export interface Props {
    fileFormat: FileFormat;
}

const props = defineProps<Props>();

defineEmits(['submit']);

const sampleStore = useSingleSampleStore();

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
    [ FileFormat.MAX_QUANT, {
        component: MaxQuantForm, 
        verifier: new MaxQuantVerifier(),
        converter: new MaxQuantConverter({ onProgressUpdate: () => {} })
    } ],
    [ FileFormat.PROTEOME_DISCOVERER, { 
        component: ProteomeDiscovererForm, 
        verifier: new ProteomeDiscovererVerifier(),
        converter: new ProteomeDiscovererConverter({ onProgressUpdate: () => {} })
    } ],
    [ FileFormat.META_PROTEOME_ANALYZER, { 
        component: MetaProteomeAnalyzerForm, 
        verifier: new MetaProteomeAnalyzerVerifier(),
        converter: new MetaProteomeAnalyzerConverter({ onProgressUpdate: () => {} })
    } ],
    
    [ FileFormat.PROTEIN_LIST, {
        component: ProteinListForm, 
        verifier: new ProteinListVerifier(),
        converter: new ProteinListConverter({ onProgressUpdate: () => {} })
    } ],
]);

const onSubmit = async (peptideList: string[]) => {
    processing.value = true;

    errors.value = formatMap.get(props.fileFormat)?.verifier.verify(peptideList);

    if (errors.value.length <= 0) {
        await sampleStore.initialize(peptideList, formatMap.get(props.fileFormat)?.converter);
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
