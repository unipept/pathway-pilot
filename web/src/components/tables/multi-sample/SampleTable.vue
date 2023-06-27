<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="tableItems"
            item-value="raw_input"
            density="compact"
        >
            <template #no-data>
                <tr>
                    <td colspan="5">
                        <b class="d-flex justify-center">Use the options below to start uploading samples</b>
                    </td>
                </tr>
            </template>

            <template #item="{ index, item }">
                <sample-table-row 
                    :loading="item.value.loading"
                    :upload-name="item.value.upload_name"
                    :name="item.value.sample_name"
                    :size="item.value.count"
                    :index="index"
                    @remove="onRemoveSample"
                    @update="onUpdateSampleName"
                />
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
import { SampleTableItem } from './SampleTableItem';
import { computed } from 'vue';
import SampleTableRow from './SampleTableRow.vue';

export interface Props {
    items: SampleTableItem[]
    max: number
}

const props = withDefaults(defineProps<Props>(), {
    max: 4
})

const emits = defineEmits([ 'remove', 'add', 'update:sample' ]);

const tableItems = computed(() => [ ...props.items ]
    .map((item: SampleTableItem) => ({
        upload_name: item.uploadName,
        sample_name: item.name,
        count: item.size,
        loading: item.loading
    }))
);

const onRemoveSample = (sampleIndex: number) => {
    emits('remove', sampleIndex);
}

const onUpdateSampleName = (sampleIndex: number, name: string) => {
    emits('update:sample', sampleIndex, name);
}

const headers = [
    {
        title: "status",
        align: "center",
        key: "loading",
        width: "50px"
    },
    {
        title: "filename",
        align: "start",
        key: "upload_name",
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
