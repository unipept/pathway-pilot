<template>
    <tr>
        <td>
            <progress-loader v-if="isLoading"
                class="me-2"
                :loading="loading"
                :size="30"
                :width="3"
                color="primary"
                :label="false"
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
                class="pb-1 mt-n2 me-2"
                variant="underlined"
                density="compact"
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
import { computed, ref, watch } from 'vue';
import ProgressLoader from '@/components/misc/ProgressLoader.vue';

export interface Props {
    loading: number | false
    uploadName: string
    name: string
    size: string
    index: number
}

const props = defineProps<Props>();

const emits = defineEmits([ 'remove', 'update' ]);

const sampleName = ref<string>(props.name);

const isLoading = computed(() => {
    return props.loading !== false;
});

const onRemoveRow = (rowIndex: number) => {
    emits('remove', rowIndex);
}

watch(sampleName, (newName) => {
    emits('update', props.index, newName);
});

watch(() => props.name, (newName) => {
    sampleName.value = newName;
});
</script>
