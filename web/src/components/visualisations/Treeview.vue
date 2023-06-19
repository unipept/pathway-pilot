<template>
    <div class="d-flex flex-column">
        <div class="d-flex">
            <div v-if="depth > 0" class="d-flex">
                <div v-for="line in lines">
                    <line-icon  v-if="line" :size="size" />
                    <empty-icon v-else      :size="size" />
                </div>

                <corner-icon v-if="last" :size="size" />

                <cross-t-icon   v-if="!last"                      :size="size" />
                <flat-line-icon v-if="selectable && !hasChildren" :size="size" />
            </div>
            
            <close-icon v-if="hasChildren && isExpanded" 
                style="cursor: pointer;" 
                :size="size"
                @click="onClick" 
            />
            <open-icon v-else-if="hasChildren && !isExpanded" 
                style="cursor: pointer;" 
                :size="size" 
                @click="onClick"
            />

            <treeview-checkbox v-if="selectable && depth > 0"
                v-model="itemSelected"
                :size="size"
                :disabled="selectedItems.length >= max"
            />

            <div
                class="text" 
                :class="size"
                :style="{
                    'font-weight': node.highlighted ? 'bold' : 'normal',
                    'color': selectedItems.length >= max && !itemSelected ? '#7d7d7d' : 'black'
                }"
                @click="onClick"
            >
                <span v-if="node.match">
                    <span>{{ node.name.slice(0, node.match.start) }}</span>
                    <span :style="{ 'color': '#306ccf' }">
                        {{ node.name.slice(node.match.start, node.match.end) }}
                    </span>
                    <span>{{ node.name.slice(node.match.end) }}</span>
                    <span> ({{ node.nameExtra }})</span>
                </span>
                <span v-else> {{ node.name }} ({{ node.nameExtra }}) </span>
            </div>
        </div>

        <div v-if="isExpanded">
            <treeview v-for="child, i in node.children"
                v-model="selectedItems"
                :node="child"
                :lines="depth > 0 ? [ ...lines, !last ] : lines"
                :depth="depth + 1"
                :size="size"
                :first="i === 0"
                :last="i === amountOfChildren - 1"
                :max="max"
                @update:modelValue="$emit('update:modelValue', $event)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import CornerIcon from '@/components/icons/treeview/CornerIcon.vue';
import CrossTIcon from '../icons/treeview/CrossTIcon.vue';
import FlatLineIcon from '../icons/treeview/FlatLineIcon.vue';
import LineIcon from '../icons/treeview/LineIcon.vue';
import EmptyIcon from '../icons/treeview/EmptyIcon.vue';
import CloseIcon from '../icons/treeview/CloseIcon.vue';
import OpenIcon from '../icons/treeview/OpenIcon.vue';
import TreeviewCheckbox from '../inputs/TreeviewCheckbox.vue';
import { TreeviewItem } from './TreeviewItem';
import Size from '@/types/Size';

export interface Props {
    modelValue: TreeviewItem[]

    node: TreeviewItem
    lines?: boolean[]

    depth?: number
    expanded?: boolean
    size?: Size
    first?: boolean
    last?: boolean
    max?: number
}

const props = withDefaults(defineProps<Props>(), {
    lines: () => [],

    depth: 0,
    expanded: false,
    size: 'default',
    first: false,
    last: false,
    max: 0
});

const emits = defineEmits(['update:modelValue']);

const selectedItems = ref<TreeviewItem[]>(props.modelValue);

const isExpanded = ref<boolean>(props.expanded);
const itemSelected = ref<boolean>(props.modelValue.some(item => item.id === props.node.id));

const selectable = computed(() => props.max > 0);

const amountOfChildren = computed(() => props.node.children.length)

const hasChildren = computed(() => amountOfChildren.value > 0);

const onClick = () => {
    isExpanded.value = !isExpanded.value;
}

watch(() => itemSelected.value, (newValue) => {
    if (newValue) {
        selectedItems.value = [ ...selectedItems.value, props.node ];
    } else {
        selectedItems.value = selectedItems.value.filter(item => item.id !== props.node.id);
    }
    emits('update:modelValue', selectedItems.value);
});

watch(() => props.modelValue, (newValue) => {
    selectedItems.value = newValue;
    itemSelected.value = newValue.some(item => item.id === props.node.id);
});
</script>

<style scoped>
.text {
    padding-left: 4px;
}

.text.x-small {
    font-size: x-small !important;
}

.text.small {
    font-size: small !important;
}

.text.default {
    font-size: normal !important;
}

.text.large {
    font-size: large !important;
}

.text.x-large {
    font-size: x-large !important;
}
</style>
