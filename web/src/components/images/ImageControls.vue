<template>
    <div ref="image" class="container">
        <div class="control-bar">
            <span class="align-self-center me-1 text-caption">
                Scroll to zoom, drag to pan, click a node to reveal additional information
            </span>
            
            <tooltip message="Download the pathway as a PNG image" v-slot="{ props }">
                <v-btn v-if="download"
                    class="mx-1"
                    color="#f7f7f7"
                    density="comfortable"
                    icon="mdi-download"
                    elevation="0"
                    size="small"
                    @click="onDownload"
                    v-bind="props"
                />
            </tooltip>

            <tooltip message="Reset the pathway to its original state" v-slot="{ props }">
                <v-btn v-if="restore" 
                    class="mx-1"
                    color="#f7f7f7"
                    density="comfortable"
                    icon="mdi-restore"
                    elevation="0"
                    size="small"
                    @click="onRestore"
                    v-bind="props"
                />
            </tooltip>

            <tooltip message="Fullscreen mode" v-slot="{ props }">
                <v-btn v-if="fullscreen" 
                    class="mx-1"
                    color="#f7f7f7"
                    density="comfortable"
                    icon="mdi-fullscreen"
                    elevation="0"
                    size="small"
                    @click="onFullscreen"
                    v-bind="props"
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
import { ref, watch } from 'vue';
import { useFullscreen } from '@vueuse/core';
import { nextTick } from 'vue';
import Tooltip from '@/components/misc/Tooltip.vue';

export interface Props {
    settings?: boolean
    download?: boolean
    restore?: boolean
    fullscreen?: boolean
}

withDefaults(defineProps<Props>(), {
    settings: false,
    download: false,
    restore: false,
    fullscreen: false,
});

const emits = defineEmits(["download", "fullscreen", "restore"]);

const image = ref<HTMLElement | null>(null);

const { isFullscreen, exit, toggle } = useFullscreen(image);

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
