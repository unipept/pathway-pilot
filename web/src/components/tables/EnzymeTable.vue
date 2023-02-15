<template>
    <v-card elevation="5">
        <v-card-text class="d-flex flex-wrap">
            <enzyme-chip v-for="item of items"
                :key="item.name"
                class="chip flex-grow-1"
                :name="item.name" 
                color="orange" 
            />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import EnzymeChip from '../chips/EnzymeChip.vue';

export interface Props {
    items: { name: string }[]
};

defineProps<Props>();
</script>

<style scoped>
.chip {
    margin: 2px;
}
</style>
