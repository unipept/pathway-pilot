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
                :disabled="amountSelected >= maxSelected"
                @update:modelValue="onSelect"
            />

            <div 
                class="text" 
                :class="size"
                :style="{
                    'font-weight': node.highlighted ? 'bold' : 'normal',
                    'color': amountSelected >= maxSelected && !itemSelected ? '#7d7d7d' : 'black'
                }"
                @click="onClick"
            >
                {{ node.name }} ({{ node.nameExtra }})
            </div>
        </div>

        <div v-if="isExpanded">
            <treeview v-for="child, i in node.children"
                :node="child"
                :lines="depth > 0 ? [ ...lines, !last ] : lines"
                :depth="depth + 1"
                :expanded="isExpanded"
                :size="size"
                :first="i === 0"
                :last="i === amountOfChildren - 1"
                :amountSelected="amountSelected"
                :maxSelected="maxSelected"
                @toggle-node="$emit('toggle-node', $event)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

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
    node: TreeviewItem
    lines?: boolean[]

    depth?: number
    expanded?: boolean
    size?: Size
    first?: boolean
    last?: boolean

    amountSelected?: number
    maxSelected?: number
}

const props = withDefaults(defineProps<Props>(), {
    lines: () => [],

    depth: 0,
    expanded: false,
    size: 'default',
    first: false,
    last: false,

    amountSelected: 0,
    maxSelected: 0
});

const emits = defineEmits(['toggle-node']);

const isExpanded = ref<boolean>(props.expanded);
const itemSelected = ref<boolean>(false);

const selectable = computed(() => props.maxSelected > 0);

const amountOfChildren = computed(() => props.node.children.length)

const hasChildren = computed(() => amountOfChildren.value > 0);

const onSelect = () => {
    emits('toggle-node', props.node);
};

const onClick = () => {
    isExpanded.value = !isExpanded.value;
}
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
