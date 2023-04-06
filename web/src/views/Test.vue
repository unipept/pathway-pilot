<template>
    <div class="mt-5">
        <v-card elevation="10">
            <v-card-text>
                <v-select
                    v-model="inputFormat"
                    label="Select your input format"
                    density="comfortable"
                    :items="inputFormats"
                />

                <h1 class="mb-3">Add your samples</h1>
                <sample-table 
                    :items="tableItems"
                    @add="addModalOpen = true"
                    @remove="onRemove"
                />
            </v-card-text>
        </v-card>

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

<script lang="ts" setup>
import AddSampleModal from '@/components/modals/multi-sample/AddSampleModal.vue';
import DeleteSampleModal from '@/components/modals/multi-sample/DeleteSampleModal.vue';
import SampleTable from '@/components/tables/multi-sample/SampleTable.vue';
import PeptideListConverter from '@/logic/converters/PeptideListConverter';
import useMultiSampleStore from '@/stores/MultiSampleStore';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';

const sampleStore = useMultiSampleStore();

const { samples } = storeToRefs(sampleStore);

const tableItems = computed(() => 
    samples.value.map(sample => ({
        name: sample.name,
        size: `${sample.size} peptides`,
        loading: !sample.initialized,
    }))
)

const inputFormats = ["Peptide list", "MaxQuant", "ProteomeDiscoverer", "PepShaker"]

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

    // TODO: insert some mock data
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
