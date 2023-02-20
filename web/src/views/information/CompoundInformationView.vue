<template>
    <v-card flat>
        <v-card-title>Compound: {{ compoundId }}</v-card-title>
        <v-card-subtitle class="mt-n2 text-subtitle-1">
            <span v-for="name of compoundNames">
                {{ name }} <br>
            </span>
        </v-card-subtitle>

        <v-card-text class="mb-3">
            <v-row>
                <v-col cols=6>
                    <h2>Pathways ({{ compoundPathways.length }})</h2>
                    <pathway-table :items="compoundPathways" />
                </v-col>
                <v-col cols=6>
                    <h2>Modules ({{ compoundModules.length }})</h2>
                    <pathway-table :items="compoundModules" />
                </v-col>
            </v-row>

            <h2 class="mt-3">Reactions ({{ compoundReactions.length }})</h2>
            <reaction-table :items="compoundReactions" />

            <h2 class="mt-3">Enzymes ({{ compoundEnzymes.length }})</h2>
            <enzyme-table :items="compoundEnzymes" />

            <p class="mt-3">
                View more information at <resource-link :url="keggUrl">Kegg</resource-link>
            </p>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import PathwayTable from '@/components/tables/PathwayTable.vue';
import ReactionTable from '@/components/tables/ReactionTable.vue';
import EnzymeTable from '@/components/tables/EnzymeTable.vue';
import useKeggStore from '@/stores/KeggStore';
import ResourceLink from '@/components/misc/ResourceLink.vue';

export interface Props {
    compoundId: string;
}

const props = defineProps<Props>();

const keggStore = useKeggStore();

const compoundEntry = ref<any>(undefined);

const compoundNames = computed(() => compoundEntry.value?.names ?? []);

const compoundPathways = computed(() =>
    compoundEntry.value?.pathways.map((pathway: any) => ({
        name: pathway.id,
        description: pathway.name
    })) ?? []
);

const compoundModules = computed(() => []);

const compoundEnzymes = computed(() =>
    compoundEntry.value?.ecNumbers.map((enzyme: any) => ({
        name: enzyme
    })) ?? []
);

const compoundReactions = computed(() =>
    compoundEntry.value?.reactionIds.map((reaction: any) => ({
        name: reaction
    })) ?? []
);

const keggUrl = computed(() => `https://www.genome.jp/entry/${props.compoundId}`);

onMounted(async () => {
    await keggStore.fetchCompoundMapping();
    compoundEntry.value = keggStore.compoundMapping.get(props.compoundId) as any;
});
</script>
