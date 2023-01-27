<template>
    <svg width="100%" height="100%">
        <g v-for="area in areas.filter(a => a.shape === 'rect')">
            <rect v-for="rect in splitRectangle(area, 3)"
                :x="rect.x1 * scale"
                :y="rect.y1 * scale"
                :width="(rect.x2 - rect.x1) * scale"
                :height="(rect.y2 - rect.y1) * scale"
                :fill="rect.color"
                fill-opacity="0.3"
                :onclick="onClick"
            />
        </g>

        <circle v-for="area in areas.filter(a => a.shape === 'circle')"
            :cx="area.x * scale"
            :cy="area.y * scale"
            :r="area.r * scale"
            fill="red"
            fill-opacity="0.1"
            :onclick="onClick"
        />
    </svg>
</template>

<script setup lang="ts">
export interface Props {
    areas: any[];
    scale: number;
    onClick: () => void;
};

defineProps<Props>();

const splitRectangle = (rectangle: any, parts: number) => {
    const width = rectangle.x2 - rectangle.x1;
    const widthDelta = width / parts;

    const rectangles = [];

    const colors = [
        "red",
        "green",
        "blue",
        "purple",
    ];

    for (let i = 0; i < parts; i++) {
        rectangles.push({
            x1: rectangle.x1 + widthDelta * i,
            y1: rectangle.y1,
            x2: rectangle.x1 + widthDelta * (i + 1),
            y2: rectangle.y2,
            shape: "rect",
            color: colors[i],
        });
    }

    return rectangles;
}
</script>
