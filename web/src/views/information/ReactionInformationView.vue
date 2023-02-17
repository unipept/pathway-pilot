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
import { computed } from 'vue';
import PathwayTable from '@/components/tables/PathwayTable.vue';
import ModuleTable from '@/components/tables/ModuleTable.vue';
import ReactionTable from '@/components/tables/ReactionTable.vue';
import ResourceLink from '@/components/misc/ResourceLink.vue';

export interface Props {
    reactionId: string;
}

const props = defineProps<Props>();

// TODO: get this information from the mappingstore
const reactionNames = [
    'phosphate:oxaloacetate carboxy-lyase (adding phosphate;phosphoenolpyruvate-forming)',
    'Orthophosphate:oxaloacetate carboxyl-lyase (phosphorylating)'
]

// TODO: from mappingstore
const reactionPathways = computed(() => []);
// TODO: from mappingstore
const reactionModules = computed(() => []);
// TODO: from mappingstore
const reactionEnzymes = computed(() => []);

const keggUrl = computed(() => `https://www.genome.jp/entry/${props.reactionId}`);
</script>
