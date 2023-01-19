<template>
    <v-data-table-virtual
        :headers="headers"
        :items="items"
        :search="search"
        height="300"
        item-value="species"
        density="compact"
        @click:row="onRowClicked"
    >
        <template #item.species="{ item }">
            <div :class="rowActive(item) ? 'active' : ''">
                {{ item.value }}
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
import { ref } from 'vue';
import { SpeciesTableItem } from './SpeciesTableItem';

export interface Props {
    modelValue: any[];
    search: string;
    items: SpeciesTableItem[];
}

defineProps<Props>();

const emits = defineEmits(["update:model-value"]);

const selected = ref<any[]>([]);

const onRowClicked = (e: any, i: any) => {
    if (selected.value.includes(i.item.value)) {
        selected.value = selected.value.filter((v) => v !== i.item.value);
    } else {
        selected.value.push(i.item.value);
    }

    emits("update:model-value", selected.value);
};

const rowActive = (item: any) => {
    return selected.value.includes(item.value);
};

const headers = [
    {
        title: "Species",
        align: "start",
        key: "species"
    },
    {
        title: "Count",
        align: "start",
        key: "count"
    }
];
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
