<template>
    <h2>Analyse your pathway</h2>
    
    <div v-if="pngUrl">
        <v-card class="mt-3" elevation="5">
            <image-controls
                download
                restore
                :abundance="abundance"
                :filter="filter"
                @download="onDownload"
                @restore="onRestore"
                @abundance="onAbundance"
                @filter="onFilter"
            >
                <div ref="image">
                    <v-card style="position: relative;" max-height="700px">
                        <taxon-legend v-if="!abundanceView" :items="legendItems" />

                        <abundance-legend v-else :topItem="legendItems[0]" :bottomItem="legendItems[1]" />

                        <interactive-image
                            v-model:scale="scale"
                            v-model:translate="translate"
                        >
                            <reactive-image :src="pngUrl" v-slot="{ width, naturalWidth }">
                                <image-overlay v-if="naturalWidth > 0"
                                    v-model:area="selectedArea"
                                    v-model:compound="selectedCompound"
                                    :areas="coloredAreas"
                                    :scale="width / naturalWidth"
                                    @update:area="$emit('update:area', $event)"
                                    @update:compound="$emit('update:compound', $event)"
                                />
                            </reactive-image>
                        </interactive-image>
                    </v-card>
                </div>
            </image-controls>
        </v-card>

        <v-dialog 
            v-model="filterModalOpen"
            @click:outside="filterModalOpen = false"
            max-width="75%"
            height="100%"
        >
            <div></div>
        </v-dialog>
    </div>

    <warning-alert v-else-if="!pathway" class="mt-5">
        No pathway has been selected yet. Before proceeding, please follow the previous steps to select a pathway.
    </warning-alert>

    <div v-else class="loading-container">
        <v-progress-circular
            size="50"
            width="5"
            color="primary"
            indeterminate
        ></v-progress-circular>
    </div>
</template>

<script setup lang="ts">
import ReactiveImage from '@/components/images/ReactiveImage.vue';
import ImageOverlay from '@/components/images/ImageOverlay.vue';
import useVisualisationStore from '@/stores/VisualisationStore';
import { computed, ref, watch } from "vue";
import ColorConstants from "@/logic/constants/ColorConstants";
import TaxonLegend from '@/components/legends/TaxonLegend.vue';
import InteractiveImage from '@/components/images/InteractiveImage.vue';
import WarningAlert from '@/components/alerts/WarningAlert.vue';
import { storeToRefs } from 'pinia';
import Pathway from '@/logic/entities/Pathway';
import ImageControls, { ActiveButtonValue, ToggleButtonValue } from '@/components/images/ImageControls.vue';
import { usePngDownloader } from '@/composables/download/usePngDownloader';
import AbundanceLegend from '@/components/legends/AbundanceLegend.vue';
import { useLinearGradient } from '@/composables/useLinearGradient';
import EcNumber from '@/logic/entities/EcNumber';
import { intersection } from 'd3';
import useGroupSampleStore from '@/stores/sample/GroupSampleStore';

export interface Props {
    area: any
    compound: any
};

const props = defineProps<Props>();

defineEmits(['update:area', 'update:compound']);

const sampleStore = useGroupSampleStore();
const visualisationStore = useVisualisationStore();

const { downloadPng } = usePngDownloader();

const image = ref<HTMLElement | null>(null);

const pngUrl = ref<string | undefined>(undefined);
const areas  = ref<any[]>([]);

const scale = ref<number>(1);
const translate = ref<{ x: number, y: number }>({ x: 0, y: 0 });

const selectedArea = ref<any | undefined>(props.area);
const selectedCompound = ref<any | undefined>(props.compound);

const filterModalOpen = ref<boolean>(false);

const abundance = ref<ToggleButtonValue>(false);
const abundanceView = ref<boolean>(false);

const filter = ref<ActiveButtonValue>(true);

const { pathway, highlightedItems: highlightedGroups } = storeToRefs(visualisationStore);

const legendItems = computed(() => highlightedGroups.value.map(groupId => {
    const group = sampleStore.group(groupId);
    return {
        label: group.name,
        color: ColorConstants.LEGEND[groupId],
    }
}));

