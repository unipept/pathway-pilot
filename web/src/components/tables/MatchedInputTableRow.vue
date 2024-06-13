<template>
    <tr>
        <td v-if="group">{{ group }}</td>
        <td>{{ taxon.id }}</td>
        <td>{{ taxon.name }}</td>
        <td>{{ taxon.rank }}</td>
        <td class="d_flex pt-1">
            <highlight-chip v-for="(annotation, i) of nodeAnnotations"
                :key="i"
                :class="{ 'me-1': i < nodeAnnotations.length - 1 }"
                class="mb-1"
                :name="annotation"
                :highlight="highlight(annotation, matchedAnnotations)"
            />
        </td>
    </tr>
</template>

<script setup lang="ts">
import Taxon from '@/logic/entities/Taxon';
import HighlightChip from '../chips/HighlightChip.vue';

export interface Props {
    group?: string
    taxon: Taxon
    nodeAnnotations: string[]
    matchedAnnotations: string[]
};

defineProps<Props>();

const highlight = (annotation: string, matchedAnnotations: string[] | undefined) => {
    if (!matchedAnnotations) {
        return false;
    }

    return matchedAnnotations?.includes(annotation) ?? false;
}
</script>
