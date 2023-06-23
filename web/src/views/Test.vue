<template>
    <SearchFilter 
        v-model:search="search" 
        v-model:filter="filter"
        search-label="Search for an identifier or name"
        filter-label="Apply filters"
        @click:filter="onClickFilter"
    />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import SearchFilter from '@/components/inputs/SearchFilter.vue';

const search = ref<string>("");
const filter = ref<string[]>(["test1", "test2", "test2", "test2", "test2", "test2"]);

const onClickFilter = () => {
    console.log("clicked filter");
}

watch(search, (newValue) => {
    console.log(newValue);
})

watch(filter, (newValue) => {
    console.log(filter);
})
</script>

<style scoped>

</style>
