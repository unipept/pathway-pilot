<template>
    <svg width="100%" height="100%" version="1.1" overflow="visible">
        <rect class="border" width="100%" height="100%" fill="none" />

        <g v-for="area, i in rectangles.filter(a => isSelectable(a))"
            :transform="`scale(${scale})`"
            :onclick="() => onClickArea(area)"
            :onmouseenter="() => onMouseEnter(i)"
            :onmouseleave="onMouseLeave"
            cursor="pointer"
        >
            <rect v-for="rect in splitRectangle(area, area.colors.length)"
                :x="rect.x1"
                :y="rect.y1"
                :width="(rect.x2 - rect.x1)"
                :height="(rect.y2 - rect.y1)"
                :fill="rect.color"
                :fill-opacity="0.5"
            />

            <rect
                :x="area.x1"
                :y="area.y1"
                :width="(area.x2 - area.x1)"
                :height="(area.y2 - area.y1)"
                fill="transparent"
                :filter="area.id === selectedArea?.id ? 'drop-shadow(0 0 10px rgba(48, 108, 207, 1))' : ''"
                :stroke="area.id === selectedArea?.id ? '#306ccf' : ''"
                :stroke-opacity="area.id === selectedArea?.id ? 0.8 : 0"
                :stroke-width="area.id === selectedArea?.id ? 3 : 0"
            />
        </g>

        <g v-for="area in emptyPolygons"
            :transform="`scale(${scale})`"
            :onclick="() => onClickArea(area)"
        >
            <polygon :points="area.points" :fill="polygons.length > 20 ? '#e3e3e3' : 'transparent'" />
        </g>

        <g v-for="area in coloredPolygons"
            :transform="`scale(${scale})`"
            :onclick="() => onClickArea(area)"
        >
            <defs>
                <linearGradient v-if="area.colors.length > 1" 
                    id="multi-gradient" x1="0%" y1="0%" x2="100%" y2="0%"
                >
                    <template v-for="(color, i) in area.colors">
                        <stop
                            :offset="`${i * 100 / area.colors.length}%`"
                            :stop-color="color"
                            stop-opacity="1"
                        />
                        <stop
                            :offset="`${(i + 1) * 100 / area.colors.length}%`"
                            :stop-color="color"
                            stop-opacity="1"
                        />
                    </template>
                </linearGradient>
            </defs>

            <polygon
                :points="area.points"
                :fill="area.colors.length === 1 ? area.colors[0] : 'url(#multi-gradient)'"
            />
        </g>

        <g v-for="area, i in circles"
            class="group"
            :transform="`scale(${scale})`"
            :onclick="() => onClickCompound(area)"
            :onmouseenter="() => onMouseEnter(i + 123456)"
            :onmouseleave="onMouseLeave"
        >
            <circle
                class="group-item group-item-trans"
                :cx="area.x + 1"
                :cy="area.y + 1"
                :r="area.r"
                fill="white"
                :stroke="polygons.length > 20 ? '#e3e3e3' : 'black'"
                :stroke-width="polygons.length > 20 ? 5 : 2"
            />
        </g>

        <g v-for="tt, i in rectangles.filter(a => isSelectable(a)).map(a => tooltip(a))"
            :transform="`scale(${scale})`"
        >
            <rect v-if="areaHover === i"
                :x="tt.boundingX"
                :y="tt.boundingY"
                :width="tt.boundingWidth"
                :height="tt.boundingHeight"
                fill="black"
                stroke="black"
                opacity="0.7"
                rx="15"
            />

            <text v-if="areaHover === i"
                :x="tt.boundingX"
                :y="tt.boundingY"
                font-size="26"
                font-family="monospace"
                dominant-baseline="hanging"
                fill="white"
            >
                <tspan v-for="t, j in tt.text"
                    :x="tt.textX"
                    :y="tt.textY + tt.textOffset * j"
                > {{ t }} </tspan>
            </text>
        </g>
    </svg>
</template>

<script setup lang="ts">
import useKeggStore from '@/stores/KeggStore';
import { computed, onBeforeMount, ref, watch } from 'vue';

export interface Props {
    area: any
    compound: string

    areas: any[]
    scale: number
};

const props = defineProps<Props>();

const emits = defineEmits(['update:area', 'update:compound']);

const keggStore = useKeggStore();

const selectedArea = ref<any>(props.area);
const selectedCompound = ref<string>(props.compound);

const areaHover = ref<number | undefined>(undefined);

const rectangles = computed(() => props.areas.filter(a => a.shape === 'rect'));
const circles = computed(() => props.areas.filter(a => a.shape === 'circle'));

const polygons = computed(() => props.areas.filter(a => a.shape === 'poly'));
const coloredPolygons = computed(() => polygons.value.filter(a => a.colors.length > 0));
const emptyPolygons = computed(() => polygons.value.filter(a => a.colors.length <= 0));

const tooltip = (area: any): any => {
    const [ px, py ] = [ 30, 20 ];
    const lineHeight = 22;
    const lineDistance = 10;
    const characterWidth = 15.8;
    const tooltipOffset = 25;

    const text = area.info.ecNumbers.map((ec: any) => `${ec.id}: ${keggStore.ecMapping?.get(ec.id)?.names[0] ?? "Unknown"}`);

    const amountOfLines = area.info.ecNumbers.length;
    const amountOfCharacters = text.reduce((a: number, b: string) => Math.max(a, b.length), 0);

    // Caclulate the width an height of the bounding box
    const boundingWidth  = 2 * px + characterWidth * amountOfCharacters;
    const boundingHeight = 2 * py + lineHeight * amountOfLines + lineDistance * (amountOfLines - 1);

    // Calculate the position of the bounding box
    const boundingX = area.x1 + (area.x2 - area.x1) / 2 - boundingWidth / 2;
    const boundingY = area.y1 - boundingHeight - tooltipOffset;

    // Calculate the position of the text
    const textX = boundingX + px;
    const textY = boundingY + py;
    const textOffset = lineHeight + lineDistance;

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

const onClickArea = (area: any) => {
    selectedArea.value = selectedArea.value?.id === area.id ? undefined : area;
    emits('update:area', selectedArea.value);
};

const onClickCompound = (area: any) => {
    selectedCompound.value = area.info.compounds[0].id;
    emits('update:compound', selectedCompound.value);
};

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
</style>
