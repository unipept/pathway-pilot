<template>
    <div class="icon default" :style="{'fill': color}">
        <svg 
            width="100%"
            height="100%" 
            viewBox="0 0 546 368" 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            xml:space="preserve" 
            xmlns:serif="http://www.serif.com/"
            fill-rule="evenodd"
            clip-rule="evenodd"
            stroke-linejoin="round"
            stroke-miterlimit="2"
        >
            <text 
                x="-23.958px" 
                y="360.484px"
                font-family="AkayaTelivigala-Regular, Akaya Telivigala"
                font-size="557.162px"
            >
                E<tspan x="241.251px" y="360.484px">C</tspan>
            </text>
        </svg>
    </div>
</template>

<script setup lang="ts">
export type IconSize = 'x-small' | 'small' | 'default' | 'large' | 'x-large';

export interface Props {
    color?: string
    size?: IconSize | number
};

withDefaults(defineProps<Props>(), {
    color: 'orange',
    size: 'default'
});
</script>

<style scoped>
    .icon {
        display: flex;
        margin-inline-end: 6px;
    }
    .icon.default {
        width: 21px !important;
        height: 21px !important;
    }
</style>
