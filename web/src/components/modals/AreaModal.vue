<template>
    <v-dialog
        v-model="dialogOpen"
        @click:outside="onClickOutside"
    >
        <page-tabs 
            v-model="currentTab"
            @click:close="onClickOutside"
        >
            <template #tabs>
                <page-tabs-item v-for="(item, i) of tabs" :value=i>
                    {{ item.name }}
                </page-tabs-item>
            </template>

            <template #content>
                <v-window v-model="currentTab">
                    <v-window-item v-for="(item, i) of tabs" :value=i>
                        <component :is="item.component" v-bind="item.props" />
                    </v-window-item>
                </v-window>
            </template>
        </page-tabs>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import PageTabs from '../tabs/PageTabs.vue';
import PageTabsItem from '../tabs/PageTabsItem.vue';
import MatchedInputInformationView from '@/views/information/MatchedInputInformationView.vue';
import OrthologyInformationView from '@/views/information/OrthologyInformationView.vue';
import EnzymeInformationView from '@/views/information/EnzymeInformationView.vue';
import ReactionInformationView from '@/views/information/ReactionInformationView.vue';

export interface Props {
    modelValue: boolean;
    area: any;
}

const props = defineProps<Props>();

const emits = defineEmits(['update:model-value']);

const dialogOpen = ref<boolean>(props.modelValue);

const currentTab = ref<number>(0);

const tabs = computed(() => [
    { name: 'Matched input', component: MatchedInputInformationView, props: {} },
    ...props.area.info.koNumbers.map((ko: any) => ({
        name: `Orthology: ${ko.id}`, component: OrthologyInformationView, props: { koId: ko.id }
    })),
    ...props.area.info.ecNumbers.map((ec: any) => ({
        name: `Enzyme: ${ec.id}`, component: EnzymeInformationView, props: { ecNumber: ec.id }
    })),
    ...props.area.info.reactions.map((reaction: any) => ({
        name: `Reaction: ${reaction.id}`, component: ReactionInformationView, props: { reactionId: reaction.id }
    }))
]);

const onClickOutside = () => {
    emits('update:model-value', false);
    currentTab.value = 0;
};

watch(() => props.modelValue, (value) => {
    dialogOpen.value = value;
});
</script>
