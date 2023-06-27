<template>
    <div>
        <h4 class="mb-3">You can upload and compare a maximum of 4 samples</h4>

        <warning-alert
            v-if="groups.length <= 0"
            class="mb-4"
        >
            It seems that you haven't uploaded any samples yet. To begin, simply click the button below to initiate the upload process for your first sample.
        </warning-alert>

        <group-table 
            :items="tableItems"
            :max="4"
            @add:sample="onAddSample"
            @add:group="onAddGroup"
            @remove:sample="onRemoveSample"
            @remove:group="onRemoveGroup"
            @update:group:name="onUpdateGroupName"
            @update:sample:name="onUpdateSampleName"
        />

        <v-dialog v-model="addModalOpen">
            <component :is="formatMap.get(fileFormat)?.component" @submit="onSubmit" />
        </v-dialog>

        <delete-sample-modal 
            v-model="deleteModalOpen" 
            :index="deleteModalSampleIndex" 
            :name="deleteModalSampleName"
            @confirm="onRemoveSampleConfirm"
        />

        <error-modal v-model="errors" />
    </div>
</template>

<script setup lang="ts">
import DeleteSampleModal from '@/components/modals/multi-sample/DeleteSampleModal.vue';
import GroupTable from '@/components/tables/multi-sample/GroupTable.vue';
import WarningAlert from '@/components/alerts/WarningAlert.vue';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import FileFormat from '../FileFormat';
import UnipeptCommunicator from '@/logic/communicators/UnipeptCommunicator';
import useGroupSampleStore from '@/stores/GroupSampleStore';
import VerifierError from '@/logic/verifiers/VerifierError';
import ErrorModal from '@/components/modals/ErrorModal.vue';

import PeptideListForm from '@/components/forms/multi-sample/peptide/PeptideListForm.vue';
import PeptideShakerForm from '@/components/forms/multi-sample/peptide/PeptideShakerForm.vue';
import MaxQuantForm from '@/components/forms/multi-sample/peptide/MaxQuantForm.vue';
import ProteomeDiscovererForm from '@/components/forms/multi-sample/peptide/ProteomeDiscovererForm.vue';
import MetaProteomeAnalyzerForm from '@/components/forms/multi-sample/peptide/MetaProteomeAnalyzerForm.vue';
import ProteinListForm from '@/components/forms/multi-sample/protein/ProteinListForm.vue';

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

const sampleStore = useGroupSampleStore();

const { groups } = storeToRefs(sampleStore);

const tableItems = computed(() => groups.value.map(group => ({
    name: group.name,
    items: group.samples.map((sample: any) => ({
        uploadName: sample.uploadName,
        name: sample.name,
        size: `${sample.size} peptides`,
        loading: !sample.initialized
    }))
})));

const addModalOpen = ref<boolean>(false);
const addModalGroup = ref<number>(-1);

const deleteModalOpen = ref<boolean>(false);
const deleteModalGroupIndex = ref<number>(-1);
const deleteModalSampleIndex = ref<number>(-1);
const deleteModalSampleName = ref<string>("");

const processing = ref<boolean>(false);

const errors = ref<VerifierError[]>([]);

const unipeptCommunicator = new UnipeptCommunicator();

const formatMap = new Map<FileFormat, { component: any, verifier: any, converter: any }>([
    [ FileFormat.PEPTIDE_LIST, { 
        component: PeptideListForm, 
        verifier: new PeptideListVerifier(),
        converter: new PeptideListConverter(unipeptCommunicator) 
    } ],
    [ FileFormat.PEPTIDE_SHAKER, { 
        component: PeptideShakerForm, 
        verifier: new PeptideShakerVerifier(),
        converter: new PeptideShakerConverter(unipeptCommunicator) 
    } ],
    [ FileFormat.MAX_QUANT, { 
        component: MaxQuantForm, 
        verifier: new MaxQuantVerifier(),
        converter: new MaxQuantConverter(unipeptCommunicator) 
    } ],
    [ FileFormat.PROTEOME_DISCOVERER, { 
        component: ProteomeDiscovererForm, 
        verifier: new ProteomeDiscovererVerifier(),
        converter: new ProteomeDiscovererConverter(unipeptCommunicator) 
    } ],
    [ FileFormat.META_PROTEOME_ANALYZER, { 
        component: MetaProteomeAnalyzerForm, 
        verifier: new MetaProteomeAnalyzerVerifier(),
        converter: new MetaProteomeAnalyzerConverter(unipeptCommunicator) 
    } ],

    [ FileFormat.PROTEIN_LIST, { 
        component: ProteinListForm, 
        verifier: new ProteinListVerifier(),
        converter: new ProteinListConverter(unipeptCommunicator) 
    } ]
]);

const onSubmit = (peptideList: string[], sampleName: string) => {
    processing.value = true;

    errors.value = formatMap.get(props.fileFormat)?.verifier.verify(peptideList);

    if (errors.value.length <= 0) {
        addModalOpen.value = false;

        const [ group, sample ] = sampleStore.addSample(addModalGroup.value, sampleName);
        sampleStore.initializeSample(group, sample, peptideList, formatMap.get(props.fileFormat)?.converter);
    }

    processing.value = false;
};

const onAddSample = (groupIndex: number) => {
    addModalGroup.value = groupIndex;
    addModalOpen.value = true;
};

const onAddGroup = () => {
    sampleStore.addGroup('');
};

const onRemoveSample = (groupIndex: number, sampleIndex: number) => {
    deleteModalGroupIndex.value = groupIndex;
    deleteModalSampleIndex.value = sampleIndex;
    deleteModalSampleName.value = groups.value[groupIndex].samples[sampleIndex].name;
    deleteModalOpen.value = true;
};

const onRemoveSampleConfirm = () => {
    sampleStore.removeSample(deleteModalGroupIndex.value, deleteModalSampleIndex.value);
};

const onRemoveGroup = (groupIndex: number) => {
    sampleStore.removeGroup(groupIndex);
};

const onUpdateGroupName = (groupIndex: number, name: string) => {
    groups.value[groupIndex].updateName(name);
};

const onUpdateSampleName = (groupIndex: number, sampleIndex: number, name: string) => {
    groups.value[groupIndex].updateSampleName(sampleIndex, name);
};
</script>
