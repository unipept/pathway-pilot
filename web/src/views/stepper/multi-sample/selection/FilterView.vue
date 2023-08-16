<template>
    <v-card flat>
        <v-card-text>
            <v-row>
                <v-col cols="6">
                    <p class="mb-2">
                        The table below presents all the Enzyme Commission (EC) numbers identified in your dataset through the use of 
                        <resource-link url="https://unipept.ugent.be/">Unipept</resource-link>. By selecting one or more entries from this table, 
                        you can apply specific filters on the pathways. For instance, if you choose EC 1.1.1.1, only the pathways containing this 
                        particular EC number, and found within your input data will be displayed. This allows for targeted pathway exploration based 
                        on the selected enzyme.
                    </p>
                </v-col>

                <v-col cols="6">
                    <p class="mb-2">
                        The table below presents all the different compounds identified in your dataset. By selecting one or more entries from this table, 
                        you can apply specific filters on the pathways. For instance, if you choose C00001, only the pathways containing H2O, and found within 
                        your input data will be displayed. This allows for targeted pathway exploration based on the selected compound.
                    </p>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="6">
                    <v-text-field
                        class="mt-3 mb-n3"
                        v-model="enzymeSearch"
                        label="Search for your EC number"
                        prepend-inner-icon="mdi-magnify"
                        variant="solo"
                        density="comfortable"
                    />

                    <filter-table
                        v-model="selectedFilter"
                        :items="enzymeItems"
                        :search="enzymeSearch"
                        color="orange"
                    />
                </v-col>

                <v-col cols="6">
                    <v-text-field
                        class="mt-3 mb-n3"
                        v-model="compoundSearch"
                        label="Search for your compound"
                        prepend-inner-icon="mdi-magnify"
                        variant="solo"
                        density="comfortable"
                    />

                    <filter-table
                        v-model="selectedFilter"
                        :items="compoundItems"
                        :search="compoundSearch"
                        color="green"
                    />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import useKeggStore from '@/stores/KeggStore';
import ResourceLink from '@/components/misc/ResourceLink.vue';
import FilterTable from '@/components/tables/selection/FilterTable.vue';
import { SearchFilterItem } from '@/components/inputs/SearchFilterItem';
import { FilterTableItem } from '@/components/tables/selection/FilterTableItem';
import { onBeforeMount } from 'vue';
import useGroupSampleStore from '@/stores/sample/GroupSampleStore';

export interface Props {
    filter: SearchFilterItem[];
}

const props = defineProps<Props>();

const emits = defineEmits(['update:filter']);

const sampleStore = useGroupSampleStore();
const keggStore   = useKeggStore();

const { ecs, compounds } = storeToRefs(sampleStore);

const selectedFilter = ref<FilterTableItem[]>(props.filter.map((filter: SearchFilterItem) => ({
    name: filter.name,
    description: '',
    color: filter.color
})));

const enzymeSearch = ref<string>("");
const compoundSearch = ref<string>("");

const enzymeItems = computed(() => [ ...ecs.value ]
    .map((ec: string) => ({
        name: ec,
        description: keggStore.ecMapping?.get(ec)?.names[0] ?? ""
    }))
);

const compoundItems = computed(() => [ ...compounds.value ]
    .map((compound: string) => ({
        name: compound,
        description: keggStore.compoundMapping?.get(compound)?.names[0] ?? ""
    }))
);

watch(selectedFilter, () => {
    emits('update:filter', selectedFilter.value.map((item: FilterTableItem) => ({
        name: item.name,
        color: item.color
    })));
})

onBeforeMount(async () => {
    await keggStore.fetchEcMapping();
    await keggStore.fetchCompoundMapping();
})
</script>
