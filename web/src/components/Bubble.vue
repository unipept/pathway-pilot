<template>
  <div id="app">
    <div id="svgcontainer"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { pathway_counts } from "../dummyData";
import { pathway2count,pathwayID2cat, pathwayID2name} from "../currentData";

export default {
  name: "Bubble",
  mounted() {
    const width = 1000;
    
    const height = 450;
    const svg = d3
        .select("#svgcontainer")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    let inputData = [];
    const groupArray = [
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
    ]
    for (let p in pathway_counts) {
        inputData.push(
        {'id':p, 
            'groupname': pathwayID2cat[p], 
            'name': pathwayID2name[p],
        'group':groupArray.indexOf(pathwayID2cat[p]),
        'value':pathway_counts[p]} 
        )

    };
    const legend_radius = 10;
    const line_size = 20;


    let fillColor = {};
    const noColor = groupArray.length -1 ;
    for (let i = 0 ;i < noColor;i++){
        fillColor[i] = d3.hsl(1.9+i*360/noColor, 0.721, 0.747);
    }

    fillColor[noColor] = 'grey'

    let legend = svg.append('g');
    groupArray.forEach(function (g, i) {

    legend.append('circle')
        .attr('id', 'legend_'+i)
        .attr('cx', line_size)
        .attr('cy', line_size+line_size*1.3*i)
        .attr('fill', fillColor[i])
        .attr('r',legend_radius)
    legend.append('text')
        .attr('x', line_size*2)
        .attr('y', line_size*1.2+line_size*1.3*i)
        .text(groupArray[i])
        .attr('text-anchor', 'left')
        .attr('font-family', 'sans-serif')
        .attr("font-size", "14px")
        .attr("fill", "#515151");;
    });
    
    
    let bubbles = null;
    let nodes = [];
    let forceStrength = 0.03;
    let center = { x: (width+400) / 2, y: height / 2 };

    // return fillColor;
    function createNodes(rawData) {
    
        let maxAmount = d3.max(rawData, function (d) { return +d.value/pathway2count[d.id]; });
        // let minAmount = d3.min(rawData, function (d) { return +d.value/pathway2count[d.id]; });
        // console.log(minAmount);
        // Sizes bubbles based on area.
        // @v4: new flattened scale names.
        let radiusScale = d3.scalePow()
        .exponent(0.8)
        .range([2, 58])
        .domain([0, maxAmount]);

        // Use map() to convert raw data into node data.
        // Checkout http://learnjsdata.com/ for more on
        // working with data.
        let myNodes = rawData.map(function (d) {
        return {
            id: d.id,
            radius: radiusScale(+d.value/pathway2count[d.id]),
            value: +d.value,
            group: d.group,
            name: d.name,
            x: Math.random() * 900,
            y: Math.random() * 800
        };
    });

    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return a.value - b.value; });

    return myNodes;
  }

  function charge(d) {
    return -Math.pow(d.radius, 2.05) * forceStrength;
  }

  function ticked() {
    bubbles
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }
  
  function showDetail(d) {
  // change outline to indicate hover state.
    d3.select(this)//.attr('stroke', 'black')
      .each(function(d){
        d3.select(this)
          .attr("r", d.radius*1.3)
          .raise()
        d3.select(this.parentNode)
          .append('rect')
          .attr("rx", 4)
          .attr("id", 'selectedBackground')
          .attr("stroke",fillColor[d.group])
          .attr('stroke-width', 1.5)
          .attr('x', d.x-(d.name.length+ 10)*4.1)
          .attr('y', d.y-20)
          .attr('width',(d.name.length+10)*8.2)
          .attr('height',30)
          .attr("fill", "white")
          .attr("anchor", "middle")
          .attr("style", "pointer-events: none;")
        d3.select(this.parentNode)
          .append('text')
          .attr("id", 'selectedText')
          .attr('x', d.x)
          .attr('y', d.y)
          .attr("font-family", "sans-serif")
          .attr("text-anchor", "middle")
          .attr("style", "pointer-events: none;")
          .attr("fill", "#515151")
          .text(d.name + ' (' + d.value + ' / ' + pathway2count[d.id] + ')')
       d3.select('#legend_'+d.group)
          .attr('r',legend_radius*1.3)
          // .attr('stroke', 'black');
      });
  };
  
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .each(function(d){
        d3.select(this)
          .attr("r", d.radius)
        d3.select("#selectedText").remove(); 
        d3.select("#selectedBackground").remove();
        d3.select('#legend_'+d.group)
          .attr('r',legend_radius);
          // .attr('stroke', d3.rgb(fillColor(d.group)).darker());
      })
  };
  
  let simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);

  
  // simulation.stop();
  nodes = createNodes(inputData);
  bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });
  let bubblesE = bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', "0")
      .attr('fill', function (d) { return fillColor[d.group]; })
      // .attr('stroke', function (d) { return d3.rgb(fillColor[d.group]).darker(); })
      // .attr('stroke-width', 2)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);

    // @v4 Merge the original empty selection and the enter selection
  bubbles = bubbles.merge(bubblesE);
  bubbles.transition()
    .duration(1000)
    .attr('r', function (d) { return d.radius; });
  
  simulation.nodes(nodes);

}}
;
</script>