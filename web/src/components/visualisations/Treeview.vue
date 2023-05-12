<template>
    <div 
        class="d-flex flex-column" 
    >
        <div 
            class="d-flex"
        >
            <div v-if="level > 0" class="d-flex">
                <div v-for="line in lines">
                    <line-icon :size="size" v-if="line" />
                    <empty-icon :size="size" v-else />
                </div>

                <corner-icon :size="size" v-if="last" />

                <cross-t-icon v-if="!last" :size="size" />
                <flat-line-icon v-if="selectable && !hasChildren" :size="size" />
            </div>
            
            <close-icon v-if="hasChildren && isExpanded" style="cursor: pointer;" :size="size" @click="onClick" />
            <open-icon v-else-if="hasChildren && !isExpanded" style="cursor: pointer;" :size="size" @click="onClick" />

            <treeview-checkbox v-if="selectable && level > 0"
                v-model="itemSelected"
                :size="size"
                :disabled="selected >= maxSelected"
                @update:modelValue="onSelect"
            />

            <div 
                class="text" 
                :class="size"
                :style="{
                    'font-weight': taxon.included ? 'bold' : 'normal',
                    'color': selected >= maxSelected && !itemSelected ? '#7d7d7d' : 'black'
                }"
                @click="onClick"
            >
                {{ taxon.name }} ({{ taxon.rank }})
            </div>
        </div>
        <div v-if="isExpanded">
            <treeview v-for="child, i in taxon.children"
                :taxon="child"
                :lines="level > 0 ? [ ...lines, !last ] : lines"
                :level="level + 1"
                :size="size"
                :first="i === 0"
                :last="i === amountOfChildren - 1"
                :selectable="selectable"
                :selected="selected"
                :expanded="isExpanded"
                @add="$emit('add', $event)"
                @remove="$emit('remove', $event)"
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
import Taxon from '@/logic/entities/Taxon';

export type IconSize = 'x-small' | 'small' | 'default' | 'large' | 'x-large';

export interface Props {
    taxon: any
    lines: boolean[]

    level?: number
    expanded?: boolean
    size?: IconSize
    selectable?: boolean

    selected?: number
    maxSelected?: number

    first?: boolean
    last?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    level: 0,
    expanded: false,
    size: 'default',
    selectable: false,

    selected: 0,
    maxSelected: 4,

    first: false,
    last: false
});

const emits = defineEmits(['add', 'remove']);

const isExpanded = ref<boolean>(props.expanded);
const itemSelected = ref<boolean>(false);

const amountOfChildren = computed(() => props.taxon.children.length)

const hasChildren = computed(() => amountOfChildren.value > 0);

const onSelect = (selected: boolean) => {
    emits(selected ? "add" : "remove", new Taxon(props.taxon.id, props.taxon.name, props.taxon.rank));
};

const onClick = () => {
    if (amountOfChildren.value > 0) {
        isExpanded.value = !isExpanded.value;
    }
}
</script>

<style>
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
