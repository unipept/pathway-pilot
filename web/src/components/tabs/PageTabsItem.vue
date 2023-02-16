<template>
    <div class="item" :class="{ active: active }">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
export interface Props {
    active: boolean;
}

defineProps<Props>();

</script>

<style scoped>
.item {
    width: fit-content;
    background-color: white;
    border-radius: 5px;
    padding: 12px;
    margin-bottom: 4px;
    cursor: default;
}

.item.active {
    padding-bottom: 24px;
    margin-bottom: -8px;
}
</style>
