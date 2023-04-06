<template>
    <v-card v-for="item, i of items"
        class="mb-2"
        elevation="2"
    >
        {{ l(item) }}
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

    <v-card height="100%" elevation="4" color="#EFEFEF" @click="$emit('add')" >
        <v-card-text class="d-flex justify-center align-center" >
            <v-icon>mdi-plus</v-icon>
            <span class="font-weight-bold">Add sample</span>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { SampleTableItem } from './SampleTableItem';

export interface Props {
    items: SampleTableItem[];
}

defineProps<Props>();

const emits = defineEmits(['edit', 'remove', 'add'])

const l = console.log;
</script>
