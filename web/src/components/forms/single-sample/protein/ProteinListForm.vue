<template>
    <v-card flat>
        <v-card-text class="information">
            <h4 class="mb-3">Upload your list of proteins</h4>

            <p class="subtitle">
                Please input a list of proteins by either pasting the <resource-link url="https://www.uniprot.org/">UniProt</resource-link> accession 
                identifiers on the right-hand side or selecting a single <span>.txt</span> file. Each line of input will be treated as an individual 
                UniProt accession id, and it should only contain valid accession numbers. Please refer to the example below for guidance on the expected input format.
            </p>

            <p class="subtitle mt-3">
                After uploading your data, it will undergo two seperate processing steps as follows:

                <ol class="ms-5">
                    <li class="ms-5 mt-1">
                        <b>Analysis by the Unipept protinfo endpoint:</b> Each line or protein in 
                        the dataset will be analysed using the <resource-link url="https://unipept.ugent.be/apidocs/protinfo">Unipept protinfo</resource-link> endpoint. 
                        This analysis will result in a list of functional annotations and assign a taxon to each UniProt accession id.
                    </li>
                    <li class="ms-5 mt-1">
                        <b>Mapping of functional annotations to Kegg pathways:</b> Each functional annotation obtained from the previous step will be further mapped onto one 
                        or more <resource-link url="https://www.genome.jp/kegg/pathway.html">Kegg pathways</resource-link>. This step helps to establish associations between 
                        the functional properties of protein and the relevant pathways in the Kegg database.
                    </li>
                </ol>
            </p>

            <upload-form
                label="Paste your protein list here"
                :loading="loading"
                :example="example"
                @submit="$emit('submit', $event)"
                @reset="$emit('reset', $event)"
            />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import UploadForm from '../UploadForm.vue';
import ResourceLink from '@/components/misc/ResourceLink.vue';

import example from '../../examples/protein/ProteinListExample';

export interface Props {
    loading?: boolean;
}

withDefaults(defineProps<Props>(), {
    loading: false,
});

defineEmits(["submit", "reset"]);
</script>

<style scoped>
.information {
    padding: 0;
    font-size: 16px;
}
</style>
