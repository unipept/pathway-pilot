<template>
    <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :page="page"
        :filter-keys="['id', 'name']"
        :sort-by="[{ key: 'count', order: 'desc' }]"
        :must-sort=true
        items-per-page="5"
        item-value="pathway"
        density="compact"
        hide-default-footer
        @click:row="onRowClicked"
        @update:options="pageOptions = $event"
    >
        <template #item.checkbox="{ item }">
            <div v-if="rowActive(item)" class="active">
                <v-icon>mdi-checkbox-outline</v-icon>
            </div>
            <div v-else>
                <v-icon>mdi-checkbox-blank-outline</v-icon>
            </div>
        </template>

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
import Pathway from '@/logic/entities/Pathway';
import { ref, watch } from 'vue';
import { PathwayTableItem } from '../selection/PathwayTableItem';

export interface Props {
    modelValue: Pathway | undefined;
    search: string;
    items: PathwayTableItem[];
}

const props = defineProps<Props>();

const emits = defineEmits(["update:model-value"]);

const page = ref(1);
const pageOptions = ref({
    pageCount: 1
});

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
        title: "",
        align: "start",
        key: "checkbox",
        width: "60px"
    },
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

watch(pageOptions, (value) => {
    console.log(pageOptions.value)
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
