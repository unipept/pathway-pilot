<template>
    <div>
        <v-tabs v-model="currentTab" @update:model-value="onUpdateModelValue">
            <slot name="tabs"></slot>
            <div 
                class="close-button"
                @click="onClickClose"
            >
                <v-icon>mdi-close</v-icon>
            </div>
        </v-tabs>

        <v-card class="tab-content" flat>
            <slot name="content"></slot>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export interface Props {
    modelValue: number;
}

const props = defineProps<Props>();

const emits = defineEmits(['update:model-value', 'click:close']);

const currentTab = ref<number>(props.modelValue);

const onUpdateModelValue = (value: any) => {
    emits('update:model-value', value);
};

const onClickClose = () => {
    emits('click:close');
};
</script>

<style scoped>
.tab-content {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    z-index: 2;
}

.close-button {
    display: flex;
    background-color: white;
    padding-left: 12px;
    padding-right: 12px;
    align-items: center;
    justify-content: center;
    border-top-right-radius: 4px;
}
</style>
