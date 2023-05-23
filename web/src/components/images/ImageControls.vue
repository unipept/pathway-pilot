<template>
    <div ref="image" class="container">
        <div class="control-bar">
            <span class="align-self-center me-1 text-caption">
                Scroll to zoom, drag to pan, click a node to reveal additional information
            </span>

            <v-btn v-if="download" 
                class="mx-1"
                density="comfortable"
                icon="mdi-download"
                elevation="0"
                size="small"
                @click="onDownload"
            />

            <v-btn v-if="restore" 
                class="mx-1"
                density="comfortable"
                icon="mdi-restore"
                elevation="0"
                size="small"
                @click="onRestore"
            />

            <v-btn v-if="fullscreen" 
                class="mx-1"
                density="comfortable"
                icon="mdi-fullscreen"
                elevation="0"
                size="small"
                @click="onFullscreen"
            />

            <v-menu v-if="settings">
                <template v-slot:activator="{ props }">
                    <v-btn
                        class="mx-1"
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
