<template>
    <tr>
        <td>
            <v-progress-circular v-if="loading"
                class="me-2"
                indeterminate
                color="primary"
                size="30"
                width="3"
            />

            <v-icon v-else
                class="me-2" 
                color="green"
                size="30"
            >
                mdi-check-circle-outline
            </v-icon>
        </td>

        <td>{{ uploadName }}</td>

        <td>{{ size }}</td>

        <td>
            <v-text-field
                v-model="sampleName"
                class="mt-n5 me-2"
                variant="underlined"
                placeholder="Name this sample"
                hide-details
            />
        </td>

        <td>
            <v-icon class="me-3" color="error" @click="() => onRemoveRow(index)">mdi-delete</v-icon>
        </td>
    </tr>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

export interface Props {
    loading: boolean
    uploadName: string
    name: string
    size: string
    index: number
}

const props = defineProps<Props>();

const emits = defineEmits([ 'remove', 'update' ]);

const sampleName = ref<string>(props.name);

const onRemoveRow = (rowIndex: number) => {
    emits('remove', rowIndex);
}

watch(sampleName, (newName) => {
    emits('update', props.index, newName);
});
</script>
