<template>
    <div ref="tooltip" class="tooltip">
        <slot></slot>
        <span
            ref="tooltipText"
            class="tooltip-text"
            :style="{
                top: top + 'px',
                left: left + 'px',
                maxWidth: props.maxWidth + 'px'
            }"
        >
            {{ message }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

export interface Props {
    message: string,

    offset?: number
    maxWidth?: number
};

const props = withDefaults(defineProps<Props>(), {
    offset: 0,
    maxWidth: 500
});

const tooltip = ref<HTMLElement | null>(null);
const tooltipText = ref<HTMLElement | null>(null);

const top = ref(0);
const left = ref(0);

const setTooltipPosition = () => {
    window.addEventListener('scroll', setTooltipPosition);

    if (tooltip.value && tooltipText.value) {
        const tooltipBox = tooltip.value.getBoundingClientRect();
        const tooltipTextBox = tooltipText.value.getBoundingClientRect();

        const offsetLeft = tooltipBox.left - (tooltipTextBox.width / 2)  + (tooltipBox.width / 2);
        const offsetTop  = tooltipBox.top  - tooltipTextBox.height - props.offset;

        left.value = offsetLeft;
        top.value  = offsetTop;
    }
};

onMounted(() => {
    tooltip.value?.addEventListener('mouseenter', setTooltipPosition);
    tooltip.value?.addEventListener('mouseleave', () => {
        window.removeEventListener('scroll', setTooltipPosition);
    });
    setTooltipPosition();
});

onUnmounted(() => {
    tooltip.value?.removeEventListener('mouseenter', setTooltipPosition);
    tooltip.value?.removeEventListener('mouseleave', () => {
        window.removeEventListener('scroll', setTooltipPosition);
    });
});
</script>

<style scoped>
.tooltip {
    display: inline;
}

.tooltip-text {
    display: block;
    position: fixed;
    visibility: hidden;
    text-align: center;
    background-color: black;
    opacity: 0.7;
    color: white;
    border-radius: 6px;
    padding: 5px 10px;
    font-size: small;
    height: fit-content;
    z-index: 9999;
}

.tooltip:hover .tooltip-text {
    visibility: visible;
}
</style>
