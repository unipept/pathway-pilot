<template>
    <v-chip
        class="chip"
        :color="color"
        @click="onClick"
    >
        <ko-icon size="small" :color="color" />
        {{ name }}
    </v-chip>
</template>

<script setup lang="ts">
import { useKeggEntryLink } from '@/composables/useKeggEntryLink';
import KoIcon from '../icons/KoIcon.vue';

export interface Props {
    name: string
    color?: string
};

const props = withDefaults(defineProps<Props>(), {
    color: 'blue'
});

const { url } = useKeggEntryLink();

const onClick = () => window.open(url(props.name), '_blank');
</script>

<style scoped>
.chip {
    justify-content: center;
}

.chip:hover {
    background-color: #56b9ff;
    color: #002ed3 !important;
}

.chip:hover > .icon {
    fill: #002ed3 !important;
}
</style>
