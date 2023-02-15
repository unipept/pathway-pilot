<template>
    <v-chip
      :color="color"
      prepend-icon="mdi-map-outline"
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
    color: 'blue'
});
</script>
