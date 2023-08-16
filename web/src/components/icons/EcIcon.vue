<template>
    <span class="icon {{ size }}" style="{ color: color }">
        EC
    </span>
</template>

<script setup lang="ts">
export type IconSize = 'x-small' | 'small' | 'default' | 'large' | 'x-large';

export interface Props {
    color?: string
    size?: IconSize
};

withDefaults(defineProps<Props>(), {
    color: 'orange',
    size: 'default'
});
</script>

<style scoped>
    .icon {
        display: flex;
        margin-inline-end: 6px;
        font-weight: bold;
        font-family: 'Courier New', Courier, monospace;
    }

    .icon.x-small {
        width: 1em !important;
        height: 1em !important;
    }

    .icon.small {
        width: 1.25em !important;
        height: 1.25em !important;
    }

    .icon.default {
        width: 1.5em !important;
        height: 1.5em !important;
    }

    .icon.large {
        width: 1.75em !important;
        height: 1.75em !important;
    }

    .icon.x-large {
        width: 2em !important;
        height: 2em !important;
    }
</style>
