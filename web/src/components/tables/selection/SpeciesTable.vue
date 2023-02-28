<template>
    <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :page="page"
        :filter-keys="['name', 'rank']"
        items-per-page="5"
        density="compact"
        @click:row="onRowClicked"
        @update:options="pageOptions = $event"
    >
        <template #item.checkbox="{ item }">
            <div v-if="rowActive(item)" class="active">
                <v-icon>mdi-checkbox-outline</v-icon>
            </div>
            <div v-else>
                <v-icon :color="selected.length === max ? 'grey' : 'black'">
                    mdi-checkbox-blank-outline
                </v-icon>
            </div>
        </template>

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

        <template #bottom>
            <v-pagination
                v-model="page"
                :length="pageOptions.pageCount"
                :total-visible="7"
                density="comfortable"
            ></v-pagination>
        </template>
    </v-data-table>
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

const page = ref(1);
const pageOptions = ref({
    pageCount: 1
});

const selected = ref<Taxon[]>([]);

const onRowClicked = (e: any, i: any) => {
    if (selected.value.map((taxon: Taxon) => taxon.id).includes(i.item.raw.id)) {
        selected.value = selected.value.filter((v) => v.id !== i.item.raw.id);
    } else if (selected.value.length < props.max) {
        selected.value = [...selected.value, i.item.raw];
    }

    emits("update:model-value", selected.value);
};

const rowActive = (item: any) => {
    return selected.value.map((taxon: Taxon) => taxon.id).includes(item.raw.id);
};

const headers = [
    {
        title: "",
        align: "start",
        key: "checkbox",
        width: "60px"
    },
    {
        title: "Taxon",
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
    display: flex;
    padding-left: 16px;
    padding-right: 16px;
    align-items: center;
}

:deep(td) > .active {
    display: flex;
    background-color: #eee;
    height: 100%;
    padding-left: 16px;
    padding-right: 16px;
    align-items: center;
}
</style>
