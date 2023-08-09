<template>
    <v-data-table v-if="hasItems"
        :headers="headers"
        :items="items"
        :sort-by="pageOptions.sortBy"
        :must-sort=true
        :page="page"
        items-per-page="5"
        item-value="raw_input"
        density="compact"
        @update:options="pageOptions = $event"
        @update:page=""
    >
        <template #item="{ index, item }">
            <matched-input-table-row
                :group="item.value.group"
                :taxon="new Taxon(item.value.taxon_id, item.value.taxon_name, item.value.taxon_rank)"
                :node-annotations="item.value.node_annotations"
                :matched-annotations="item.value.matched_annotations"
            />
        </template>

        <template #no-data>
            <tr>
                <td colspan="5">
                    <b class="d-flex justify-center">No matches found in this node</b>
                </td>
            </tr>
        </template>

        <template #bottom>
            <div style="position: relative;">
                <v-pagination
                    v-model="page"
                    :length="pageOptions.pageCount"
                    :total-visible="7"
                    density="comfortable"
                ></v-pagination>
                <div style="position: absolute; right: 0; top: 5px;">
                    <slot name="download"></slot>
                </div>
            </div>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { MatchedInputTableItem } from './MatchedInputTableItem';
import { computed, ref } from 'vue';
import MatchedInputTableRow from './MatchedInputTableRow.vue';
import Taxon from '@/logic/entities/Taxon';

export interface Props {
    items: MatchedInputTableItem[];
}

const props = defineProps<Props>();

const page = ref(1);
const pageOptions = ref({
    pageCount: 1,
    sortBy: [{ key: 'taxon_id', order: 'asc' }]
});

const hasItems = computed(() => props.items.length > 0);

const headers = [
    ...(props.items.some(i => i.group) ? [{
        title: "Sample group",
        align: "start",
        key: "group",
    }] : []),
    {
        title: "Taxon id",
        align: "start",
        key: "taxon_id",
    },
    {
        title: "Taxon name",
        align: "start",
        key: "taxon_name"
    },
    {
        title: "Taxon rank",
        align: "start",
        key: "taxon_rank"
    },
    {
        title: "Anntotations",
        align: "start",
        key: "node_annotations",
    }
];
</script>
