<template>
    <div id="svgcontainer"></div>
</template>

<script setup lang="ts">
import * as d3 from "d3";
import { onMounted } from 'vue';

import { DataItem, pathwayToCategory } from "./BubblePlotInfo";

export interface Props {
    pathwayToCounts: Map<string, number>;
}

const props = defineProps<Props>();

const pathwayGroups = [
    "Global and overview maps",
    "Carbohydrate metabolism",
    "Energy metabolism",
    "Lipid metabolism",
    "Nucleotide metabolism",
    "Amino acid metabolism",
    "Metabolism of other amino acids",
    "Glycan biosynthesis and metabolism",
    "Metabolism of cofactors and vitamins",
    "Metabolism of terpenoids and polyketides",
    "Biosynthesis of other secondary metabolites",
    "Xenobiotics biodegradation and metabolism",
    "Chemical structure transformation maps",
    "Others"
];

const width = 500;
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
        'name': 'TODO: forward map as prop',
        'group': pathwayGroups.indexOf(category),
        'value': count
    });
}

const radiusScale = d3.scalePow().exponent(0.8).range([2, 58]).domain([0, d3.max(data, (d: any) => d.value)]);

onMounted(() => {
    // Insert an svg element in the template
    const svg = d3
        .select("#svgcontainer")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create a legend for the groups
    const legend = svg.append('g');
    pathwayGroups.forEach((group, i) => {
        legend.append('circle')
            .attr('id', 'legend_' + i)
            .attr('cx', lineSize)
            .attr('cy', lineSize + lineSize * 1.3 * i)
            .attr('fill', groupColors[i])
            .attr('r', legendRadius);

        legend.append('text')
            .attr('x', lineSize * 2)
            .attr('y', lineSize * 1.2 + lineSize * 1.3 * i)
            .text(group)
            .attr('text-anchor', 'left')
            .attr('font-family', 'sans-serif')
            .attr("font-size", "14px")
            .attr("fill", "#515151");
    });

    const createNodes = (rawData: any) => {
        const nodes = rawData.map((d: any) => ({
            id: d.id,
            radius: radiusScale(d.value / (props.pathwayToCounts.get(d.id) ?? d.value)),
            value: d.value,
            group: d.group,
            name: d.name,
            x: Math.random() * 900,
            y: Math.random() * 800
        }));

        nodes.sort((a: any, b: any) => b.value - a.value);

        return nodes;
    };

    const charge = (d: any) => -Math.pow(d.radius, 2.0) * forceStrength;

    //const ticked = () => bubbles
    //  .attr('cx', (d: any) => d.x)
    //  .attr('cy', (d: any) => d.y);

    const nodes = createNodes(data);

    // Create bubbles
    let bubbles = svg
        .selectAll('.bubble')
        .data(nodes, (d: any) => d.id);

    const bubblesE = bubbles
        .enter()
        .append('circle')
        .classed('bubble', true)
        .attr('r', "0")
        .attr('fill', (d: any) => groupColors[d.group])
        //.on('mouseover', showDetail)
        //.on('mouseout', hideDetail)
        //.on('click', toggleBorder);

    // @ts-ignore
    bubbles = bubbles.merge(bubblesE);

    bubbles.transition()
        .duration(1000)
        .attr('r', (d: any) => d.radius);


    let center = { x: (width+300) / 2, y: height / 2 };

    let simulation = d3.forceSimulation()
        .velocityDecay(0.2)
        .force('x', d3.forceX().strength(forceStrength).x(center.x))
        .force('y', d3.forceY().strength(forceStrength).y(center.y))
        .force('charge', d3.forceManyBody().strength(charge))
        //.on('tick', ticked);

    simulation.nodes(nodes);
});
</script>
