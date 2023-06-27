<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="tableItems"
            item-value="raw_input"
            density="compact"
        >
            <template #item.loading="{ item }">
                <v-progress-circular v-if="item.value.loading"
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
            </template>

            <template #item.sample_name="{ item }">
                <v-text-field
                    v-model="item.value.sample_name"
                    class="mt-n5 me-2"
                    variant="underlined"
                    placeholder="Name this sample"
                    hide-details
                />
            </template>

            <template #item.remove>
                <v-icon class="me-3" color="error">mdi-delete</v-icon>
            </template>

            <template #bottom>
                <div class="d-flex justify-center pt-3">
                    <v-btn class="me-3" variant="outlined" color="primary" @click="$emit('add')">
                        <v-icon>mdi-plus</v-icon>
                        <span class="ms-1">Upload another sample</span>
                    </v-btn>
                    <v-btn variant="outlined" color="primary">
                        <v-icon>mdi-paperclip-plus</v-icon>
                        <span class="ms-1">Batch upload multiple samples</span>
                    </v-btn>
                </div>
            </template>
        </v-data-table>
    </div>
</template>

<script setup lang="ts">
import WarningAlert from '@/components/alerts/WarningAlert.vue';
import { SampleTableItem } from './SampleTableItem';
import { computed } from 'vue';
import { load } from 'webfontloader';

export interface Props {
    items: SampleTableItem[]
    max: number
}

const props = withDefaults(defineProps<Props>(), {
    max: 4
})

defineEmits(['edit', 'remove', 'add']);

const l = console.log;

const tableItems = computed(() => [ ...props.items ]
    .map((item: SampleTableItem) => ({
        count: item.size,
        sample_name: item.name,
        filename: item.name,
        loading: item.loading
    }))
);

const headers = [
    {
        title: "",
        align: "start",
        key: "loading",
        width: "50px"
    },
    {
        title: "filename",
        align: "start",
        key: "filename",
    },
    {
        title: "peptide count",
        align: "start",
        key: "count"
    },
    {
        title: "sample name",
        align: "start",
        key: "sample_name"
    },
    {
        title: "",
        align: "start",
        key: "remove",
        width: "50px"
    },
];
</script>
