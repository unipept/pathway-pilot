<template>
    <check-box-icon v-if="!ticked" :size="size" @click="onClick" />
    <check-box-ticked-icon v-else :size="size" @click="onClick" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CheckBoxIcon from '@/components/icons/treeview/CheckBoxIcon.vue';
import CheckBoxTickedIcon from '@/components/icons/treeview/CheckBoxTickedIcon.vue';

export type IconSize = 'x-small' | 'small' | 'default' | 'large' | 'x-large';

export interface Props {
    modelValue: boolean,
    size?: IconSize
};

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    size: 'default'
});

const emit = defineEmits(['update:modelValue']);

const ticked = ref<boolean>(props.modelValue);

const onClick = () => {
    ticked.value = !ticked.value;
    emit('update:modelValue', ticked.value);
};
</script>
