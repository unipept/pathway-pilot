<template>
    <v-chip
        :class="{ 'font-weight-bold': highlight }"
        density="compact"
        :color="highlight ? highlightColor : baseColor"
    >
      {{ name }}
    </v-chip>
</template>

<script setup lang="ts">
export interface Props {
    name: string
    baseColor?: string
    highlightColor?: string
    highlight?: boolean
};

withDefaults(defineProps<Props>(), {
    baseColor: '#636363',
    highlightColor: '#65c452',
    highlight: false
});
</script>
