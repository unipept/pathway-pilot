<template>
    <div ref="image" class="container">
        <div class="control-bar">
            <span class="align-self-center me-1 text-caption font-weight-medium">
                Scroll to zoom, drag to pan, click a node to reveal additional information
            </span>
            
            <tooltip message="Download the pathway as a PNG image">
                <v-btn v-if="download"
                    class="mx-1"
                    color="#f7f7f7"
                    density="comfortable"
                    icon="mdi-download"
                    elevation="0"
                    size="small"
                    @click="onDownload"
                />
            </tooltip>

            <tooltip message="Reset the pathway to its original state">
                <v-btn v-if="restore" 
                    class="mx-1"
                    color="#f7f7f7"
                    density="comfortable"
                    icon="mdi-restore"
                    elevation="0"
                    size="small"
                    @click="onRestore"
                />
            </tooltip>

            <tooltip message="Fullscreen mode">
                <v-btn v-if="fullscreen" 
                    class="mx-1"
                    color="#f7f7f7"
                    density="comfortable"
                    icon="mdi-fullscreen"
                    elevation="0"
                    size="small"
                    @click="onFullscreen"
                />
            </tooltip>

            <tooltip :message="abundanceTooltip">
                <toggle-button v-if="abundance"
                    class="mx-1"
                    :style="{
                        color: abundanceDisabled ? '#ededed' : ''
                    }"
                    :disabled="abundanceDisabled"
                    @toggle="onAbundance"
                />
            </tooltip>

            <tooltip message="Apply filters">
                <v-btn v-if="filter"
                    class="mx-1"
                    density="comfortable"
                    icon="mdi-filter-outline"
                    elevation="0"
                    size="small"
                    :color="filterActive ? 'primary' : ''"
                    @click="onFilter"
                />
            </tooltip>

            <v-menu v-if="settings">
                <template v-slot:activator="{ props }">
                    <v-btn
                        class="mx-1"
                        color="#f7f7f7"
                        density="comfortable"
                        icon="mdi-cog-outline"
                        elevation="0"
                        size="small"
                        v-bind="props"
                    />
                </template>
                <v-list>
                    <slot name="settings"></slot>
                    <div>
                        qsdfgkqhsjdgf
                    </div>
                </v-list>
            </v-menu>
        </div>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFullscreen } from '@vueuse/core';
import Tooltip from '@/components/misc/Tooltip.vue';
import ToggleButton from '../inputs/ToggleButton.vue';
import { computed } from 'vue';

export type ToggleButtonValue = boolean | 'disabled';
export type ActiveButtonValue = boolean | 'active';

export interface Props {
    settings?: boolean
    download?: boolean
    restore?: boolean
    fullscreen?: boolean
    abundance?: ToggleButtonValue
    filter?: ActiveButtonValue
}

const props = withDefaults(defineProps<Props>(), {
    settings: false,
    download: false,
    restore: false,
    fullscreen: false,
    abundance: false,
    filter: false
});

const emits = defineEmits(["download", "fullscreen", "restore", "abundance", "filter"]);

const image = ref<HTMLElement | null>(null);

const { isFullscreen, exit, toggle } = useFullscreen(image);

const abundanceDisabled = computed(() => props.abundance === 'disabled');
const filterActive = computed(() => props.filter === 'active');

const abundanceTooltip = computed(() => {
    if (abundanceDisabled.value) {
        return "Select two groups to show the differential abundances";
    }
    return `Toggle differential abundances`;
});

const onFullscreen = () => {
    toggle();
    emits("fullscreen");
}

const onDownload = () => {
    if (isFullscreen.value) {
        exit();
    }
    emits("download");
}

const onRestore = () => {
    emits("restore");
}

const onAbundance = (toggled: boolean) => {
    emits("abundance", toggled);
}

const onFilter = () => {
    emits("filter");
}
</script>

<style scoped>
.container {
    background-color: white;
}

.control-bar {
    width: 100%;
    background-color: #EDEDED;
    padding: 8px;
    display: flex;
    justify-content: end;
    align-self: center;
}
</style>
