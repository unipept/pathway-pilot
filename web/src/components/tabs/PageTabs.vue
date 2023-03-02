<template>
    <v-card>
        <div class="d-flex">
            <v-tabs 
                v-model="currentTab" 
                @update:model-value="onUpdateModelValue"
                grow
                center-active
                show-arrows
            >
                <slot name="tabs"></slot>
            </v-tabs>
            <div 
                class="close-button"
                @click="onClickClose"
            >
                <v-icon>mdi-close</v-icon>
            </div>
        </div>

        <v-card flat>
            <slot name="content"></slot>
        </v-card>
    </v-card>
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
