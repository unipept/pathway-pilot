<template>
    <v-chip
        class="chip"
        :color="color"
        prepend-icon="mdi-flask-outline"
    >
        {{ name }}
    </v-chip>
</template>

<script setup lang="ts">
export interface Props {
    name: string
    color?: string
};

withDefaults(defineProps<Props>(), {
    color: 'green'
});
</script>

<style scoped>
.chip {
    width: 100px;
    justify-content: center;
}

.chip:hover {
    background-color: #addea9;
    color: #2e9825 !important;
}
</style>
