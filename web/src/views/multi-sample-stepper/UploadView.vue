<template>
    <div class="mt-5">
        <sample-table 
            :items="tableItems"
            @add="addModalOpen = true"
            @remove="onRemove"
        />

        <add-sample-modal 
            v-model="addModalOpen" 
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
import PeptideListConverter from '@/logic/converters/PeptideListConverter';
import useMultiSampleStore from '@/stores/MultiSampleStore';
import AddSampleModal from '@/components/modals/multi-sample/AddSampleModal.vue';
import DeleteSampleModal from '@/components/modals/multi-sample/DeleteSampleModal.vue';
import SampleTable from '@/components/tables/multi-sample/SampleTable.vue';
import inputFormats from './FileFormat';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const sampleStore = useMultiSampleStore();

const { samples } = storeToRefs(sampleStore);

const tableItems = computed(() => 
    samples.value.map(sample => ({
        name: sample.name,
        size: `${sample.size} peptides`,
        loading: !sample.initialized,
    }))
);

const inputFormat = ref<string>();

const addModalOpen = ref<boolean>(false);

const deleteModalOpen = ref<boolean>(false);
const deleteModalIndex = ref<number>(-1);
const deleteModalName = ref<string>("");

const onRemove = (index: number, name: string) => {
    deleteModalIndex.value = index;
    deleteModalName.value = name;
    deleteModalOpen.value = true;
};

const onRemoveConfirmed = () => {
    sampleStore.removeSample(deleteModalIndex.value);
};

const processing = ref<boolean>(false);

const onSubmit = async (peptideList: string[], sampleName: string) => {
    processing.value = true;

    const sample = sampleStore.addSample(sampleName);
    sampleStore.initializeSample(
        sample, 
        await new PeptideListConverter({
            onProgressUpdate: () => { },
        }).convert(peptideList),
        peptideList
    );

    processing.value = false;
};
</script>
