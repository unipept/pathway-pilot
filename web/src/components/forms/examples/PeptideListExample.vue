<template>
    <div>
        <div class="text-overline mb-n2">Example</div>

        <v-textarea 
            v-model="example"
            rows=4
            filled
            readonly 
            dense
            hide-details 
            no-resize
        />

        <span class="font-weight-bold text-caption">Info: </span>
        <span class="text-caption">UniPept works with peptides of length 5 - 50, shorter / longer peptides will be ignored.</span>
    </div>
</template>

<script setup lang="ts">
const example = [
    "AIESPIYHIAANAGIEGSVIINK",
    "IIIGDDEHGWDDEGVFNFEGGCYAK",
    "MEVAVGDKVIYSK",
    "TEGNYVVVNYSAEPATSDELDR"
].join("\n");
</script>
