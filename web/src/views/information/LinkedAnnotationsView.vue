<template>
    <v-card>
        <v-card-title>Your selected node is linked to {{ totalAnnotations }} annotations</v-card-title>
        <v-card-text class="mt-n2 text-subtitle-1">
            Your selected node is linked to 
            <b :style="{ color: '#ffb856' }">{{ ecAnnotations.length }} EC {{ ecAnnotations.length === 1 ? 'number' : 'numbers' }}</b>, 
            <b :style="{ color: '#56b9ff' }">{{ koAnnotations.length }} KO {{ koAnnotations.length === 1 ? 'number' : 'numbers' }}</b> and 
            <b :style="{ color: '#2e9825' }">{{ reactionAnnotations.length }} {{ reactionAnnotations.length === 1 ? 'reaction' : 'reactions' }}</b>.
            Clicking on a chip will open the corresponding KEGG entry in a new tab.
        
            <v-row class="mt-3">
                <v-col cols="4">
                    <v-card>
                        <v-card-text>
                            <enzyme-chip v-for="(ec, i) in ecAnnotations"
                                class="flex-grow-1 w-100"
                                :class="{ 'mt-2': i > 0 }"
                                size="large"
                                :key="ec" 
                                :name="ec"
                            />
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="4">
                    <v-card>
                        <v-card-text>
                            <orthology-chip v-for="(ko, i) in koAnnotations"
                                class="w-100"
                                :class="{ 'mt-2': i > 0 }"
                                size="large"
                                :key="ko" 
                                :name="ko"
                            />
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="4">
                    <v-card>
                        <v-card-text>
                            <reaction-chip v-for="(reaction, i) in reactionAnnotations"
                                class="flex-grow-1 w-100"
                                :class="{ 'mt-2': i > 0 }"
                                :key="reaction" 
                                :name="reaction"
                            />
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EnzymeChip from '@/components/chips/EnzymeChip.vue';
import OrthologyChip from '@/components/chips/OrthologyChip.vue';
import ReactionChip from '@/components/chips/ReactionChip.vue';

export interface Props {
    area: any
};

const props = defineProps<Props>();

const ecAnnotations = computed(() => [
    ...props.area.info.ecNumbers.map((ec: any) => ec.id),
]);

const koAnnotations = computed(() => [
    ...props.area.info.koNumbers.map((ko: any) => ko.id),
]);

const reactionAnnotations = computed(() => [
    ...props.area.info.reactions.map((reaction: any) => reaction.id)
]);

const totalAnnotations = computed(() => 
    ecAnnotations.value.length + koAnnotations.value.length + reactionAnnotations.value.length
);
</script>
