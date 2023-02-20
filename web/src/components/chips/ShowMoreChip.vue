<template>
    <v-chip
        class="chip"
        :color="color"
    >
        Show more
    </v-chip>
</template>

<script setup lang="ts">
export interface Props {
    color?: string
};

withDefaults(defineProps<Props>(), {
    color: 'grey'
});
</script>

<style scoped>
.chip {
    justify-content: center;
}

.chip:hover {
    background-color: #e8e8e8;
    color: #3a3a3a !important;
}

</style>
