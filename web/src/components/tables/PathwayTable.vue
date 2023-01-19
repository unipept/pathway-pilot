<template>
    <v-data-table-virtual
        :headers="headers"
        :items="items"
        :search="search"
        height="300"
        item-value="pathway"
        density="compact"
        @click:row="onRowClicked"
    >
        <template #item.pathway="{ item }">
            <div :class="rowActive(item) ? 'active' : ''">
                {{ item.value.id }}
            </div>
        </template>

        <template #item.count="{ item }">
            <div :class="rowActive(item) ? 'active' : ''">
                {{ item.props.title.count }}
            </div>
        </template>
    </v-data-table-virtual>
</template>

<script setup lang="ts">
import PathwayEntry from '@/logic/entities/PathwayEntry';
import { ref, watch } from 'vue';
import { PathwayTableItem } from './PathwayTableItem';

export interface Props {
    modelValue: PathwayEntry | undefined;
    search: string;
    items: PathwayTableItem[];
}

const props = defineProps<Props>();

const emits = defineEmits(["update:model-value"]);

const selected = ref<PathwayEntry | undefined>(undefined);

const onRowClicked = (e: any, i: any) => {
    selected.value = i.item.value.id === selected.value?.id ? undefined : i.item.value;
    emits("update:model-value", selected.value);
};

const rowActive = (item: any) => {
    return item.value.id === selected.value?.id;
};

const headers = [
    {
        title: "Pathway",
        align: "start",
        key: "pathway"
    },
    {
        title: "Count",
        align: "start",
        key: "count"
    }
];

watch(() => props.modelValue, (value) => {
    selected.value = value;
});
</script>

<style scoped>
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
