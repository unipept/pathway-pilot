<template>
    <v-card>
        <v-card-title>Orthology: {{ koId }}</v-card-title>
        <v-card-subtitle class="mt-n2 text-subtitle-1">
            <span v-for="name of koNames">
                {{ name }} <br>
            </span>
        </v-card-subtitle>

        <v-card-text class="mb-3">
            <v-row>
                <v-col cols=6>
                    <h2 class="mb-2">Pathways ({{ koPathways.length }})</h2>
                    <pathway-table :items="koPathways" :loading="koLoading" />
                </v-col>
                <v-col cols=6>
                    <h2 class="mb-2">Modules ({{ koModules.length }})</h2>
                    <module-table :items="koModules" :loading="koLoading" />
                </v-col>
            </v-row>

            <h2 class="mb-2 mt-3">Reactions ({{ koReactions.length }})</h2>
            <reaction-table :items="koReactions" :loading="koLoading" />

            <h2 class="mb-2 mt-3">Enzymes ({{ koEnzymes.length }})</h2>
            <enzyme-table :items="koEnzymes" :loading="koLoading" />

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
import EnzymeTable from '@/components/tables/EnzymeTable.vue';
import ResourceLink from '@/components/misc/ResourceLink.vue';
import useKeggStore from '@/stores/KeggStore';
import { useKeggEntryLink } from '@/composables/useKeggEntryLink';

export interface Props {
    koId: string;
}

const props = defineProps<Props>();

const keggStore = useKeggStore();
const { url } = useKeggEntryLink();

const koEntry = ref<any>(undefined);
const koLoading = ref<boolean>(false);

const koNames = computed(() => koEntry.value?.names ?? []);

const koPathways = computed(() =>
    koEntry.value?.pathways.map((pathway: any) => ({
        name: pathway.id,
        description: pathway.name
    })) ?? []
);

const koModules = computed(() => 
    koEntry.value?.modules.map((module: any) => ({
        name: module.id,
        description: module.name
    })) ?? []
);

const koReactions = computed(() => 
    koEntry.value?.reactionIds.map((reaction: string) => ({
        name: reaction
    })) ?? []
);

const koEnzymes = computed(() =>
    koEntry.value?.ecNumbers.map((enzyme: string) => ({
        name: enzyme
    })) ?? []
);

const keggUrl = computed(() => url(props.koId));

onMounted(async () => {
    koLoading.value = true;

    await keggStore.fetchKoMapping();
    koEntry.value = keggStore.koMapping.get(props.koId) as any;

    koLoading.value = false;
});
</script>
