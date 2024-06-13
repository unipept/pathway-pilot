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
            @add:samples="onAddSamples"
            @add:group="onAddGroup"
            @remove:sample="onRemoveSample"
            @remove:group="onRemoveGroup"
            @update:group:name="onUpdateGroupName"
            @update:sample:name="onUpdateSampleName"
            @load:demo="onLoadDemo"
        />

        <v-dialog v-model="addModalOpen" max-width="75%">
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
import FileFormat from '../../FileFormat';
import useGroupSampleStore from '@/stores/sample/GroupSampleStore';
import VerifierError from '@/logic/verifiers/VerifierError';
import ErrorModal from '@/components/modals/ErrorModal.vue';
import { useFileReader } from '@/composables/useFileReader';
import useVisualisationStore from '@/stores/VisualisationStore';
import { watch } from 'vue';

import PeptideListForm from '@/components/forms/multi-sample/PeptideListForm.vue';
import ProteinListForm from '@/components/forms/multi-sample/ProteinListForm.vue';

import PeptideListVerifier from '@/logic/verifiers/PeptideListVerifier';
import ProteinListVerifier from '@/logic/verifiers/ProteinListVerifier';

import PeptideListConverter from '@/logic/converters/PeptideListConverter';
import ProteinListConverter from '@/logic/converters/ProteinListConverter';

import AL_3W_1 from '@/assets/examples/peptides/al/AL_3W_1';
import AL_3W_2 from '@/assets/examples/peptides/al/AL_3W_2';
import AL_3W_3 from '@/assets/examples/peptides/al/AL_3W_3';
// import AL_5W_1 from '@/assets/examples/peptides/al/AL_5W_1';
// import AL_5W_2 from '@/assets/examples/peptides/al/AL_5W_2';
// import AL_5W_3 from '@/assets/examples/peptides/al/AL_5W_3';
// import AL_8W_1 from '@/assets/examples/peptides/al/AL_8W_1';
// import AL_8W_2 from '@/assets/examples/peptides/al/AL_8W_2';
// import AL_8W_3 from '@/assets/examples/peptides/al/AL_8W_3';
import CR_3W_1 from '@/assets/examples/peptides/cr/CR_3W_1';
import CR_3W_2 from '@/assets/examples/peptides/cr/CR_3W_2';
import CR_3W_3 from '@/assets/examples/peptides/cr/CR_3W_3';
// import CR_5W_1 from '@/assets/examples/peptides/cr/CR_5W_1';
// import CR_5W_2 from '@/assets/examples/peptides/cr/CR_5W_2';
// import CR_5W_3 from '@/assets/examples/peptides/cr/CR_5W_3';
// import CR_8W_1 from '@/assets/examples/peptides/cr/CR_8W_1';
// import CR_8W_2 from '@/assets/examples/peptides/cr/CR_8W_2';
// import CR_8W_3 from '@/assets/examples/peptides/cr/CR_8W_3';

import P02_P02_T0 from '@/assets/examples/proteins/P02/P02_T0';
import P02_P02_T1 from '@/assets/examples/proteins/P02/P02_T1';
import P02_P02_T2 from '@/assets/examples/proteins/P02/P02_T2';
import P01_P01_T0 from '@/assets/examples/proteins/P01/P01_T0';
import P01_P01_T1 from '@/assets/examples/proteins/P01/P01_T1';
import P01_P01_T2 from '@/assets/examples/proteins/P01/P01_T2';

export interface Props {
    fileFormat: FileFormat;
}

const props = defineProps<Props>();

const sampleStore = useGroupSampleStore();
const visualisationStore = useVisualisationStore();

const { readTextFile } = useFileReader();

const { groups } = storeToRefs(sampleStore);

const tableItems = computed(() => groups.value.map(group => ({
    name: group.name,
    items: group.samples.map((sample: any) => ({
        uploadName: sample.uploadName,
        name: sample.name,
        size: `${sample.size} ${props.fileFormat === FileFormat.PEPTIDE_LIST ? "peptides" : "proteins"}`,
        loading: sample.processing
    }))
})));

const addModalOpen = ref<boolean>(false);
const addModalGroup = ref<number>(-1);

const deleteModalOpen = ref<boolean>(false);
const deleteModalGroupIndex = ref<number>(-1);
const deleteModalSampleIndex = ref<number>(-1);
const deleteModalSampleName = ref<string>("");

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

