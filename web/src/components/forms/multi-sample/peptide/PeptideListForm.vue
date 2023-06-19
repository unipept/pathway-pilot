<template>
    <v-card flat>
        <v-card-title>
            Upload your list of peptides
        </v-card-title>
        <v-card-text>
            <p class="subtitle">
                Please input a list of tryptic peptides by either pasting the peptide sequences on the right-hand side or selecting a single 
                <span>.txt</span> file. Each line of input will be treated as an individual peptide sequence, and it should only contain valid 
                amino acids and must not include any special characters. Please refer to the example below for guidance on the expected input format.
            </p>

            <p class="subtitle mt-3">
                After uploading your data, it will undergo two seperate processing steps as follows:

                <ol class="ms-5">
                    <li class="ms-5 mt-1">
                        <b>Analysis by the Unipept peptinfo endpoint:</b> Each line or peptide in 
                        the dataset will be analysed using the <resource-link url="https://unipept.ugent.be/apidocs/peptinfo">Unipept peptinfo</resource-link> endpoint. 
                        This analysis will result in a list of functional annotations and assign a taxon (LCA) to each peptide sequence. It is important to note that 
                        <resource-link url="https://unipept.ugent.be/">Unipept</resource-link> is designed to process peptides with a length ranging from 5 to 50 amino acids. 
                        Peptides that are shorter or longer  will be disregarded during the analysis.
                    </li>
                    <li class="ms-5 mt-1">
                        <b>Mapping of functional annotations to Kegg pathways:</b> Each functional annotation obtained from the previous step will be further mapped onto one 
                        or more <resource-link url="https://www.genome.jp/kegg/pathway.html">Kegg pathways</resource-link>. This step helps to establish associations between 
                        the functional properties of peptides and the relevant pathways in the Kegg database.
                    </li>
                </ol>
            </p>

            <upload-form
                label="Paste your peptide list here"
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

import example from '../../examples/peptide/PeptideListExample';

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
