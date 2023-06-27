<template>
    <v-card v-for="group in items" class="mb-3">
        <v-card-text>
            <v-card
                class="mb-2"
                width="300"
                variant="outlined"
                color="primary"
                flat
            >
                <v-card-text class="d-flex pa-2 align-center">
                    <v-text-field
                        v-model="group.name"
                        class="mt-n5 me-2"
                        variant="underlined"
                        hide-details
                    />

                    <tooltip message="Remove this group and samples">
                        <v-icon color="error" @click="">mdi-delete</v-icon>
                    </tooltip>
                </v-card-text>
            </v-card>

            <sample-table 
                class="ms-10"
                :items="group.items"
                :max="max"
                @add="() => onAddSample(group.name)"
            />
        </v-card-text>
    </v-card>

    <v-btn class="me-3" variant="outlined" color="primary">
        <v-icon>mdi-plus</v-icon>
        <span class="ms-1">Add another group</span>
    </v-btn>
</template>

<script setup lang="ts">
import Tooltip from '@/components/misc/Tooltip.vue';
import { GroupTableItem } from './GroupTableItem';
import SampleTable from './SampleTable.vue';

export interface Props {
    items: GroupTableItem[]
    max: number
}

withDefaults(defineProps<Props>(), {
    max: 4
});

const emits = defineEmits(['add:group', 'add:sample']);

const onAddSample = (group: string) => {
    emits('add:sample', group);
}
</script>
