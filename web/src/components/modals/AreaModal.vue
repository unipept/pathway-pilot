<template>
    <v-dialog
        v-model="dialogOpen"
        @click:outside="onClickOutside"
    >
        <page-tabs 
            v-model="currentTab"
            :tabs="tabs"
        >
            <v-window v-model="currentTab">
                <v-window-item :value=0>
                    One
                </v-window-item>

                <v-window-item :value=1>
                    Two
                </v-window-item>

                <v-window-item :value=2>
                    Three
                </v-window-item>
            </v-window>
        </page-tabs>
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
const tabs = ['Orthology: K01595', 'Enzyme: 4.1.1.31', 'Reaction: R00345'];

const onClickOutside = () => {
    emits('update:model-value', false);
};

watch(() => props.modelValue, (value) => {
    dialogOpen.value = value;
});
</script>
