<template>
    <v-tab
        class="item"
        :class="{ first: value === 0 }"
        color="secondary"
        :value="value"
    >
        <slot></slot>
    </v-tab>
</template>

<script setup lang="ts">
export interface Props {
    value: number;
}

defineProps<Props>();

</script>

<style scoped>
.item {
    background-color: white;
}

.item.first {
    border-top-left-radius: 4px !important;
}
</style>
