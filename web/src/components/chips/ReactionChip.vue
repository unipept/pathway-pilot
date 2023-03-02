<template>
    <v-chip
        class="chip"
        :color="color"
        prepend-icon="mdi-flask-outline"
        @click="onClick"
    >
        {{ name }}
    </v-chip>
</template>

<script setup lang="ts">import { useKeggEntryLink } from '@/composables/useKeggEntryLink';

export interface Props {
    name: string
    color?: string
};

const props = withDefaults(defineProps<Props>(), {
    color: 'green'
});

const { url } = useKeggEntryLink();

const onClick = () => window.open(url(props.name), '_blank');
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
