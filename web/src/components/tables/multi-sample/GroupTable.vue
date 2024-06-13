<template>
    <v-card v-for="group, i in items" class="mb-3">
        <v-card-text>
            <v-card
                class="mb-2"
                width="300"
                variant="outlined"
                color="primary"
                flat
            >
                <v-card-text class="d-flex pa-2 align-center">
                    <v-text-field
                        v-model="group.name"
                        class="mt-n5 me-2"
                        variant="underlined"
                        hide-details
                        @update:model-value="onUpdateGroupName(i, $event)"
                    />

                    <tooltip message="Remove this group and samples">
                        <v-icon color="error" @click="() => onRemoveGroup(i)">mdi-delete</v-icon>
                    </tooltip>
                </v-card-text>
            </v-card>

            <sample-table 
                class="ms-10"
                :items="group.items"
                :max="max"
                @add:sample="() => onAddSample(i)"
                @add:samples="(files) => onAddSamples(i, files)"
                @remove:sample="(sampleIndex) => onRemoveSample(i, sampleIndex)"
                @update:sample="(sampleIndex, name) => onUpdateSampleName(i, sampleIndex, name)"
            />
        </v-card-text>
    </v-card>

    <v-btn v-if="canAddGroup" class="me-3" color="primary" @click="onAddGroup">
        <v-icon>mdi-plus</v-icon>
        <span class="ms-1">Add another group</span>
    </v-btn>

    <v-btn v-if="canAddGroup" class="me-3" variant="outlined" color="primary" @click="onLoadDemo">
        <span class="ms-1">Load examples</span>
    </v-btn>
</template>

<script setup lang="ts">
import Tooltip from '@/components/misc/Tooltip.vue';
import { GroupTableItem } from './GroupTableItem';
import SampleTable from './SampleTable.vue';
import { computed, ref } from 'vue';

export interface Props {
    items: GroupTableItem[]
    max: number
}

const props = withDefaults(defineProps<Props>(), {
    max: 4
});

const emits = defineEmits([
    'add:group',
    'add:sample',
    'add:samples',
    'remove:group',
    'remove:sample',
    'update:group:name',
    'update:sample:name',
    'load:demo'
]);

const canAddGroup = computed(() => props.items.length < props.max);

const onAddSample = (groupIndex: number) => {
    emits('add:sample', groupIndex);
}

const onAddSamples = (groupIndex: number, files: File[]) => {
    emits('add:samples', groupIndex, files);
}

const onAddGroup = () => {
    emits('add:group');
}

const onRemoveSample = (groupIndex: number, sampleIndex: number) => {
    emits('remove:sample', groupIndex, sampleIndex);
}

const onRemoveGroup = (groupIndex: number) => {
    emits('remove:group', groupIndex);
}

const onUpdateGroupName = (groupIndex: number, name: string) => {
    emits('update:group:name', groupIndex, name);
}

const onUpdateSampleName = (groupIndex: number, sampleIndex: number, name: string) => {
    emits('update:sample:name', groupIndex, sampleIndex, name);
}

const onLoadDemo = () => {
    emits('load:demo');
}
</script>
