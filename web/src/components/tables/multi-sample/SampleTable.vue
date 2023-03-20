<template>
    <v-card v-for="item, i of items"
        class="mb-2"
        elevation="2" 
        color=""
    >
        <v-card-text class="d-flex pa-2">
            <!-- TODO: loading icon -->
            <v-icon v-if="true" 
                class="me-2" 
                color="green"
            >
                mdi-check-circle-outline
            </v-icon>
            <v-icon v-else 
                class="me-2" 
                color="error"
            >
                mdi-close-circle-outline
            </v-icon>

            <div class="flex-grow-1">{{ item.name }}</div>
            <div class="flex-grow-1">{{ item.size }}</div>

            <v-icon class="me-3" color="error" @click="$emit('remove', i)">mdi-delete</v-icon>
            <v-icon @click="$emit('edit', i)">mdi-pencil</v-icon>
        </v-card-text>
    </v-card>

    <v-card height="100%" elevation="4" color="#EFEFEF" >
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

const props = defineProps<Props>();

const emits = defineEmits(['edit', 'remove', 'add'])

const onRemove = (index: number) => {
    emits('remove', index);
}

const onEdit = (index: number) => {
    emits('edit', index);
}

const onAdd = () => {
    emits('add');
}
</script>
