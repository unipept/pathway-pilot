<template>
    <div class="mt-5">
        <v-card>
            <v-tabs
                v-model="currentTab"
                bg-color="secondary"
                centered
            >
                <v-tab value=0>Peptides</v-tab>
            </v-tabs>

            <v-window v-model="currentTab">
                <v-window-item value=0>
                    <peptide-list-form :loading="processing" @submit="onSubmit" @reset="onReset" />
                </v-window-item>
            </v-window>
        </v-card>

        <error-modal v-model="errors" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import PeptideListForm from '@/components/forms/PeptideListForm.vue';
import useSingleSampleStore from '@/stores/SingleSampleStore';
import VerifierError from '@/logic/verifiers/VerifierError';
import PeptideListVerifier from '@/logic/verifiers/PeptideListVerifier';
import PeptideListConverter from '@/logic/converters/PeptideListConverter';
import ErrorModal from '@/components/modals/ErrorModal.vue';
import UnipeptCommunicator from '@/logic/communicators/UnipeptCommunicator';

defineEmits(['submit']);

const sampleStore = useSingleSampleStore('single-sample');

const currentTab = ref<number>(0);
const processing = ref<boolean>(false);

const errors = ref<VerifierError[]>([]);

const onSubmit = async (peptideList: string[]) => {
    processing.value = true;

    errors.value = new PeptideListVerifier().verify(peptideList);

    if (errors.value.length <= 0) {
        sampleStore.initialize(await new PeptideListConverter({
            onProgressUpdate: () => { },
        }).convert(peptideList));

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
