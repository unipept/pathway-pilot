<template>
    <warning-alert
        v-if="items.length <= 0"
        class="mb-4"
    >
        You have not uploaded a single sample. You can click the button below to start uploading your first sample.
    </warning-alert>

    <v-card v-for="item, i of items"
        class="mb-2"
        elevation="2"
    >
        <v-card-text class="d-flex pa-2">
            <v-progress-circular v-if="item.loading"
                class="me-2"
                indeterminate
                color="primary"
                size="20"
                width="3"
            />
            <v-icon v-else
                class="me-2" 
                color="green"
            >
                mdi-check-circle-outline
            </v-icon>

            <div class="flex-grow-1">{{ item.name }}</div>
            <div v-if="!item.loading" class="flex-grow-1">{{ item.size }}</div>

            <v-icon class="me-3" color="error" @click="$emit('remove', i, item.name)">mdi-delete</v-icon>
        </v-card-text>
    </v-card>

    <v-card 
        height="100%" 
        elevation="4" 
        color="#EFEFEF"
        :disabled="items.length >= max"
        @click="$emit('add')"
    >
        <v-card-text class="d-flex justify-center align-center" >
            <v-icon v-if="items.length < max" class="me-2">mdi-upload</v-icon>
            <span v-if="items.length === 0" class="font-weight-bold">Upload your first sample</span>
            <span v-else-if="items.length === 1" class="font-weight-bold">Upload your second sample to compare</span>
            <span v-else-if="items.length < max" class="font-weight-bold">Upload an additional sample to compare</span>
            <span v-else class="font-weight-bold">You can only compare a maximum of 4 samples at a time</span>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import WarningAlert from '@/components/alerts/WarningAlert.vue';
import { SampleTableItem } from './SampleTableItem';

export interface Props {
    items: SampleTableItem[]
    max: number
}

withDefaults(defineProps<Props>(), {
    max: 4
})

defineEmits(['edit', 'remove', 'add'])
</script>
