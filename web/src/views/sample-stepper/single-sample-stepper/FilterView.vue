<template>
    <div v-if="initialized" class="mt-3">
        <p class="mb-2">
            The table below presents all the Enzyme Commission (EC) numbers identified in your dataset through the use of 
            <resource-link url="https://unipept.ugent.be/">Unipept</resource-link>. By selecting one or more entries from this table, 
            you can apply specific filters on the pathways. For instance, if you choose EC 1.1.1.1, only the pathways containing this 
            particular EC number, and found within your input data will be displayed. This allows for targeted pathway exploration based 
            on the selected enzyme.
        </p>

        <div class="d-flex align-center">
            <v-text-field
                class="mt-3 mb-n3"
                v-model="enzymeSearch"
                label="Search for your EC number"
                prepend-inner-icon="mdi-magnify"
                variant="solo"
                density="comfortable"
            />

            <v-btn class="ms-3" color="primary" variant="outlined" @click="onDownload">
                <v-icon left>mdi-download</v-icon>
                <span class="ms-1">Download pathway mapping</span>
            </v-btn>
        </div>

        <enzyme-table
            v-model="selectedEnzymes"
            :items="enzymeItems"
            :search="enzymeSearch"
        />
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import useSingleSampleStore from '@/stores/SingleSampleStore';
import { storeToRefs } from 'pinia';
import useKeggStore from '@/stores/KeggStore';
import EnzymeTable from '@/components/tables/selection/EnzymeTable.vue';
import { watch } from 'vue';
import ResourceLink from '@/components/misc/ResourceLink.vue';

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
