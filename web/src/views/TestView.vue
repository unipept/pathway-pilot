<template>
    <div v-for="pathway of koPathways">
        {{ pathway }}
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

export interface Props {
    koId: string;
}

const props = defineProps<Props>();

const keggStore = useKeggStore();

const koEntry = ref<any>(undefined);

// TODO: get this information from the mappingstore
const koNames = ['phosphoenolpyruvate carboxylase'];

// TODO: from mappingstore
const koPathways = computed(() => 
    koEntry.value.pathways.map((pathway: string) => ({
        name: pathway,
        description: 'TODO'
    }))
);
// TODO: from mappingstore
const koModules = computed(() => []);
// TODO: from mappingstore
const koReactions = computed(() => []);
// TODO: from mappingstore
const koEnzymes = ref([]);

const keggUrl = computed(() => `https://www.genome.jp/entry/${props.koId}`);

onMounted(async () => {
    await keggStore.fetchKoMapping();

    console.log(keggStore.koMapping)

    const koEntry = keggStore.koMapping.get("K00001") as any;

    koEnzymes.value = koEntry.ecNumbers.map((enzyme: string) => ({
        name: enzyme
    }));
});
</script>
