<template>
    <v-card>
        <v-card-title>Enzyme: {{ ecNumber }}</v-card-title>
        <v-card-subtitle class="mt-n2 text-subtitle-1">
            <span v-for="name of ecNames">
                {{ name }} <br>
            </span>
        </v-card-subtitle>

        <v-card-text class="mb-3">
            <v-row>
                <v-col cols=6>
                    <h2 class="mb-2">Pathways ({{ ecPathways.length }})</h2>
                    <pathway-table :items="ecPathways" />
                </v-col>
                <v-col cols=6>
                    <h2 class="mb-2">Modules ({{ ecModules.length }})</h2>
                    <module-table :items="ecModules" />
                </v-col>
            </v-row>

            <h2 class="mb-2 mt-3">Reactions ({{ ecReactions.length }})</h2>
            <reaction-table :items="ecReactions" />

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
    ecNumber: string;
}

const props = defineProps<Props>();

// TODO: get this information from the mappingstore
const ecNames = [
    'phosphoenolpyruvate carboxylase',
    'phosphopyruvate (phosphate) carboxylase',
    'PEP carboxylase',
    'phosphoenolpyruvic carboxylase',
    'PEPC',
    'PEPCase',
    'phosphate:oxaloacetate carboxy-lyase (phosphorylating)'
]

// TODO: from mappingstore
const ecPathways = computed(() => []);
// TODO: from mappingstore
const ecModules = computed(() => []);
// TODO: from mappingstore
const ecReactions = computed(() => []);

const keggUrl = computed(() => `https://www.genome.jp/entry/${props.ecNumber}`);
</script>
