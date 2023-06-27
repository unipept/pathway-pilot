<template>
    <div>
        <h4 class="mb-3">You can upload and compare a maximum of 4 samples</h4>

        <warning-alert
            v-if="samples.length <= 0"
            class="mb-4"
        >
            It seems that you haven't uploaded any samples yet. To begin, simply click the button below to initiate the upload process for your first sample.
        </warning-alert>

        <group-table 
            :items="tableItems"
            :max="4"
            @add:sample="addModalOpen = true"
            @remove="onRemove"
        />

        <add-sample-modal 
            v-model="addModalOpen"
            :file-format="fileFormat"
            @submit="onSubmit"
        />

        <delete-sample-modal 
            v-model="deleteModalOpen" 
            :index="deleteModalIndex" 
            :name="deleteModalName"
            @remove="onRemoveConfirmed"
        />
    </div>
</template>

<script setup lang="ts">
import useMultiSampleStore from '@/stores/MultiSampleStore';
import AddSampleModal from '@/components/modals/multi-sample/AddSampleModal.vue';
import DeleteSampleModal from '@/components/modals/multi-sample/DeleteSampleModal.vue';
import GroupTable from '@/components/tables/multi-sample/GroupTable.vue';
import WarningAlert from '@/components/alerts/WarningAlert.vue';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import FileFormat from '../FileFormat';

import PeptideListConverter from '@/logic/converters/peptide/PeptideListConverter';
import PeptideShakerConverter from '@/logic/converters/peptide/PeptideShakerConverter';
import MaxQuantConverter from '@/logic/converters/peptide/MaxQuantConverter';
import ProteomeDiscovererConverter from '@/logic/converters/peptide/ProteomeDiscovererConverter';
import MetaProteomeAnalyzerConverter from '@/logic/converters/peptide/MetaProteomeAnalyzerConverter';
import ProteinListConverter from '@/logic/converters/protein/ProteinListConverter';
import UnipeptCommunicator from '@/logic/communicators/UnipeptCommunicator';

export interface Props {
    fileFormat: FileFormat;
}

const props = defineProps<Props>();

const sampleStore = useMultiSampleStore();

const { samples } = storeToRefs(sampleStore);

const tableItems = computed(() => [{
    name: 'group 1',
    items: samples.value.map(sample => ({
        name: sample.name,
        size: `${sample.size} peptides`,
        loading: !sample.initialized
    }))
}]);

const addModalOpen = ref<boolean>(false);

const deleteModalOpen = ref<boolean>(false);
const deleteModalIndex = ref<number>(-1);
const deleteModalName = ref<string>("");

const processing = ref<boolean>(false);

const unipeptCommunicator = new UnipeptCommunicator();

const formatMap = new Map<FileFormat, { converter: any }>([
    [ FileFormat.PEPTIDE_LIST, { converter: new PeptideListConverter(unipeptCommunicator) } ],
    [ FileFormat.PEPTIDE_SHAKER, { converter: new PeptideShakerConverter(unipeptCommunicator) } ],
    [ FileFormat.MAX_QUANT, { converter: new MaxQuantConverter(unipeptCommunicator) } ],
    [ FileFormat.PROTEOME_DISCOVERER, { converter: new ProteomeDiscovererConverter(unipeptCommunicator) } ],
    [ FileFormat.META_PROTEOME_ANALYZER, { converter: new MetaProteomeAnalyzerConverter(unipeptCommunicator) } ],
    [ FileFormat.PROTEIN_LIST, { converter: new ProteinListConverter(unipeptCommunicator) } ],
]);

const onSubmit = async (peptideList: string[], sampleName: string) => {
    processing.value = true;

    const sample = sampleStore.addSample(sampleName);
    sampleStore.initializeSample(
        sample,
        peptideList,
        formatMap.get(props.fileFormat)?.converter
    );

    processing.value = false;
};

const onRemove = (index: number, name: string) => {
    deleteModalIndex.value = index;
    deleteModalName.value = name;
    deleteModalOpen.value = true;
};

const onRemoveConfirmed = () => {
    sampleStore.removeSample(deleteModalIndex.value);
};
</script>
