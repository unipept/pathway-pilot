<template>
    <v-chip
        class="chip"
        :color="color"
    >
        <ec-icon :color="color" />
        {{ name }}
    </v-chip>
</template>

<script setup lang="ts">
import EcIcon from '../icons/EcIcon.vue';

export interface Props {
    name: string
    color?: string
};

withDefaults(defineProps<Props>(), {
    color: 'orange'
});
</script>

<style scoped>
.chip {
    width: 100px;
    justify-content: center;
}

.chip:hover {
    background-color: #ffb856;
    color: #f16124 !important;
}

.chip:hover > .icon {
    fill: #f16124 !important;
}
</style>
