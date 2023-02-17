<template>
    <v-data-table
        :headers="headers"
        :items="items"
        item-value="raw_input"
        density="compact"
    >
        <template #item.raw_input="{ item }">
            <div class="px-4">
                {{ item.raw.raw_input }}
            </div>
        </template>

        <template #item.taxon_id="{ item }">
            <div class="px-4">
                {{ item.raw.taxon_id }}
            </div>
        </template>

        <template #item.taxon_name="{ item }">
            <div class="px-4">
                {{ item.raw.taxon_name }}
            </div>
        </template>

        <template #item.taxon_rank="{ item }">
            <div class="px-4">
                {{ item.raw.taxon_rank }}
            </div>
        </template>

        <template #item.node_annotations="{ item }">
            <div class="d_flex px-4 pt-1">
                <highlight-chip v-for="(annotation, i) of item.raw.node_annotations"
                    :key="i"
                    :class="{ 'me-1': i < item.raw.node_annotations.length - 1 }"
                    class="mb-1"
                    :name="annotation"
                    :highlight="highlight(annotation, item.raw.matched_annotations)"
                />
            </div>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { MatchedInputTableItem } from './MatchedInputTableItem';
import HighlightChip from '../chips/HighlightChip.vue';

export interface Props {
    items: MatchedInputTableItem[];
}

defineProps<Props>();

const l = console.log;

const headers = [
    {
        title: "Peptide",
        align: "start",
        key: "raw_input"
    },
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

const highlight = (annotation: string, matchedAnnotations: string[] | undefined) => {
    if (!matchedAnnotations) {
        return false;
    }

    return matchedAnnotations?.includes(annotation) ?? false;
}
</script>

<style scoped>
.highlight {
    font-weight: 600;
}




:deep(td) {
    padding: 0px !important;
}

:deep(td) > :not(.active) {
    padding-left: 16px;
    padding-right: 16px;
}

:deep(td) > .active {
    background-color: #eee;
    width: inherit;
    height: inherit;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 6px;
}
</style>
