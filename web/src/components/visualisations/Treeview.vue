<template>
    <div 
        class="d-flex flex-column" 
    >
        <div 
            class="d-flex"
            @click="onClick"
        >
            <div class="d-flex" v-if="level > 0">
                <div v-for="line in lines">
                    <line-icon :size="size" v-if="line" />
                    <empty-icon :size="size" v-else />
                </div>

                <corner-icon :size="size" v-if="last" />
                <cross-t-icon :size="size" v-if="!last" />

                <!--<treeview-checkbox v-if="!hasChildren"
                    :size="size"  
                />-->
            </div>
            
            <close-icon style="cursor: pointer;" :size="size" v-if="hasChildren && isExpanded" />
            <open-icon style="cursor: pointer;" :size="size" v-else-if="hasChildren && !isExpanded" />

            <div class="text" :class="size">
                {{ name }}
            </div>
        </div>
        <div v-if="isExpanded">
            <treeview v-for="child, i in children"
                :name="child.name"
                :children="child.children"
                :lines="level > 0 ? [ ...lines, !last ] : lines"
                :level="level + 1"
                :size="size"
                :first="i === 0"
                :last="i === amountOfChildren - 1"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import CornerIcon from '@/components/icons/treeview/CornerIcon.vue';
import CrossTIcon from '../icons/treeview/CrossTIcon.vue';
import LineIcon from '../icons/treeview/LineIcon.vue';
import EmptyIcon from '../icons/treeview/EmptyIcon.vue';
import CloseIcon from '../icons/treeview/CloseIcon.vue';
import OpenIcon from '../icons/treeview/OpenIcon.vue';
import TreeviewCheckbox from '../inputs/TreeviewCheckbox.vue';

export type IconSize = 'x-small' | 'small' | 'default' | 'large' | 'x-large';

export interface Props {
    name: string
    children: any[]
    lines: boolean[]

    level?: number
    expanded?: boolean
    size?: IconSize

    first?: boolean
    last?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    level: 0,
    expanded: false,
    size: 'default',

    first: false,
    last: false
});

const isExpanded = ref<boolean>(props.expanded);

const amountOfChildren = computed(() => props.children.length)

const hasChildren = computed(() => amountOfChildren.value > 0);

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
