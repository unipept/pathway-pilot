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
                    <pathway-table :items="ecPathways" :loading="ecLoading" />
                </v-col>
                <v-col cols=6>
                    <h2 class="mb-2">Modules ({{ ecModules.length }})</h2>
                    <module-table :items="ecModules" :loading="ecLoading" />
                </v-col>
            </v-row>

            <h2 class="mb-2 mt-3">Reactions ({{ ecReactions.length }})</h2>
            <reaction-table :items="ecReactions" :loading="ecLoading" />

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
import { useKeggEntryLink } from '@/composables/useKeggEntryLink';

export interface Props {
    ecNumber: string;
}

const props = defineProps<Props>();

const keggStore = useKeggStore();
const { url } = useKeggEntryLink();

const ecEntry = ref<any>(undefined);
const ecLoading = ref<boolean>(false);

const ecNames = computed(() => ecEntry.value?.names ?? []);

const ecPathways = computed(() =>
    ecEntry.value?.pathways.map((pathway: any) => ({
        name: pathway.id,
        description: pathway.name
    })) ?? []
);

const ecModules = computed(() => 
    ecEntry.value?.modules.map((module: any) => ({
        name: module.id,
        description: module.name
    })) ?? []
);

const ecReactions = computed(() => 
    ecEntry.value?.reactionIds.map((reaction: string) => ({
        name: reaction
    })) ?? []
);

const keggUrl = computed(() => url(props.ecNumber));

onMounted(async () => {
    ecLoading.value = true;

    await keggStore.fetchEcMapping();
    ecEntry.value = keggStore.ecMapping.get(props.ecNumber) as any;

    ecLoading.value = false;
});
</script>
