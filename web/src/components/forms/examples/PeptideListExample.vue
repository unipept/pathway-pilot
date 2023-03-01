<template>
    <v-card class="example-card" flat>
        <v-card-title class="text-overline mb-n2">Example</v-card-title>
        <v-card-text>
            <v-textarea 
                v-model="exampleString"
                rows=4
                filled
                readonly 
                dense
                no-resize
                persistent-counter
                :counter-value="() => example.length"
            />
        </v-card-text>

        <v-btn
            class="ma-3 mt-0 float-right"
            color="primary"
            variant="outlined"
            :disabled="disabled"
            @click="onTryOut"
        >
            Try out
        </v-btn>
    </v-card>
</template>

<script setup lang="ts">
export interface Props {
    disabled?: boolean
};

const props = withDefaults(defineProps<Props>(), {
    disabled: false
});

const emits = defineEmits(["try-out"]);

const example = [
    "AIESPIYHIAANAGIEGSVIINK",
    "IIIGDDEHGWDDEGVFNFEGGCYAK",
    "MEVAVGDKVIYSK",
    "TEGNYVVVNYSAEPATSDELDR"
];

const exampleString = example.join("\n");

const onTryOut = () => {
    emits("try-out", example);
};
</script>

<style scoped>
.example-card {
    background-color: rgb(244, 244, 244);
}
</style>
