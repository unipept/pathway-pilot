<template>
    <div class="icon" :class="size" :style="{'fill': color}">
        <svg width="100%" height="100%" viewBox="0 0 975 1004" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/"
            style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:1.5;">
            <g transform="matrix(1,0,0,1,-1181.1,-442.978)">
                <path d="M1653.54,472.441L1653.54,944.882" style="fill:none;stroke:black;stroke-width:41.67px;" />
                <g transform="matrix(1,0,0,1,-2.27374e-13,472.441)">
                    <path d="M1653.54,472.441L1653.54,944.882" style="fill:none;stroke:black;stroke-width:41.67px;" />
                </g>
                <path d="M1653.54,944.882L2300.98,944.882" style="fill:none;stroke:black;stroke-width:41.67px;" />
            </g>
        </svg>
    </div>
</template>

<script setup lang="ts">
export type IconSize = 'x-small' | 'small' | 'default' | 'large' | 'x-large';

export interface Props {
    color?: string
    size?: IconSize
};

withDefaults(defineProps<Props>(), {
    color: 'black',
    size: 'default'
});
</script>

<style scoped>
    .icon {
        display: flex;
    }

    .icon.x-small {
        width: 1em !important;
        height: 1em !important;
    }

    .icon.small {
        width: 1.25em !important;
        height: 1.25em !important;
    }

    .icon.default {
        width: 1.5em !important;
        height: 1.5em !important;
    }

    .icon.large {
        width: 1.75em !important;
        height: 1.75em !important;
    }

    .icon.x-large {
        width: 2em !important;
        height: 2em !important;
    }
</style>

