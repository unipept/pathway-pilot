<template>
    <upload-form
        label="Paste your ProteomeDiscoverer results here"
        :example="example"
        :loading="loading"
        :multi="multi"
        @submit="onSubmit"
        @reset="onReset"
    >
        <template #header>
            <h4>Upload your ProteomeDiscoverer file</h4>
        </template>

        <template #information>    
            <p class="subtitle">
                Please input a valid <resource-link url="https://www.thermofisher.com/be/en/home/industrial/mass-spectrometry/liquid-chromatography-mass-spectrometry-lc-ms/lc-ms-software/multi-omics-data-analysis/proteome-discoverer-software.html?gclid=CjwKCAjw-b-kBhB-EiwA4fvKrAQ2vZWVpURBymCxmBsAO1aOZUe-oz-73kU5FCSlSV_hm3c-K79u_RoCjwgQAvD_BwE&cid=E.23CMD.DL103.12911.01&ef_id=CjwKCAjw-b-kBhB-EiwA4fvKrAQ2vZWVpURBymCxmBsAO1aOZUe-oz-73kU5FCSlSV_hm3c-K79u_RoCjwgQAvD_BwE:G:s&s_kwcid=AL!3652!3!334040549172!p!!g!!proteome%20discoverer&gad=1">ProteomeDiscoverer</resource-link> file by either pasting the file contents 
                on the right-hand side or selecting a single <span>.tsv</span> file. The file should <b>always</b> start with a header row, and should contain 
                at least the <b>Annotated Sequence</b> column. Each line of input should contain a valid peptide sequence in the correct column. This sequence 
                should only contain valid amino acids and must not include any special characters. Please refer to the example below for guidance on the 
                expected input format.
            </p>

            <p class="subtitle mt-3">
                After uploading your data, it will undergo two seperate processing steps as follows:

                <ol class="ms-5">
                    <li class="ms-5 mt-1">
                        <b>Analysis by the Unipept peptinfo endpoint:</b> Each peptide in 
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
        </template>
    </upload-form>
</template>

<script setup lang="ts">
import UploadForm from '../UploadForm.vue';
import ResourceLink from '@/components/misc/ResourceLink.vue';

import example from '../../examples/peptide/ProteomeDiscovererExample';

export interface Props {
    loading?: false | number
    multi?: boolean
}

withDefaults(defineProps<Props>(), {
    loading: false,
    multi: false
});

const emits = defineEmits(["submit", "reset"]);

const onSubmit = (inputList: string[], sampleName: string) => {
    emits("submit", inputList, sampleName);
};

const onReset = () => {
    emits("reset");
};
</script>
