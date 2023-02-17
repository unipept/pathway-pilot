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
                    <matched-input-information-view />
                </v-window-item>

                <v-window-item :value=1>
                    <orthology-information-view ko-id="K01595"/>
                </v-window-item>

                <v-window-item :value=2>
                    <orthology-information-view ko-id="K01086"/>
                </v-window-item>

                <v-window-item :value=3>
                    <enzyme-information-view ec-number="4.1.1.31" />
                </v-window-item>

                <v-window-item :value=4>
                    <reaction-information-view reaction-id="R00345" />
                </v-window-item>
            </v-window>
        </page-tabs>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import PageTabs from '../tabs/PageTabs.vue';
import MatchedInputInformationView from '@/views/information/MatchedInputInformationView.vue';
import OrthologyInformationView from '@/views/information/OrthologyInformationView.vue';
import EnzymeInformationView from '@/views/information/EnzymeInformationView.vue';
import ReactionInformationView from '@/views/information/ReactionInformationView.vue';

export interface Props {
    modelValue: boolean;
}

const props = defineProps<Props>();

const emits = defineEmits(['update:model-value']);

const dialogOpen = ref<boolean>(props.modelValue);

const currentTab = ref<number>(0);
const tabs = ['Matched input', 'Orthology: K01595', 'Orthology: K01086', 'Enzyme: 4.1.1.31', 'Reaction: R00345'];

const onClickOutside = () => {
    emits('update:model-value', false);
    currentTab.value = 0;
};

watch(() => props.modelValue, (value) => {
    dialogOpen.value = value;
});
</script>
