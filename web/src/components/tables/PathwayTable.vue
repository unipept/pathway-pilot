<template>
    <v-card elevation="5">
        <v-card-text v-if="hasItems">
            <v-virtual-scroll :items="items" height="150">
                <template v-slot:default="{ item }">
                    <div @click="() => onClick(item.name)">
                        <pathway-chip class="ma-1 chip" :name="item.name" color="blue" /> {{ item.description }}
                    </div>
                </template>
            </v-virtual-scroll>
        </v-card-text>

        <v-card-text v-else-if="loading">
            <div class="loading-container">
                <v-progress-circular indeterminate color="secondary" />
            </div>
        </v-card-text>

        <v-card-text v-else>
            <div class="error-container text-warning">
                <v-icon class="me-2 mb-1" size="30">mdi-alert-outline</v-icon>
                There are no associated pathways to display.
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { useKeggEntryLink } from '@/composables/useKeggEntryLink';
import { computed } from 'vue';
import PathwayChip from '../chips/PathwayChip.vue';
import { PathwayTableItem } from './PathwayTableItem';

export interface Props {
    items: PathwayTableItem[]
    loading: boolean
};

const props = defineProps<Props>();

const hasItems = computed(() => props.items.length > 0);

const { url } = useKeggEntryLink();

const onClick = (item: string) => window.open(url(item), '_blank');
</script>

<style scoped>
.error-container {
    display: flex;
    flex-direction: column;
    height: 150px;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.loading-container {
    display: flex;
    flex-direction: column;
    height: 150px;
    justify-content: center;
    align-items: center;
}

:deep(.v-virtual-scroll__item):hover {
    background-color: #f4f4f4;
}

:deep(.v-virtual-scroll__item):hover .chip {
    background-color: #afcdeb;
    color: #337cbb !important;
}
</style>
