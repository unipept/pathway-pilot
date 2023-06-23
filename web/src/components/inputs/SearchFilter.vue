<template>
    <div class="d-flex align-center">
        <v-text-field
            class="mt-3 mb-n3"
            v-model="searchValue"
            :label="searchLabel"
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            density="comfortable"
            @update:model-value="onSearch"
        />

        <v-card class="ms-3" @click="onClick">
            <v-card-text class="filter">
                <v-icon left>mdi-filter-outline</v-icon>
                <span class="ms-1">Apply filters</span>
            </v-card-text>
        </v-card>
    </div>

    <div class="d-flex flex-wrap">
        <v-chip v-for="item, i in filter"
            class="mb-2"
            :class="{ 'me-2': i !== filter.length - 1 }"
            color="primary"
            size="small"
            append-icon="mdi-close-circle-outline"
            @click="() => onRemoveFilter(i)"
        >{{ item }}</v-chip>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

export interface Props {
    search: string
    searchLabel?: string
    filter: string[]
    filterLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
    searchLabel: '',
    filterLabel: ''
});

const emits = defineEmits(['update:search', 'update:filter', 'click:filter']);

const searchValue = ref<string>(props.search);

const onSearch = () => {
    emits('update:search', searchValue.value);
};

const onRemoveFilter = (index: number) => {
    const newFilter = [ ...props.filter ];
    newFilter.splice(index, 1);
    emits('update:filter', newFilter);
};

const onClick = () => {
    emits('click:filter');
};

watch(() => props.search, (newValue) => {
    searchValue.value = newValue;
});
</script>

<style scoped>
.filter {
    display: flex;
    font-size: 16px;
    padding: 8px 20px;
    height: 48px;
    align-items: center;
    color: rgb(122, 122, 122);
}
</style>
