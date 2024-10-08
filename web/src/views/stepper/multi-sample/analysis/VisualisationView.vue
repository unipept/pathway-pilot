<template>
    <h2>Analyse your pathway</h2>
    
    <div v-if="pngUrl">
        <v-card class="mt-3" elevation="5">
            <image-controls
                download
                restore
                @download="onDownload"
                @restore="onRestore"
            >
                <div ref="image">
                    <v-card style="position: relative;" max-height="700px">
                        <taxon-legend v-if="!abundance" :items="legendItems" />

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
import { useDivergingLog } from '@/composables/useDivergingLog';
import EcNumber from '@/logic/entities/EcNumber';
import { intersection, max } from 'd3';
import useGroupSampleStore from '@/stores/sample/GroupSampleStore';
import FileFormat from '../../FileFormat';

export interface Props {
    area: any
    compound: any
    abundance: boolean
    fileFormat: FileFormat
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

const { pathway, highlightedItems: highlightedGroups } = storeToRefs(visualisationStore);

const legendItems = computed(() => highlightedGroups.value.map(groupId => {
    const group = sampleStore.group(groupId);
    return {
        label: group.name,
        color: ColorConstants.LEGEND[groupId],
    }
}));

const coloredAreas = computed(() => {
    if (props.abundance) {
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

        if (props.fileFormat === FileFormat.PROTEIN_LIST) {
            const group1PeptideCount = [ ...group1Peptides ].map(peptide => group1.peptideToCounts(peptide)).reduce((a, b) => a + b, 1);
            const group2PeptideCount = [ ...group2Peptides ].map(peptide => group2.peptideToCounts(peptide)).reduce((a, b) => a + b, 1);

            if (group1PeptideCount > 1 || group2PeptideCount > 1) {
                const log2FoldChange = Math.log2(group2PeptideCount) - Math.log2(group1PeptideCount);

                range[0] = Math.min(range[0], log2FoldChange);
                range[1] = Math.max(range[1], log2FoldChange);

                area.colors = [ log2FoldChange ];
            }

            area.info.counts = [ 
                "Log2 intensity group 1: " + Math.log2(group1PeptideCount).toPrecision(7),
                "Log2 intensity group 2: " + Math.log2(group2PeptideCount).toPrecision(7)
            ];

            return area;
        }
        
        const group1PeptideCount = [ ...group1Peptides ].map(peptide => group1.peptideToCounts(peptide)).reduce((a, b) => a + b, 0) / group1.size;
        const group2PeptideCount = [ ...group2Peptides ].map(peptide => group2.peptideToCounts(peptide)).reduce((a, b) => a + b, 0) / group2.size;

        if (group1PeptideCount > 0 || group2PeptideCount > 0) {
            const difference = group2PeptideCount - group1PeptideCount;
            range[0] = Math.min(range[0], difference);
            range[1] = Math.max(range[1], difference);

            area.colors = [ difference ];
        }

        area.info.counts = [ 
            "Relative amount of matches group 1: " + group1PeptideCount.toPrecision(5),
            "Relative amount of matches group 2: " + group2PeptideCount.toPrecision(5)
        ];

        return area;
    });

    const { getColor } = useDivergingLog(
        [ range[0], 0, range[1] ],
        ColorConstants.LEGEND[0], "#ffffe0", ColorConstants.LEGEND[1]
    );

    return differenceAreas.map(area => {
        area.colors = area.colors.map((n: number) => getColor(n));
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

watch(pathway, async (pathway: Pathway | undefined) => {
    onRestore();
    
    pngUrl.value = undefined;
    
    // Fetch data from the store when loaded
    const data = await visualisationStore.getPathwayData();

    pngUrl.value = data?.image;
    areas.value  = data?.nodes.map((node: any, i: number) => {
        node.id = i;
        return node;
    }) ?? [];
});

watch(() => props.area, () => {
    selectedArea.value = props.area;
});

watch(() => props.compound, () => {
    selectedCompound.value = props.compound;
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

