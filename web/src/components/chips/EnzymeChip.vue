<template>
    <v-chip
        class="chip"
        :color="color"
        @click="onClick"
    >
        <ec-icon size="small" :color="color" />
        {{ name }}
    </v-chip>
</template>

<script setup lang="ts">
import { useKeggEntryLink } from '@/composables/useKeggEntryLink';
import ResourceLink from '../misc/ResourceLink.vue';
import EcIcon from '../icons/EcIcon.vue';

export interface Props {
    name: string
    color?: string
};

const props = withDefaults(defineProps<Props>(), {
    color: 'orange'
});

const { url } = useKeggEntryLink();

const onClick = () => window.open(url(props.name), '_blank');
</script>

<style scoped>
.chip {
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
