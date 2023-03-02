<template>
    <v-card>
        <v-tabs
            v-model="currentTab"
            bg-color="secondary"
            centered
        >
            <v-tab value=0>Peptides</v-tab>
            <v-tab value=1>Proteins</v-tab>
        </v-tabs>

        <v-window v-model="currentTab">
            <v-window-item value=0>
                <peptide-list-form @submit="onSubmit" />
            </v-window-item>

            <v-window-item value=1>
                <div></div>
            </v-window-item>
        </v-window>
    </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PeptideListForm from './PeptideListForm.vue';

const emits = defineEmits(["submit"]);

const currentTab = ref<number>(0);

const onSubmit = async (res: any[]) => {
    emits("submit", res);
};
</script>
