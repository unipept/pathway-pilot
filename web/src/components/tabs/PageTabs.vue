<template>
    <div>
        <div class="d-flex">
            <page-tabs-item v-for="(tab, i) of tabs"
                :key="i"
                :class="{ 'first': i === 0, 'second-to-last': i === tabs.length - 1 }"
                :active="currentTab === i"
                @click="() => onClickTab(i)"
            >
                {{ tab }}
            </page-tabs-item>
            <page-tabs-item 
                class="d-flex justify-end last" 
                :active="false"
                @click="() => onClickClose()"
            >
                <v-icon>mdi-close</v-icon>
            </page-tabs-item>
        </div>

        <v-card class="tab-content" flat>
            <slot></slot>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageTabsItem from './PageTabsItem.vue';

export interface Props {
    modelValue: number;
    tabs: string[];
}

const props = defineProps<Props>();

const emits = defineEmits(['update:model-value', 'click:close']);

const currentTab = ref<number>(props.modelValue);

const onClickTab = (index: number) => {
    currentTab.value = index;
    emits('update:model-value', index);
};

const onClickClose = () => {
    emits('click:close');
}
</script>

<style scoped>
.tab-content {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    z-index: 2;
}
</style>
