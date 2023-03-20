<template>
    <div class="mt-5">
        <v-card>
            <v-tabs
                v-model="currentTab"
                bg-color="secondary"
                centered
            >
                <v-tab value=0>Peptides</v-tab>
            </v-tabs>

            <v-window v-model="currentTab">
                <v-window-item value=0>
                    <peptide-list-form></peptide-list-form>
                </v-window-item>
            </v-window>
        </v-card>
    </div>
</template>

<script lang="ts" setup>
import PeptideListForm from '@/components/forms/multi-sample/PeptideListForm.vue';
import { ref } from 'vue';

const currentTab = ref<number>(0);
</script>
