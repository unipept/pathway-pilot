<template>
    <v-card flat>
        <v-card-title>
            Upload a list of PS files
        </v-card-title>
        <v-card-text>
            <p class="subtitle">
                Provide a list of tryptic peptides by either pasting your sequences on the right or selecting a single <span>.txt</span> 
                file. Each line of input will be interpreted as a single sequence and can't contain any special characters. Have a look 
                at the example below to get a feel about the input format.
            </p>

            <p class="subtitle mt-3">
                Two processing steps will happen whenever you upload your data:
                <ol class="ms-5">
                    <li class="ms-5">
                        Each input line will be analyzed with <resource-link url="https://unipept.ugent.be/">Unipept</resource-link>. 
                        this results is list of functional annotations and taxa per sequence.  <b>Note: Unipept works with peptides of 
                        length 5 - 50. Shorter and longer peptides will be ignored</b>.
                    </li>
                    <li class="ms-5">
                        Each functional annotation gets mapped onto zero or more <resource-link url="https://www.genome.jp/kegg/pathway.html">Kegg pathways</resource-link>.
                    </li>
                </ol>
            </p>

            <upload-form
                label="Paste your peptide shaker results here"
                :example="example"
                :loading="loading"
                @submit="onSubmit"
            />
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import UploadForm from '../UploadForm.vue';
import ResourceLink from '@/components/misc/ResourceLink.vue';

import example from '../../examples/peptide/PeptideShakerExample';

export interface Props {
    loading?: boolean;
}

withDefaults(defineProps<Props>(), {
    loading: false,
});

const emits = defineEmits(["submit"]);

const onSubmit = async (peptideList: string[], sampleName: string) => {
    emits("submit", peptideList, sampleName);
};
</script>
