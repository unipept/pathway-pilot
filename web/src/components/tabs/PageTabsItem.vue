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
    background-color: white;
    padding: 12px;
    cursor: default;
    flex-grow: 1;
    text-align: center;
}

.item.first {
    border-top-left-radius: 4px;
}

.item.last {
    border-top-right-radius: 4px;
    flex-grow: 0;
    z-index: 2;
}

.item.second-to-last {
    box-shadow: 0px -5px 5px -5px gray inset, -5px 0px 5px -5px gray inset;
}

.item:not(.active):not(.last):not(.second-to-last) {
    box-shadow: 0px -5px 5px -5px gray inset;
}

.item:not(.active):not(.last) {
    background-color: rgb(241, 241, 241);
}

.item.active {
    box-shadow: 0px 0px 5px 0px gray;
    z-index: 1;
}
</style>
