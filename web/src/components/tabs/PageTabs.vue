<template>
    <div>
        <div class="d-flex">
            <page-tabs-item v-for="(tab, i) of tabs"
                :key="i"
                :class="{ 'ms-1': i !== 0 }"
                :active="currentTab === i"
                @click="() => onClickTab(i)"
            >
                {{ tab }}
            </page-tabs-item>
        </div>

        <v-card flat>
            <v-card-text>
                <slot></slot>
            </v-card-text>
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

const emits = defineEmits(['update:model-value']);

const currentTab = ref<number>(props.modelValue);

const onClickTab = (index: number) => {
    currentTab.value = index;
    emits('update:model-value', index);
};
</script>