const onSubmit = (inputList: string[], sampleName: string) => {
    errors.value = formatMap.get(props.fileFormat)?.verifier.verify(inputList);

    if (errors.value.length <= 0) {
        addModalOpen.value = false;

        const [ group, sample ] = sampleStore.addSample(addModalGroup.value, sampleName);
        sampleStore.initializeSample(group, sample, inputList, formatMap.get(props.fileFormat)?.converter);
    }
};

const onAddSample = (groupIndex: number) => {
    addModalGroup.value = groupIndex;
    addModalOpen.value = true;
};

const onAddSamples = async (groupIndex: number, files: File[]) => {
    const samples = await Promise.all(files.map(async (file) => ({
        name: file.name,
        content: (await readTextFile(file)).split(new RegExp("\r?\n")).filter((peptide) => peptide.length > 0)
    })));

    errors.value = samples.map(s => formatMap.get(props.fileFormat)?.verifier.verify(s.content)).flat();

    if (errors.value.length <= 0) {
        samples.forEach(s => {
            const [ group, sample ] = sampleStore.addSample(groupIndex, s.name);
            sampleStore.initializeSample(group, sample, s.content, formatMap.get(props.fileFormat)?.converter);
        });
    }
};

const onAddGroup = () => {
    sampleStore.addGroup();
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

const onLoadDemo = async () => {
    if (props.fileFormat === FileFormat.PEPTIDE_LIST) {
        await loadPeptideDemo();
    } else if (props.fileFormat === FileFormat.PROTEIN_LIST) {
        await loadProteinDemo();
    }
};

const loadPeptideDemo = async () => {
    sampleStore.reset();

    const group1 = sampleStore.addGroup();
    onUpdateGroupName(group1, "Ad Libitum");

    const group2 = sampleStore.addGroup();
    onUpdateGroupName(group2, "Caloric Restriction");

    onAddSamples(group1, [ AL_3W_1, AL_3W_2, AL_3W_3/*, AL_5W_1, AL_5W_2, AL_5W_3, AL_8W_1, AL_8W_2, AL_8W_3*/ ])
        .then(() => {
            onUpdateSampleName(group1, 0, "AL_3W_1");
            onUpdateSampleName(group1, 1, "AL_3W_2");
            onUpdateSampleName(group1, 2, "AL_3W_3");
            // onUpdateSampleName(group1, 3, "AL_5W_1");
            // onUpdateSampleName(group1, 4, "AL_5W_2");
            // onUpdateSampleName(group1, 5, "AL_5W_3");
            // onUpdateSampleName(group1, 6, "AL_8W_1");
            // onUpdateSampleName(group1, 7, "AL_8W_2");
            // onUpdateSampleName(group1, 8, "AL_8W_3");
        });

    onAddSamples(group2, [ CR_3W_1, CR_3W_2, CR_3W_3/*, CR_5W_1, CR_5W_2, CR_5W_3, CR_8W_1, CR_8W_2, CR_8W_3*/ ])
        .then(() => {
            onUpdateSampleName(group2, 0, "CR_3W_1");
            onUpdateSampleName(group2, 1, "CR_3W_2");
            onUpdateSampleName(group2, 2, "CR_3W_3");
            // onUpdateSampleName(group2, 3, "CR_5W_1");
            // onUpdateSampleName(group2, 4, "CR_5W_2");
            // onUpdateSampleName(group2, 5, "CR_5W_3");
            // onUpdateSampleName(group2, 6, "CR_8W_1");
            // onUpdateSampleName(group2, 7, "CR_8W_2");
            // onUpdateSampleName(group2, 8, "CR_8W_3");
        });
}

const loadProteinDemo = async () => {
    sampleStore.reset();

    const group1 = sampleStore.addGroup();
    onUpdateGroupName(group1, "P01");

    const group2 = sampleStore.addGroup();
    onUpdateGroupName(group2, "P02");

    onAddSamples(group1, [ P01_P01_T0, P01_P01_T1, P01_P01_T2 ])
        .then(() => {
            onUpdateSampleName(group1, 0, "P02_T0");
            onUpdateSampleName(group1, 1, "P02_T1");
            onUpdateSampleName(group1, 2, "P02_T2");
        });

    onAddSamples(group2, [ P02_P02_T0, P02_P02_T1, P02_P02_T2 ])
        .then(() => {
            onUpdateSampleName(group2, 0, "P02_T0");
            onUpdateSampleName(group2, 1, "P02_T1");
            onUpdateSampleName(group2, 2, "P02_T2");
        });
}

watch(groups, () => {
    visualisationStore.setHighlightedItems(groups.value
        .map((group, i) => group.empty ? -1 : i)
        .filter(i => i >= 0)
    );
});
</script>
