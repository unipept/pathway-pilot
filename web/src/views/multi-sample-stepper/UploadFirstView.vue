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
                    <peptide-list-form @submit="onSubmit" />
                </v-window-item>
            </v-window>
        </v-card>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ResourceLink from '@/components/misc/ResourceLink.vue';
import PeptideListForm from '@/components/forms/PeptideListForm.vue';

defineEmits(['submit']);

const currentTab = ref<number>(0);
</script>

<style scoped>
.subtitle {
    color: #454545;
}
</style>
