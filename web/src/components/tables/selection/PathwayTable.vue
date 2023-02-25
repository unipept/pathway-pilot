<template>
    <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :filter-keys="['id', 'name']"
        :sort-by="[{ key: 'count', order: 'desc' }]"
        :must-sort=true
        items-per-page="5"
        item-value="pathway"
        density="compact"
        @click:row="onRowClicked"
    >
        <template #item.id="{ item }">
            <div :class="rowActive(item) ? 'active' : ''">
                {{ item.raw.id }}
            </div>
        </template>

        <template #item.name="{ item }">
            <div :class="rowActive(item) ? 'active' : ''">
                {{ item.raw.name }}
            </div>
        </template>

        <template #item.count="{ item }">
            <div :class="rowActive(item) ? 'active' : ''">
                {{ item.raw.count }}
            </div>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import Pathway from '@/logic/entities/Pathway';
import { ref, watch, toRaw } from 'vue';
import { PathwayTableItem } from '../selection/PathwayTableItem';

export interface Props {
    modelValue: Pathway | undefined;
    search: string;
    items: PathwayTableItem[];
}

const props = defineProps<Props>();

const emits = defineEmits(["update:model-value"]);

const selected = ref<Pathway | undefined>(undefined);

const onRowClicked = (e: any, i: any) => {
    selected.value = i.item.raw.id === selected.value?.id ? undefined : i.item.raw;
    emits("update:model-value", selected.value);
};

const rowActive = (item: any) => {
    return item.raw.id === selected.value?.id;
};

const headers = [
    {
        title: "Pathway",
        align: "start",
        key: "id"
    },
    {
        title: "Name",
        align: "start",
        key: "name"
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
