<template>
    <v-dialog
        v-model="dialogOpen"
        @click:outside="onClickOutside"
    >
        <page-tabs 
            v-model="currentTab"
            :tabs="tabs"
            @click:close="onClickOutside"
        >
            <v-window v-model="currentTab">
                <v-window-item :value=0>
                    <v-card-title>Orthology: K01595</v-card-title>
                    <v-card-subtitle class="mt-n2 text-subtitle-1">
                        <span>
                            phosphoenolpyruvate carboxylase <br>
                        </span>
                    </v-card-subtitle>

                    <v-card-text class="mb-3">
                        <v-row>
                            <v-col cols=6>
                                <h2 class="mb-2">Pathways ({{ pathwayItems.length }})</h2>
                                <pathway-table :items="pathwayItems" />
                            </v-col>
                            <v-col cols=6>
                                <h2 class="mb-2">Modules ({{ moduleItems.length }})</h2>
                                <pathway-table :items="moduleItems" />
                            </v-col>
                        </v-row>

                        <h2 class="mb-2 mt-3">Reactions (1)</h2>
                        <reaction-table :items="[{ name: 'R00345' }]" />

                        <h2 class="mb-2 mt-3">Enzymes (1)</h2>
                        <enzyme-table :items="[{ name: '4.1.1.31' }]" />

                        <p class="mt-3">
                            View more information at <resource-link :url="keggUrl">Kegg</resource-link>
                        </p>
                    </v-card-text>
                </v-window-item>

                <v-window-item :value=1>
                    <v-card-title>Orthology: K01086</v-card-title>
                    <v-card-subtitle class="mt-n2 text-subtitle-1">
                        <span>
                            fructose-1,6-bisphosphatase I <br>
                            sedoheptulose-1,7-bisphosphatase <br>
                        </span>
                    </v-card-subtitle>

                    <v-card-text class="mb-3">
                        <v-row>
                            <v-col cols=6>
                                <h2 class="mb-2">Pathways ({{ pathwayItems.length }})</h2>
                                <pathway-table :items="pathwayItems" />
                            </v-col>
                            <v-col cols=6>
                                <h2 class="mb-2">Modules ({{ moduleItems.length }})</h2>
                                <pathway-table :items="moduleItems" />
                            </v-col>
                        </v-row>

                        <h2 class="mb-2 mt-3">Reactions (3)</h2>
                        <reaction-table :items="[{ name: 'R00762' }, { name: 'R01845' }, { name: 'R04780' }]" />

                        <h2 class="mb-2 mt-3">Enzymes (2)</h2>
                        <enzyme-table :items="[{ name: '3.1.3.11' }, { name: '3.1.3.37' }]" />

                        <p class="mt-3">
                            View more information at <resource-link :url="keggUrl">Kegg</resource-link>
                        </p>
                    </v-card-text>
                </v-window-item>

                <v-window-item :value=2>
                    <v-card-title>Enzyme: 4.1.1.31</v-card-title>
                    <v-card-subtitle class="mt-n2 text-subtitle-1">
                        <span>
                            phosphoenolpyruvate carboxylase <br>
                            phosphopyruvate (phosphate) carboxylase <br>
                            PEP carboxylase <br>
                            phosphoenolpyruvic carboxylase <br>
                            PEPC <br>
                            PEPCase <br>
                            phosphate:oxaloacetate carboxy-lyase (phosphorylating <br>
                        </span>
                    </v-card-subtitle>

                    <v-card-text class="mb-3">
                        <v-row>
                            <v-col cols=6>
                                <h2 class="mb-2">Pathways ({{ pathwayItems.length }})</h2>
                                <pathway-table :items="pathwayItems" />
                            </v-col>
                            <v-col cols=6>
                                <h2 class="mb-2">Modules ({{ moduleItems.length }})</h2>
                                <pathway-table :items="moduleItems" />
                            </v-col>
                        </v-row>

                        <h2 class="mb-2 mt-3">Reactions (1)</h2>
                        <reaction-table :items="[{ name: 'R00345' }]" />

                        <p class="mt-3">
                            View more information at <resource-link :url="keggUrl">Kegg</resource-link>
                        </p>
                    </v-card-text>
                </v-window-item>

                <v-window-item :value=3>
                    <v-card-title>Reaction: R00345</v-card-title>
                    <v-card-subtitle class="mt-n2 text-subtitle-1">
                        <span>
                            phosphate:oxaloacetate carboxy-lyase (adding phosphate;phosphoenolpyruvate-forming) <br>
                            Orthophosphate:oxaloacetate carboxyl-lyase (phosphorylating) <br>
                        </span>
                    </v-card-subtitle>

                    <v-card-text class="mb-3">
                        <v-row>
                            <v-col cols=6>
                                <h2 class="mb-2">Pathways ({{ pathwayItems.length }})</h2>
                                <pathway-table :items="pathwayItems" />
                            </v-col>
                            <v-col cols=6>
                                <h2 class="mb-2">Modules ({{ moduleItems.length }})</h2>
                                <pathway-table :items="moduleItems" />
                            </v-col>
                        </v-row>

                        <h2 class="mb-2 mt-3">Enzymes (1)</h2>
                        <enzyme-table :items="[{ name: '4.1.1.31' }]" />

                        <p class="mt-3">
                            View more information at <resource-link :url="keggUrl">Kegg</resource-link>
                        </p>
                    </v-card-text>
                </v-window-item>

                <v-window-item :value=4>
                    <v-card class="tab-content" flat>
                        <v-card-text class="mb-3">
                            FIVE
                        </v-card-text>
                    </v-card>
                </v-window-item>
            </v-window>
        </page-tabs>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import PageTabs from '../tabs/PageTabs.vue';
import PathwayTable from '../tables/PathwayTable.vue';
import ResourceLink from '../misc/ResourceLink.vue';
import ReactionTable from '../tables/ReactionTable.vue';
import EnzymeTable from '../tables/EnzymeTable.vue';

export interface Props {
    modelValue: boolean;
}

const props = defineProps<Props>();

const emits = defineEmits(['update:model-value']);

const dialogOpen = ref<boolean>(props.modelValue);

const currentTab = ref<number>(0);
const tabs = ['Orthology: K01595', 'Orthology: K01086', 'Enzyme: 4.1.1.31', 'Reaction: R00345', 'Extra'];

const keggUrl = computed(() => `https://www.genome.jp/entry/K01595`);

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

const onClickOutside = () => {
    emits('update:model-value', false);
    currentTab.value = 0;
};

watch(() => props.modelValue, (value) => {
    dialogOpen.value = value;
});
</script>
