<template>
    <v-card class="mt-3">
        <v-card-title>Matched organisms</v-card-title>
        <v-card-text class="mt-n2 text-subtitle-1">
            The following entries contain a match against the selected node. The matched annotations are highlighted for each 
            entry in the Annotations column.
        </v-card-text>

        <v-card-text>
            <matched-input-table v-if="hasMatches" :items="items" />

            <warning-alert v-else>
                Unfortunately, no taxon matches were found for the selected node.
            </warning-alert>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import WarningAlert from '@/components/alerts/WarningAlert.vue';
import MatchedInputTable from '@/components/tables/MatchedInputTable.vue';
import { MatchedInputTableItem } from '@/components/tables/MatchedInputTableItem';
import { computed } from 'vue';

export interface Props {
    items: MatchedInputTableItem[];
}

const props = defineProps<Props>();

const hasMatches = computed(() => props.items.length > 0);
</script>
