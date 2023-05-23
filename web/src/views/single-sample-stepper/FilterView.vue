<template>
    <div v-if="initialized">
        <v-row>
            <v-col cols=12>
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

        <div class="d-flex justify-end mt-3">
            <v-btn class="ms-3" color="primary" @click="onDownload">
                <v-icon left>mdi-download</v-icon>
                <span class="ms-1">Download pathway mapping</span>
            </v-btn>
        </div>
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

const sampleStore = useSingleSampleStore();
const keggStore = useKeggStore();

const { initialized, ecs } = storeToRefs(sampleStore);
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

const onDownload = () => {
    sampleStore.download("PathwayMapping.csv");
};

watch(() => selectedEnzymes.value, () => {
    sampleStore.updateFilter(
        selectedEnzymes.value.map((ec: string) => Array.from(sampleStore.ecToPathways.get(ec)!) ).flat()
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
