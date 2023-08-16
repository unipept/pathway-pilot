<template>
    <v-card>
        <v-card-title>Compound: {{ compoundId }}</v-card-title>
        <v-card-subtitle class="mt-n2 text-subtitle-1">
            <span v-for="name of compoundNames">
                {{ name }} <br>
            </span>
        </v-card-subtitle>

        <v-card-text>
            <v-card class="pa-2" variant="outlined" flat>
                <h2>Pathways ({{ compoundPathways.length }})</h2>
                <pathway-table class="mt-3" :items="compoundPathways" :loading="compoundLoading" />
            </v-card>

            <v-card class="pa-2 mt-3" variant="outlined" flat>
                <h2>Modules ({{ compoundModules.length }})</h2>
                <pathway-table class="mt-3" :items="compoundModules" :loading="compoundLoading" />
            </v-card>

            <v-card class="pa-2 mt-3" variant="outlined" flat>
                <h2 class="mt-3">Reactions ({{ compoundReactions.length }})</h2>
                <reaction-table class="mt-3" :items="compoundReactions" :loading="compoundLoading" />
            </v-card>

            <v-card class="pa-2 mt-3" variant="outlined" flat>
                <h2 class="mt-3">Enzymes ({{ compoundEnzymes.length }})</h2>
                <enzyme-table class="mt-3" :items="compoundEnzymes" :loading="compoundLoading" />
            </v-card>

            <p class="mt-3">
                View more information at <resource-link :url="keggUrl">Kegg</resource-link>
            </p>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import PathwayTable from '@/components/tables/PathwayTable.vue';
import ReactionTable from '@/components/tables/ReactionTable.vue';
import EnzymeTable from '@/components/tables/EnzymeTable.vue';
import useKeggStore from '@/stores/KeggStore';
import ResourceLink from '@/components/misc/ResourceLink.vue';
import { useKeggEntryLink } from '@/composables/useKeggEntryLink';

export interface Props {
    compoundId: string;
}

const props = defineProps<Props>();

const keggStore = useKeggStore();
const { url } = useKeggEntryLink();

const compoundLoading = ref<boolean>(false);
const compoundEntry = ref<any>(undefined);

const compoundNames = computed(() => compoundEntry.value?.names ?? []);

const compoundPathways = computed(() =>
    compoundEntry.value?.pathways.map((pathway: any) => ({
        name: pathway.id,
        description: pathway.name
    })) ?? []
);

const compoundModules = computed(() => 
    compoundEntry.value?.modules.map((module: any) => ({
        name: module.id,
        description: module.name
    })) ?? []
);

const compoundEnzymes = computed(() =>
    compoundEntry.value?.ecNumbers.map((enzyme: any) => ({
        name: enzyme,
        description: keggStore.ecMapping.get(enzyme)?.names[0]
    })) ?? []
);

const compoundReactions = computed(() =>
    compoundEntry.value?.reactionIds.map((reaction: any) => ({
        name: reaction,
        description: keggStore.reactionMapping.get(reaction)?.names[0]
    })) ?? []
);

const keggUrl = computed(() => url(props.compoundId));

onBeforeMount(async () => {
    await keggStore.fetchReactionMapping();
    await keggStore.fetchEcMapping();
});

onMounted(async () => {
    compoundLoading.value = true;

    await keggStore.fetchCompoundMapping();
    compoundEntry.value = keggStore.compoundMapping.get(props.compoundId) as any;

    compoundLoading.value = false;
});
</script>
