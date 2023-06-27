<template>
    <group-table 
        :items="tableItems"
        :max="4"
    />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import GroupTable from '@/components/tables/multi-sample/GroupTable.vue';

const tableItems = computed(() => [
    {
        name: 'Group 1',
        items: [
            { name: "test1.txt", size: "100 peptides", loading: false },
            { name: "test2.txt", size: "100 peptides", loading: false },
            { name: "test3.txt", size: "100 peptides", loading: false },
            { name: "test4.txt", size: "100 peptides", loading: false },
        ]
    },
    {
        name: 'Group 2',
        items: [
            { name: "test1.txt", size: "100 peptides", loading: false },
            { name: "test2.txt", size: "100 peptides", loading: true },
            { name: "test3.txt", size: "100 peptides", loading: true },
            { name: "test4.txt", size: "100 peptides", loading: true },
        ]
    },
]);
</script>

<style scoped>

</style>