const coloredAreas = computed(() => {
    if (abundanceView.value) {
        return colorDifferential(areas.value);
    }

    return colorAll(areas.value);
});

// TODO: move coloring to a different file
const colorAll = (areas: any[]) => {
    return areas.map(area => {
        area.colors = [];
        for (const ecNumber of area.info.ecNumbers) {
            highlightedGroups.value.forEach(groupId => {
                const group = sampleStore.group(groupId);
                if (group.ecs.has(ecNumber.id) && !area.colors.includes(ColorConstants.LEGEND[groupId])) {
                    area.colors.push(ColorConstants.LEGEND[groupId]);
                }
            });
        }

        return area;
    });
};

const colorDifferential = (areas: any[]) => {
    const { getColor } = useLinearGradient(ColorConstants.LEGEND[0], ColorConstants.LEGEND[1]);

    const group1 = sampleStore.group(highlightedGroups.value[0]);
    const group2 = sampleStore.group(highlightedGroups.value[1]);

    const group1EcNumbers = group1.ecs;
    const group2EcNumbers = group2.ecs;

    const range = [ 0, 0 ];
    const differenceAreas = areas.map(area => {
        area.colors = [];

        const group1EcInArea: Set<string> = intersection(group1EcNumbers, new Set(area.info.ecNumbers.map((ec: EcNumber) => ec.id)));
        const group2EcInArea: Set<string> = intersection(group2EcNumbers, new Set(area.info.ecNumbers.map((ec: EcNumber) => ec.id)));

        const group1Peptides = new Set([ ...group1EcInArea ].map(ec => [ ...group1.ecToPeptides(ec) ]).flat());
        const group2Peptides = new Set([ ...group2EcInArea ].map(ec => [ ...group2.ecToPeptides(ec) ]).flat());
        
        const group1PeptideCount = [ ...group1Peptides ].map(peptide => group1.peptideToCounts(peptide)).reduce((a, b) => a + b, 0);
        const group2PeptideCount = [ ...group2Peptides ].map(peptide => group2.peptideToCounts(peptide)).reduce((a, b) => a + b, 0);

        if (group1PeptideCount > 0 || group2PeptideCount > 0) {
            const difference = group2PeptideCount - group1PeptideCount;
            range[0] = Math.min(range[0], difference);
            range[1] = Math.max(range[1], difference);

            area.colors = [ difference ];
        }

        return area;
    });

    const scale = (n: number, min: number, max: number, minR: number, maxR: number) => {
        if (min === max) {
            return 0.5;
        }
        return (maxR - minR) * (n - min) / (max - min) + minR;
    }

    let lower = 0;
    let upper = 1;
    if (range[0] >= 0 && range[1] >= 0) {
        lower = 0.5;
    } else if (range[0] <= 0 && range[1] <= 0) {
        upper = 0.5;
    }

    return differenceAreas.map(area => {
        area.colors = area.colors.map((n: number) => getColor(scale(n, range[0], range[1], lower, upper)));
        return area;
    });
}

const onDownload = async () => {
    if (image.value) {
        downloadPng(image.value, 'pathway.png');
    }
}

const onRestore = () => {
    scale.value = 1;
    translate.value = { x: 0, y: 0 };
}

const onAbundance = (value: boolean) => {
    abundanceView.value = value;
}

const onFilter = () => {
    filterModalOpen.value = true;
}

watch(pathway, async (pathway: Pathway | undefined) => {
    pngUrl.value = undefined;
    
    // Fetch data from the store when loaded
    const data = await visualisationStore.getPathwayData();

    pngUrl.value = data?.image;
    areas.value  = data?.nodes.map((node: any, i: number) => {
        node.id = i;
        return node;
    }) ?? [];
});

watch(highlightedGroups, () => {
    onAbundance(highlightedGroups.value.length === 2 && abundanceView.value)
    abundance.value = highlightedGroups.value.length !== 2 ? 'disabled' : true;
    filter.value = highlightedGroups.value.length > 0 ? 'active' : true;
});
</script>

<style scoped>
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 100px);
}
</style>

