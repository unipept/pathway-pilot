<template>
    <component :is="loadedSvg" v-if="loadedSvg" class="q-icon cursor-pointer" :class="[color]" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue' 

type IconSize = 'x-small' | 'small' | 'default' | 'large' | 'x-large';

interface Props {
    svg: string
    color?: string
    size?: IconSize | number
};

const props = withDefaults(defineProps<Props>(), {
    color: 'black',
    size: 'default'
});

let loadedSvg = ref(null);

const importSvg = async (iconName: string) => {
    if (iconName) {
        return await import(`../../assets/icons/${iconName}.vue`);
    }
    
    return null;
};

onMounted(async () => {
    loadedSvg.value = await importSvg(props.svg);

    console.log(loadedSvg.value)
});

watch(() => props.svg, async (newSvg) => {
    loadedSvg.value = await importSvg(newSvg);
});
</script>
