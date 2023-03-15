<template>
    <div id="svgcontainer"></div>
</template>

<script setup lang="ts">
import Pathway from "@/logic/entities/Pathway";
import * as d3 from "d3";
import { onMounted, ref, watch } from 'vue';

import { DataItem, pathwayToCategory, pathwayGroups } from "./BubblePlotInfo";

export interface Props {
    modelValue: Pathway | undefined;
    pathwayToCounts: Map<string, number>
    pathwayToName: Map<string, any>
}

const props = defineProps<Props>();

const emits = defineEmits(['update:modelValue']);

const selectedPathway = ref<Pathway | undefined>(props.modelValue);

const height = 380;

const legendRadius = 10;
const lineSize = 20;
const forceStrength = 0.03;

const groupColors = pathwayGroups.map((group, i) => {
    return d3.hsl(1.9 + i * 360 / pathwayGroups.length, 0.721, 0.747).toString();
});
groupColors[groupColors.length - 1] = d3.hsl(0, 0, 0.5).toString();

const data: DataItem[] = [];
for (const [pathway, count] of props.pathwayToCounts) {
    const category = pathwayToCategory.get(pathway) ?? "Others";
    data.push({
        'id': pathway,
        'name': props.pathwayToName.get(pathway)?.name ?? "",
        'group': pathwayGroups.indexOf(category),
        'value': count
    });
}

const radiusScale = d3
    .scalePow()
    .exponent(0.5)
    .range([2, 46])
    .domain([0, d3.max(data, (d: any) => d.value)]);

const createNodes = (rawData: any) => {
    const nodes = rawData.map((d: any) => ({
        id: d.id,
        radius: radiusScale(d.value),
        value: d.value,
        group: d.group,
        name: d.name,
        x: Math.random() * 900,
        y: Math.random() * 800
    }));

    nodes.sort((a: any, b: any) => b.value - a.value);

    return nodes;
}

const addHighlight = (id: string | undefined) => {
    d3.selectAll('.bubble')
        .filter((d: any) => d.id === id)
        .attr("stroke", "black")
        .attr('stroke-width', 2.5)
        .raise();

    selectedPathway.value = id ? new Pathway(id) : undefined;
}

const removeHighlight = () => {
    d3.selectAll('.bubble')
        .filter((d: any) => d.id === selectedPathway.value?.id)
        .attr("stroke", "none")
        .attr('stroke-width', 0)

    selectedPathway.value = undefined;
}

const toggleBubble = (d: any) => {
    d3.select(d).each((d: any) => {
        if (selectedPathway.value?.id !== d.id) {
            removeHighlight();
            addHighlight(d.id);
        } else {
            removeHighlight();
        }

        emits('update:modelValue', selectedPathway.value);
    });
};

watch(() => props.modelValue, (newVal) => {
    removeHighlight();
    addHighlight(newVal?.id);
});

onMounted(() => {
    // Insert an svg element in the template
    const svg = d3
        .select("#svgcontainer")
        .append("svg")
        .attr("width",  "100%")
        .attr("height", height);

    const width = parseInt(svg.style('width').replace('px',''));

    // Create a legend for the groups
    const legend = svg.append('g');

    // Add all group items to the legend
    pathwayGroups.forEach((group, i) => {
        legend.append('circle')
            .attr('id', `legend_${i}`)
            .attr('cx', lineSize)
            .attr('cy', lineSize + lineSize * 1.3 * i)
            .attr('r', legendRadius)
            .attr('fill', groupColors[i]);

        legend.append('text')
            .attr('x', lineSize * 2)
            .attr('y', lineSize * 1.2 + lineSize * 1.3 * i)
            .text(group)
                .attr("text-anchor", "left")
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")
                .attr("fill", "#515151");
    });

    const showDetail = (d: any) => {
        d3.select(d.target)
            .each((d: any, i: any, elements: any) => {
                // Enlarge the selected bubble
                d3.select(elements[i])
                    .attr("r", d.radius * 1.3)
                    .raise()

                // Append a tooltip box to the parent
                d3.select(elements[i].parentNode)
                    .append('rect')
                        .attr("id", "selectedBackground")
                        .attr("width", (d.name.length + 12) * 8.2)
                        .attr("height", 30)
                        .attr("x", d.x - (d.name.length + 12) * 4.1)
                        .attr("y", d.y - 20)
                        .attr("rx", 4)
                        .attr("stroke", groupColors[d.group])
                        .attr('stroke-width', 1.5)
                        .attr("fill", "white")
                        .attr("anchor", "middle")
                        .attr("style", "pointer-events: none;")
                        .attr("position", "absolute")

                // Append a text to the tooltip box
                d3.select(elements[i].parentNode)
                    .append('text')
                        .attr("id", "selectedText")
                        .attr("x", d.x)
                        .attr("y", d.y)
                        .attr("font-family", "sans-serif")
                        .attr("text-anchor", "middle")
                        .attr("style", "pointer-events: none;")
                        .attr("fill", "#515151")
                        .text(`${d.id} ${d.name}`)
            
                // Highlight the legend
                d3.select(`#legend_${d.group}`)
                    .attr('r', legendRadius * 1.3)
            });
    };

    const hideDetail = (d: any) => {
        d3.select(d.target)
            .each((d: any, i: any, elements: any) => {
                // Reset the selected bubble
                d3.select(elements[i])
                    .attr("r", d.radius)

                // Remove tooltip
                d3.select("#selectedText").remove(); 
                d3.select("#selectedBackground").remove();

                // Reset the legend
                d3.select(`#legend_${d.group}`)
                    .attr('r',legendRadius);
            });
    };

    const nodes = createNodes(data);

    // Create bubbles
    const bubbles = svg.selectAll('.bubble')
        .data(nodes, (d: any) => d.id)
        .enter()
        .append('circle')
            .classed('bubble', true)
            .attr('r', "0")
            .attr('fill', (d: any) => groupColors[d.group])
            .on('mouseover', showDetail)
            .on('mouseout', hideDetail)
            .on('click', e => toggleBubble(e.target));

    // Expand bubbles on load
    bubbles.transition()
        .duration(1000)
        .attr('r', (d: any) => d.radius);

    // Cluster all bubbles around a center
    d3.forceSimulation()
        .velocityDecay(0.2)
        .force('x', d3.forceX().strength(forceStrength).x(width  / 2 + 150))
        .force('y', d3.forceY().strength(forceStrength).y(height / 2      ))
        .force('charge', d3.forceManyBody().strength((d: any) => 
            -Math.pow(d.radius, 2.0) * forceStrength
        ))
        .on('tick', () => bubbles
            .attr('cx', (d: any) => d.x)
            .attr('cy', (d: any) => d.y))
        .nodes(nodes);
});
</script>

<style scoped>
.selected {
    stroke: black;
    stroke-width: 2.5;
}
</style>
