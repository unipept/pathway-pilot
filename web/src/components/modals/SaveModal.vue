<template>
    <v-dialog
        v-model="dialogOpen"
        @click:outside="onClickOutside"
    >
        <v-card>
            <v-tabs v-model="currentTab" class="d-flex" color="secondary">
                <v-tab :value=0>Orthology: K01595</v-tab>
                <v-tab :value=1>Orthology: K01086</v-tab>
                <v-tab :value=2>Enzyme: 4.1.1.31</v-tab>
                <v-tab :value=3>Reaction: R00345</v-tab>
                <div class="d-flex flex-grow-1 align-center justify-end pe-4">
                    <v-icon>mdi-close</v-icon>
                </div>
            </v-tabs>

            <v-card-text>
                <v-window v-model="currentTab">
                    <v-window-item :value=0>
                        <div style="height: 600px;">One</div>
                    </v-window-item>

                    <v-window-item :value=1>
                        <div style="height: 600px;">Two</div>
                    </v-window-item>

                    <v-window-item :value=2>
                        <div style="height: 600px;">Three</div>
                    </v-window-item>

                    <v-window-item :value=3>
                        <div style="height: 600px;">Four</div>
                    </v-window-item>
                </v-window>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import PageTabs from '../tabs/PageTabs.vue';

export interface Props {
    modelValue: boolean;
}

const props = defineProps<Props>();

const emits = defineEmits(['update:model-value']);

const dialogOpen = ref<boolean>(props.modelValue);

const currentTab = ref<number>(0);
const tabs = ['Orthology: K01595', 'Orthology: K01086', 'Enzyme: 4.1.1.31', 'Reaction: R00345'];

const onClickOutside = () => {
    emits('update:model-value', false);
};

watch(() => props.modelValue, (value) => {
    dialogOpen.value = value;
});
</script>
