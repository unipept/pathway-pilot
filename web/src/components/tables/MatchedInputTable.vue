<template>
    <v-data-table v-if="hasItems"
        :headers="headers"
        :items="items"
        item-value="raw_input"
        density="compact"
    >
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

    <v-card v-else elevation="3">
        <v-card-text>
            <div class="error-container text-warning">
                <v-icon class="me-2 mb-1" size="30">mdi-alert-outline</v-icon>
                We were not able to match any input to the selected node.
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { MatchedInputTableItem } from './MatchedInputTableItem';
import HighlightChip from '../chips/HighlightChip.vue';
import { computed } from 'vue';

export interface Props {
    items: MatchedInputTableItem[];
}

const props = defineProps<Props>();

const hasItems = computed(() => props.items.length > 0);

const l = console.log;

const headers = [
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
.error-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: bold;
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
