<template>
    <v-dialog
        v-model="dialogOpen"
        @click:outside="onClickOutside"
    >
        <v-card flat>
            <v-card-title>Compound: {{ compound?.id }}</v-card-title>
            <v-card-subtitle class="mt-n2 text-subtitle-1">
                <span v-for="name in compound?.names" :key="name">
                    {{ name }} <br>
                </span>
            </v-card-subtitle>

            <v-card-text class="mb-3">
                <v-row>
                    <v-col cols=6>
                        <h2>Pathways ({{ pathwayItems.length }})</h2>
                        <pathway-table :items="pathwayItems" />
                    </v-col>
                    <v-col cols=6>
                        <h2>Modules ({{ moduleItems.length }})</h2>
                        <pathway-table :items="moduleItems" />
                    </v-col>
                </v-row>

                <h2 class="mt-3">Reactions ({{ reactionItems.length }})</h2>
                <reaction-table :items="reactionItems" />

                <h2 class="mt-3">Enzymes ({{ enzymeItems.length }})</h2>
                <enzyme-table :items="enzymeItems" />

                <p class="mt-3">
                    View more information at <resource-link :url="keggUrl">Kegg</resource-link>
                </p>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import PathwayTable from '../tables/PathwayTable.vue';
import ReactionTable from '../tables/ReactionTable.vue';
import EnzymeTable from '../tables/EnzymeTable.vue';
import ResourceLink from '../misc/ResourceLink.vue';

export type Compound = {
    id: string;
    names: string[];
};

export interface Props {
    modelValue: Compound | undefined;
}

const props = defineProps<Props>();

const emits = defineEmits(['update:model-value']);

const compound = ref<Compound | undefined>(props.modelValue);
const dialogOpen = ref<boolean>(props.modelValue !== undefined);

const keggUrl = computed(() => `https://www.genome.jp/entry/${compound.value?.id}`);

const pathwayItems = [
    { name: 'map00071', description: 'This is some crap as a string!' },
    { name: 'map00071', description: 'This is some crap as a string!' },
    { name: 'map00071', description: 'This is some crap as a string!' },
    { name: 'map00071', description: 'This is some crap as a string!' },
    { name: 'map00071', description: 'This is some crap as a string!' },
    { name: 'map00071', description: 'This is some crap as a string!' },
    { name: 'map00071', description: 'This is some crap as a string!' },
    { name: 'map00071', description: 'This is some crap as a string!' }
];

const moduleItems = [
    { name: 'map00071', description: 'This is some crap as a string!' },
    { name: 'map00071', description: 'This is some crap as a string!' },
    { name: 'map00071', description: 'This is some crap as a string!' }
];

const reactionItems = [
    { name: 'R00192' }, { name: 'R00192' }, { name: 'R00192' }, { name: 'R00192' },
    { name: 'R00192' }, { name: 'R00192' }, { name: 'R00192' }, { name: 'R00192' },
    { name: 'R00192' }, { name: 'R00192' }, { name: 'R00192' }, { name: 'R00192' },
    { name: 'R00192' }, { name: 'R00192' }, { name: 'R00192' }
];

const enzymeItems = [
    { name: '2.1.3.41' }, { name: '2.1.3.41' }, { name: '2.1.3.41' }, { name: '2.1.3.41' },
    { name: '2.1.3.41' }, { name: '2.1.3.41' }, { name: '2.1.3.41' }, { name: '2.1.3.41' }
];

const onClickOutside = () => {
    emits('update:model-value', undefined);
};

watch(() => props.modelValue, (value) => {
    compound.value = value;
    dialogOpen.value = value !== undefined;
});
</script>
