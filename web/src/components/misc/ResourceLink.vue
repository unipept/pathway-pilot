<template>
    <a :href="url" target="_blank">
        <slot></slot>
    </a>
</template>

<script setup lang="ts">
export interface Props {
    url: string;
};

defineProps<Props>();
</script>

<style scoped>
a {
    color: #44a2f4;
    text-decoration: none;
}

a:hover {
    color: #1b85e3 !important;
    text-decoration: none;
}

a:visited {
    color: #44a2f4;
    text-decoration: none;
}
</style>
