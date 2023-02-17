<template>
    <v-card>
        <v-card-title>Associated input</v-card-title>
        <v-card-subtitle class="mt-n2 text-subtitle-1">
            The following entries contain a match against the selected node. The matched annotations are highlighted for each entry in the Annotations column.
        </v-card-subtitle>

        <v-card-text>
            <matched-input-table :items="MatchedInputItems" />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MatchedInputTable from '@/components/tables/MatchedInputTable.vue';

// TODO: from mappingstore and other stores
const MatchedInputItems = computed(() => []);
</script>
