<template>
    <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :page="page"
        :filter-keys="['name', 'description']"
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
                <v-icon>
                    mdi-checkbox-blank-outline
                </v-icon>
            </div>
        </template>

        <template #item.name="{ item }">
            <div :class="rowActive(item) ? 'active' : ''">
                {{ item.raw.name }}
            </div>
        </template>

        <template #item.description="{ item }">
            <div :class="rowActive(item) ? 'active' : ''">
                {{ item.raw.description }}
            </div>
        </template>

        <template #bottom>
            <v-pagination
                v-model="page"
                :length="pageOptions.pageCount"
                :total-visible="3"
                density="compact"
            ></v-pagination>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { FilterTableItem } from './FilterTableItem';

export interface Props {
    modelValue: FilterTableItem[];
    items: FilterTableItem[];
    search: string;
    color: string;
}

const props = defineProps<Props>();

const emits = defineEmits(["update:model-value"]);

const page = ref(1);
const pageOptions = ref({
    pageCount: 1
});

const selected = ref<FilterTableItem[]>(props.modelValue);

const onRowClicked = (e: any, i: any) => {
    if (selected.value.map(item => item.name).includes(i.item.raw.name)) {
        selected.value = selected.value.filter((item) => item.name !== i.item.raw.name);
    } else {
        selected.value = [...selected.value, {
            name: i.item.raw.name,
            description: i.item.raw.description,
            color: props.color
        }];
    }

    emits("update:model-value", selected.value);
};

const rowActive = (item: any) => {
    return selected.value.map(item => item.name).includes(item.raw.name);
};

const headers = [
    {
        title: "",
        align: "start",
        key: "checkbox",
        width: "60px"
    },
    {
        title: "Name",
        align: "start",
        key: "name"
    },
    {
        title: "Description",
        align: "start",
        key: "description"
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
