<template>
    <div v-if="loading">
        Loading...
    </div>

    <div v-else>
        Done
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import PathwayTable from '@/components/tables/PathwayTable.vue';
import ModuleTable from '@/components/tables/ModuleTable.vue';
import ReactionTable from '@/components/tables/ReactionTable.vue';
import EnzymeTable from '@/components/tables/EnzymeTable.vue';
import ResourceLink from '@/components/misc/ResourceLink.vue';
import useKeggStore from '@/stores/KeggStore';
import CompoundModal from '@/components/modals/CompoundModal.vue';

const keggStore = useKeggStore();

const loading = ref<boolean>(false);

onMounted(async () => {
    loading.value = true;

    await keggStore.fetchKoMapping();

    loading.value = false;
});
</script>
