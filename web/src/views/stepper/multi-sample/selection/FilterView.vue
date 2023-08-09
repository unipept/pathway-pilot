<template>
    <v-card flat>
        <v-card-text>
            <p class="mb-2">
                The table below presents all the Enzyme Commission (EC) numbers identified in your dataset through the use of 
                <resource-link url="https://unipept.ugent.be/">Unipept</resource-link>. By selecting one or more entries from this table, 
                you can apply specific filters on the pathways. For instance, if you choose EC 1.1.1.1, only the pathways containing this 
                particular EC number, and found within your input data will be displayed. This allows for targeted pathway exploration based 
                on the selected enzyme.
            </p>

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
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import useKeggStore from '@/stores/KeggStore';
import EnzymeTable from '@/components/tables/selection/EnzymeTable.vue';
import ResourceLink from '@/components/misc/ResourceLink.vue';
import useGroupSampleStore from '@/stores/sample/GroupSampleStore';

export interface Props {
    enzymes: string[]
}

const props = defineProps<Props>();

const emits = defineEmits(['update:enzymes']);

const sampleStore = useGroupSampleStore();
const keggStore   = useKeggStore();

const { ecs }       = storeToRefs(sampleStore);
const { ecMapping } = storeToRefs(keggStore);

const selectedEnzymes = ref<string[]>(props.enzymes);
const enzymeSearch    = ref<string>("");

const enzymeItems = computed(() => [ ...ecs.value ]
    .map((ec: string) => ({
        name: ec,
        description: ecMapping.value.get(ec)?.names[0] ?? ""
    }))
);

watch(selectedEnzymes, () => {
    emits('update:enzymes', selectedEnzymes.value);
});
</script>
