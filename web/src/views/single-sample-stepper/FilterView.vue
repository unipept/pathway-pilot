<template>
    <div v-if="initialized">
        <v-row>
            <v-col cols=6>
                <v-text-field
                    class="mt-3 mb-n3"
                    v-model="enzymeSearch"
                    label="Search for your EC number"
                    prepend-inner-icon="mdi-magnify"
                    variant="solo"
                    density="comfortable"
                />
                <enzyme-table
                    v-model="selectedEnzymes"
                    :items="enzymeItems"
                    :search="enzymeSearch"
                />
            </v-col>
        </v-row>
    </div>

    <warning-alert v-else class="mt-5">
        In order to create your selection, you need to upload the data first.
    </warning-alert>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import useSingleSampleStore from '@/stores/SingleSampleStore';
import { storeToRefs } from 'pinia';
import useKeggStore from '@/stores/KeggStore';
import WarningAlert from '@/components/alerts/WarningAlert.vue';
import EnzymeTable from '@/components/tables/selection/EnzymeTable.vue';
import { watch } from 'vue';

const mappingStore = useSingleSampleStore();
const keggStore = useKeggStore();

const { initialized, ecs } = storeToRefs(mappingStore);
const { ecMapping } = storeToRefs(keggStore);

const enzymeSearch = ref<string>("");
const selectedEnzymes = ref<string[]>([]);

const enzymeItems = computed(() => [ ...ecs.value ]
    .map((ec: string) => ({
            name: ec,
            description: ecMapping.value.get(ec)?.names[0] ?? "",
        })
    )
);

watch(() => selectedEnzymes.value, () => {
    mappingStore.updateFilter(
        selectedEnzymes.value.map((ec: string) => Array.from(mappingStore.ecToPathways.get(ec)!) ).flat()
    );
});

onMounted(async () => {
    await keggStore.fetchEcMapping();
});
</script>

<style scoped>
.subtitle {
    color: #454545;
}
</style>
