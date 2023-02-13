<template>
    <svg width="100%" height="100%">
        <g v-for="area in areas.filter(a => a.shape === 'rect')"
            :transform="`scale(${scale})`"
            :onclick="() => onClick(area)"
        >
            <rect v-for="rect in splitRectangle(area, area.colors.length)"
                :x="rect.x1"
                :y="rect.y1"
                :width="(rect.x2 - rect.x1)"
                :height="(rect.y2 - rect.y1)"
                :fill="rect.color"
                fill-opacity="0.5"
            />
        </g>

        <g v-for="area in areas.filter(a => a.shape === 'circle')"
            :transform="`scale(${scale})`"
            :onclick="() => onClick(area)"
        >
            <circle
                :cx="area.x"
                :cy="area.y"
                :r="area.r"
                fill="none"
                fill-opacity="0.5"
            />
        </g>

        <g v-for="area in areas.filter(a => a.shape === 'poly')"
            :transform="`scale(${scale})`"
            :onclick="() => onClick(area)"
        >
            <polygon
                :points="area.points"
                fill="green"
            />
        </g>
    </svg>
</template>

<script setup lang="ts">
export interface Props {
    areas: any[];
    scale: number;

    onClick: (area: any) => void;
};

defineProps<Props>();

const splitRectangle = (rectangle: any, parts: number) => {
    if (parts === 0) {
        rectangle.color = "transparent";
        return [rectangle];
    }

    const width = rectangle.x2 - rectangle.x1;
    const widthDelta = width / parts;

    const rectangles = [];

    for (let i = 0; i < parts; i++) {
        rectangles.push({
            x1: rectangle.x1 + widthDelta * i,
            y1: rectangle.y1,
            x2: rectangle.x1 + widthDelta * (i + 1),
            y2: rectangle.y2,
            shape: "rect",
            color: rectangle.colors[i],
        });
    }

    return rectangles;
}
</script>
