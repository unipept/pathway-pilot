<template>
    <h4>Select your input format</h4>

    <div class="mt-3">
        Please select the appropriate input format for your data from the options provided in the dropdown menu. We now support both peptide and protein inputs. 
        You can either provide a raw list of peptides or proteins.

        <v-row class="mt-3">
            <v-col cols="6">
                <v-radio-group 
                    v-model="inputFormat" 
                    color="primary"
                    @update:model-value="e => $emit('update:model-value', e)"
                >
                    <multiline-radio-button v-for="format in peptideInputFormats"
                        :key="format"
                        :label="format" 
                        :value="format"
                        :subtitle="shortDescriptions.get(format)!"
                    />
                </v-radio-group>
            </v-col>

            <v-col cols="6">
                <v-radio-group 
                    v-model="inputFormat" 
                    color="primary"
                    @update:model-value="e => $emit('update:model-value', e)"
                >
                    <multiline-radio-button v-for="format in proteinInputFormats"
                        :key="format"
                        :label="format" 
                        :value="format"
                        :subtitle="shortDescriptions.get(format)!"
                    />
                </v-radio-group>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import FileFormat from './FileFormat';
import MultilineRadioButton from '@/components/inputs/MultilineRadioButton.vue';

export interface Props {
    modelValue: FileFormat;
}

const props = defineProps<Props>();

defineEmits(['update:model-value']);

const inputFormat = ref<FileFormat>(props.modelValue);

const peptideInputFormats = [
    FileFormat.PEPTIDE_LIST
];

const proteinInputFormats = [
    FileFormat.PROTEIN_LIST,
];

const shortDescriptions = new Map<FileFormat, string>([
    [FileFormat.PEPTIDE_LIST, 'A list of peptides, a single sequence per line'],
    [FileFormat.PROTEIN_LIST, 'A list of proteins, a single UniProt id per line']
]); 

watch(() => props.modelValue, (newVal: FileFormat) => {
    inputFormat.value = newVal;
});
</script>
