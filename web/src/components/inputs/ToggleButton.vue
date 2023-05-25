<template>
    <v-btn
        :color="color"
        :density="density"
        :icon="icon"
        :elevation="elevation"
        :size="size"
        @click="onToggle"
    />
</template>

<script setup lang="ts">
import { watch, ref, computed } from 'vue';

export interface Props {
    disabled?: boolean;
    density?: null | 'default' | 'comfortable' | 'compact';
    icon?: string;
    size?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
    elevation?: number | string;
    colorOn?: string;
    colorOff?: string;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    density: 'comfortable',
    icon: 'mdi-vector-difference',
    size: 'small',
    elevation: 0,
    colorOn: 'primary',
    colorOff: '#f7f7f7'
});

const emits = defineEmits(["toggle"]);

const active = ref<boolean>(false);

const color = computed(() => active.value ? props.colorOn : props.colorOff);

const onToggle = () => {
    if (!props.disabled) {
        active.value = !active.value;
        emits("toggle", active.value);
    }
}

watch(() => props.disabled, () => {
    active.value = false;
});
</script>
