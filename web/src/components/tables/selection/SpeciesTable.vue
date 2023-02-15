<template>
    <v-data-table-virtual
        :headers="headers"
        :items="items"
        :search="search"
        :custom-filter="filterSpecies"
        height="300"
        density="compact"
        @click:row="onRowClicked"
    >
        <template #item.name="{ item }">
            <div :class="rowActive(item) ? 'active' : ''">
                {{ item.raw.name }}
            </div>
        </template>

        <template #item.rank="{ item }">
            <div :class="rowActive(item) ? 'active' : ''">
                {{ item.raw.rank }}
            </div>
        </template>
    </v-data-table-virtual>
</template>

<script setup lang="ts">
import Taxon from '@/logic/entities/Taxon';
import { ref, toRaw, watch } from 'vue';
import { SpeciesTableItem } from './SpeciesTableItem';

export interface Props {
    modelValue: Taxon[];
    search: string;
    items: SpeciesTableItem[];
    max?: number;
}

const props = withDefaults(defineProps<Props>(), {
    max: 2
});

const l = console.log

const emits = defineEmits(["update:model-value"]);

const selected = ref<Taxon[]>([]);

const onRowClicked = (e: any, i: any) => {
    if (selected.value.map((taxon: Taxon) => taxon.id).includes(i.item.raw.id)) {
        selected.value = selected.value.filter((v) => v.id !== i.item.raw.id);
    } else if (selected.value.length < props.max) {
        selected.value.push(i.item.raw);
    }

    emits("update:model-value", selected.value);
};

const rowActive = (item: any) => {
    return selected.value.map((taxon: Taxon) => taxon.id).includes(item.raw.id);
};

const filterSpecies = (value: Taxon, search: string, item: SpeciesTableItem) => {
    const speciesName = toRaw(item).name

    if (!speciesName) {
        return false;
    }
    
    return speciesName.toLowerCase().indexOf(search.toLowerCase()) !== -1;
}

const headers = [
    {
        title: "Species",
        align: "start",
        key: "name"
    },
    {
        title: "Rank",
        align: "start",
        key: "rank"
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
