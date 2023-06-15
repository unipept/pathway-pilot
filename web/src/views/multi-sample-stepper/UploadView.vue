<template>
    <div class="mt-5">
        <sample-table 
            :items="tableItems"
            :max="4"
            @add="addModalOpen = true"
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
import SampleTable from '@/components/tables/multi-sample/SampleTable.vue';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import FileFormat from '../FileFormat';

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

const sampleStore = useMultiSampleStore();

const { samples } = storeToRefs(sampleStore);

const tableItems = computed(() => 
    samples.value.map(sample => ({
        name: sample.name,
        size: `${sample.size} peptides`,
        loading: !sample.initialized,
    }))
);

const addModalOpen = ref<boolean>(false);

const deleteModalOpen = ref<boolean>(false);
const deleteModalIndex = ref<number>(-1);
const deleteModalName = ref<string>("");

const processing = ref<boolean>(false);

const formatMap = new Map<FileFormat, { converter: any }>([
    [ FileFormat.PEPTIDE_LIST, { converter: new PeptideListConverter({ onProgressUpdate: () => {} }) } ],
    [ FileFormat.PEPTIDE_SHAKER, { converter: new PeptideShakerConverter({ onProgressUpdate: () => {} }) } ],
    [ FileFormat.MAX_QUANT, { converter: new MaxQuantConverter({ onProgressUpdate: () => {} }) } ],
    [ FileFormat.PROTEOME_DISCOVERER, { converter: new ProteomeDiscovererConverter({ onProgressUpdate: () => {} }) } ],
    [ FileFormat.META_PROTEOME_ANALYZER, { converter: new MetaProteomeAnalyzerConverter({ onProgressUpdate: () => {} }) } ],
    [ FileFormat.PROTEIN_LIST, { converter: new ProteinListConverter({ onProgressUpdate: () => {} }) } ],
]);

const onSubmit = async (peptideList: string[], sampleName: string) => {
    processing.value = true;

    console.log(sampleName)

    const sample = sampleStore.addSample(sampleName);
    sampleStore.initializeSample(
        sample, 
        await formatMap.get(props.fileFormat)?.converter.convert(peptideList),
        peptideList
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
