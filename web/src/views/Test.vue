<template>
    <v-row>
        <v-col cols="6">

        </v-col>
        <v-col cols="6" class="d-flex justify-end">
            <Tooltip message="jghjdfhg jdf" class="me-5">
                <span>test</span>
            </Tooltip>
            <Tooltip message="sdfjqs qsdjfsqj sj hjshg jsg jshfg jsqhfg fjsgh jqsfhg jsqfhg qjfhg jqhfgjh dfjgh dqfjghjdfhg jdf">
                <span>test</span>
            </Tooltip>
        </v-col>
    </v-row>
    
</template>

<script lang="ts" setup>
import Treeview from '@/components/visualisations/Treeview.vue';
import { TreeviewItem } from '@/components/visualisations/TreeviewItem';
import { ref } from 'vue';
import { useTaxonomyTree } from '@/composables/useTaxonomyTree';
import { computed } from 'vue';
import { watch } from 'vue';
import Tooltip from '@/components/misc/Tooltip.vue';
</script>
