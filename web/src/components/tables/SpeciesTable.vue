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
                {{ item.value.name }}
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
import Taxon from '@/logic/entities/Taxon';
import { ref, watch } from 'vue';
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

const emits = defineEmits(["update:model-value"]);

const selected = ref<Taxon[]>([]);

const onRowClicked = (e: any, i: any) => {
    if (selected.value.map((taxon: Taxon) => taxon.id).includes(i.item.value.id)) {
        selected.value = selected.value.filter((v) => v.id !== i.item.value.id);
    } else if (selected.value.length < props.max) {
        selected.value.push(i.item.value);
    }

    emits("update:model-value", selected.value);
};

const rowActive = (item: any) => {
    return selected.value.map((taxon: Taxon) => taxon.id).includes(item.value.id);
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
