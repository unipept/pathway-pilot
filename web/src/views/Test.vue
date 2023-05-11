<template>
    <v-text-field
        class="mt-3 mb-n3"
        v-model="search"
        label="Search for an identifier or name"
        prepend-inner-icon="mdi-magnify"
        variant="solo"
        density="comfortable"
    />

    <treeview 
        :name="test.name" 
        :children="test.children" 
        :lines="[]"
        size="default"
        expanded
        selectable
    />
</template>

<script lang="ts" setup>
import Treeview from '@/components/visualisations/Treeview.vue';
import { ref } from 'vue';

const search = ref<string>("");

const test = {
    name: "Pathway maps",
    children: [
        { name: "Metabolism", children: [
            { name: "Global and overview maps", children: [
                { name: "Metabolic pathways", children: [] },
                { name: "Biosynthesis of secondary metabolites", children: [] },
                { name: "Microbial metabolism in diverse environments", children: [] },
                { name: "Carbon metabolism", children: [] },
                { name: "2-Oxocarboxylic acid metabolism", children: [] },
                { name: "Fatty acid metabolism", children: [] },
                { name: "Biosynthesis of amino acids", children: [] },
                { name: "Nucleotide metabolism", children: [] },
                { name: "Biosynthesis of nucleotide sugars", children: [] },
                { name: "Biosynthesis of cofactors", children: [] },
                { name: "Degradation of aromatic compounds", children: [] }
            ]},
            { name: "Carbohydrate metabolism", children: [
                { name: "Glycolysis / Gluconeogenesis", children: [] },
                { name: "Citrate cycle (TCA cycle)", children: [] },
                { name: "Pentose phosphate pathway", children: [] },
                { name: "Pentose and glucuronate interconversions", children: [] },
                { name: "Fructose and mannose metabolism", children: [] },
                { name: "Galactose metabolism", children: [] },
                { name: "Ascorbate and aldarate metabolism", children: [] },
                { name: "Starch and sucrose metabolism", children: [] },
                { name: "Amino sugar and nucleotide sugar metabolism", children: [] },
                { name: "Pyruvate metabolism", children: [] },
                { name: "Glyoxylate and dicarboxylate metabolism", children: [] },
                { name: "Propanoate metabolism", children: [] },
                { name: "Butanoate metabolism", children: [] },
                { name: "C5-Branched dibasic acid metabolism", children: [] },
                { name: "Inositol phosphate metabolism", children: [] },
            ]}
        ]}
    ]
}
</script>
