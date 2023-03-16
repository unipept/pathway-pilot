<template>
    <svg width="100%" height="100%" version="1.1">
        <rect class="border" width="100%" height="100%" fill="none" />

        <g v-for="area, i in areas.filter(a => a.shape === 'rect' && isSelectable(a))"
            class="group"
            :transform="`scale(${scale})`"
            :onclick="() => onClick(area)"
            :onmouseenter="() => onMouseEnter(i)"
            :onmouseleave="onMouseLeave"
        >
            <rect v-for="rect in splitRectangle(area, area.colors.length)"
                class="group-item"
                :class="{ 'group-item-trans': rect.color === 'transparent' }"
                :x="rect.x1"
                :y="rect.y1"
                :width="(rect.x2 - rect.x1)"
                :height="(rect.y2 - rect.y1)"
                :fill="rect.color"
                :fill-opacity="0.5"
            />
        </g>

        <g v-for="area, i in areas.filter(a => a.shape === 'circle')"
            class="group"
            :transform="`scale(${scale})`"
            :onclick="() => onClickCompound(area)"
            :onmouseenter="() => onMouseEnter(i + 123456)"
            :onmouseleave="onMouseLeave"
        >
            <circle
                class="group-item group-item-trans"
                :cx="area.x"
                :cy="area.y"
                :r="area.r"
                fill="transparent"
                fill-opacity="0.5"
            />
        </g>

        <g v-for="tt, i in areas.filter(a => a.shape === 'rect' && isSelectable(a)).map(a => tooltip(a))"
            :transform="`scale(${scale})`"
        >
            <rect v-if="areaHover === i"
                :x="tt.boundingX"
                :y="tt.boundingY"
                :width="tt.boundingWidth"
                :height="tt.boundingHeight"
                fill="white"
                stroke="black"
            />

            <text v-if="areaHover === i"
                :x="tt.boundingX"
                :y="tt.boundingY"
                font-size="26"
                font-family="monospace"
                dominant-baseline="hanging"
            >
                <tspan v-for="t, j in tt.text"
                    :x="tt.textX"
                    :y="tt.textY + tt.textOffset * j"
                > {{ t }} </tspan>
            </text>
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
import useKeggStore from '@/stores/KeggStore';
import { onBeforeMount, ref } from 'vue';

export interface Props {
    areas: any[];
    scale: number;

    onClick: (area: any) => void;
    onClickCompound: (compound: any) => void;
};

defineProps<Props>();

const keggStore = useKeggStore();

const tooltip = (area: any): any => {
    // In order to show the tooltip, we need to have the EC mapping
    if (!keggStore.ecMapping) {
        return {};
    }

    const textOffset = 40;

    const text = area.info.ecNumbers.map((ec: any) => `${ec.id}: ${keggStore.ecMapping?.get(ec.id)?.names[0] ?? "Unknown"}`);

    const boundingWidth = text.reduce((a: number, b: string) => Math.max(a, b.length), 0) * 16.5;
    const boundingHeight = area.info.ecNumbers.length * 40;

    const boundingX = area.x1 - boundingWidth / 2 + (area.x2 - area.x1) / 2;
    const boundingY = area.y1 - boundingHeight - 25;

    const textX = boundingX + 10;
    const textY = boundingY + 10;

    return {
        boundingX: boundingX,
        boundingY: boundingY,
        boundingWidth: boundingWidth,
        boundingHeight: boundingHeight,
        textX: textX,
        textY: textY,
        textOffset: textOffset,
        text: text,
    }
}

const areaHover = ref<number | undefined>(undefined);

const isSelectable = (area: any) => {
    return area.info.ecNumbers.length 
         + area.info.koNumbers.length
         + area.info.compounds.length 
         + area.info.reactions.length
         > 0;
}

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
            color: rectangle.colors[i]
        });
    }

    return rectangles;
}

const onMouseEnter = (areaId: number) => {
    areaHover.value = areaId;
}

const onMouseLeave = (e: MouseEvent) => {
    areaHover.value = undefined;
}

onBeforeMount(async () => {
    await keggStore.fetchEcMapping();
});
</script>

<style scoped>
.border {
    outline-color: white;
    outline-style: solid;
    outline-width: 6px;
    outline-offset: -3px;
}

.group:hover .group-item {
    filter: brightness(0.9);
    cursor: pointer;
}

.group:hover .group-item-trans {
    fill: rgb(226, 226, 226);
}
</style>
