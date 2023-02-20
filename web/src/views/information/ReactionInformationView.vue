<template>
    <v-card>
        <v-card-title>Reaction: {{ reactionId }}</v-card-title>
        <v-card-subtitle class="mt-n2 text-subtitle-1">
            <span v-for="name of reactionNames">
                {{ name }} <br>
            </span>
        </v-card-subtitle>

        <v-card-text class="mb-3">
            <v-row>
                <v-col cols=6>
                    <h2 class="mb-2">Pathways ({{ reactionPathways.length }})</h2>
                    <pathway-table :items="reactionPathways" />
                </v-col>
                <v-col cols=6>
                    <h2 class="mb-2">Modules ({{ reactionModules.length }})</h2>
                    <module-table :items="reactionModules" />
                </v-col>
            </v-row>

            <h2 class="mb-2 mt-3">Enzymes ({{ reactionEnzymes.length }})</h2>
            <reaction-table :items="reactionEnzymes" />

            <p class="mt-3">
                View more information at <resource-link :url="keggUrl">Kegg</resource-link>
            </p>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import PathwayTable from '@/components/tables/PathwayTable.vue';
import ModuleTable from '@/components/tables/ModuleTable.vue';
import ReactionTable from '@/components/tables/ReactionTable.vue';
import ResourceLink from '@/components/misc/ResourceLink.vue';
import useKeggStore from '@/stores/KeggStore';

export interface Props {
    reactionId: string;
}

const props = defineProps<Props>();

const keggStore = useKeggStore();

const reactionEntry = ref<any>(undefined);

const reactionNames = computed(() => reactionEntry.value?.name
    .split(';').map((n: string) => n.trim()).filter((n: string) => n.length) ?? []
);

const reactionPathways = computed(() =>
    reactionEntry.value?.pathways.map((pathway: string) => ({
        name: pathway,
        description: 'TODO'
    })) ?? []
);

// TODO: from mappingstore
const reactionModules = computed(() => []);

const reactionEnzymes = computed(() => 
    reactionEntry.value?.ecNumbers.map((enzyme: string) => ({
        name: enzyme,
    })) ?? []
);

const keggUrl = computed(() => `https://www.genome.jp/entry/${props.reactionId}`);

onMounted(async () => {
    await keggStore.fetchReactionMapping();
    reactionEntry.value = keggStore.reactionMapping.get(props.reactionId) as any;
});
</script>
