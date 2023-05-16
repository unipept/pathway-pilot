<template>
    <check-box-icon v-if="!ticked" 
        :size="size" 
        :fill="disabled ? '#f7f7f7' : 'none'"
        :stroke="disabled ? '#7d7d7d' : 'black'"
        @click="onClick"
    />
    <check-box-ticked-icon v-else :size="size" @click="onClick" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CheckBoxIcon from '@/components/icons/treeview/CheckBoxIcon.vue';
import CheckBoxTickedIcon from '@/components/icons/treeview/CheckBoxTickedIcon.vue';
import Size from '@/types/Size';
import { watch } from 'vue';

export interface Props {
    modelValue: boolean
    size?: Size
    disabled?: boolean
};

const props = withDefaults(defineProps<Props>(), {
    size: 'default',
    disabled: false
});

const emit = defineEmits(['update:modelValue']);

const ticked = ref<boolean>(props.modelValue);

const onClick = () => {
    if (ticked.value) {
        ticked.value = !ticked.value;
        emit('update:modelValue', ticked.value);
    } else if(!props.disabled) {
        ticked.value = !ticked.value;
        emit('update:modelValue', ticked.value);
    }
};

watch(() => props.modelValue, (newVal) => {
    ticked.value = newVal;
});
</script>
