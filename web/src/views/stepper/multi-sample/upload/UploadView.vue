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

import Control_HM607 from '@/assets/examples/control/HM607';
import Control_HM625 from '@/assets/examples/control/HM625';
import Control_HM647 from '@/assets/examples/control/HM647';
import UC_Severe_HM580 from '@/assets/examples/uc-severe/HM580';
import UC_Severe_HM617 from '@/assets/examples/uc-severe/HM617';

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
        size: `${sample.size} peptides`,
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
        content: (await readTextFile(file)).split("\n").filter((peptide) => peptide.length > 0)
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
    sampleStore.reset();

    const group1 = sampleStore.addGroup();
    onUpdateGroupName(group1, "Control");

    const group2 = sampleStore.addGroup();
    onUpdateGroupName(group2, "UC Severe");

    onAddSamples(group1, [ Control_HM607, Control_HM625, Control_HM647 ])
        .then(() => {
            onUpdateSampleName(group1, 0, "HM607");
            onUpdateSampleName(group1, 1, "HM625");
            onUpdateSampleName(group1, 2, "HM647");
        });

    onAddSamples(group2, [ UC_Severe_HM580, UC_Severe_HM617 ])
        .then(() => {
            onUpdateSampleName(group2, 0, "HM580");
            onUpdateSampleName(group2, 1, "HM617");
        });
}

watch(groups, () => {
    visualisationStore.setHighlightedItems(groups.value
        .map((group, i) => group.empty ? -1 : i)
        .filter(i => i >= 0)
    );
});
</script>
