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
                    <!-- TODO: height has to be responsive here I guess -->
                    <v-card style="position: relative;" max-height="700px">
                        <taxon-legend v-if="imageLoaded && !showAbundanceView"
                            class="legend"
                            :items="legendItems"
                        />

                        <abundance-legend v-if="imageLoaded && showAbundanceView" 
                            class="abundance-legend"
                            :topItem="legendItems[0]"
                            :bottomItem="legendItems[1]"
                        />

                        <interactive-image
                            :scale="scale"
                            :translate="translate"
                            @update:scale="scale = $event"
                            @update:translate="translate = $event"
                        >
                            <reactive-image
                                class="image-container"
                                :src="pngUrl"
                                alt="Pathway"
                                @resize="onResize"
                            >
                                <image-overlay v-if="imageLoaded"
                                    :areas="coloredAreas"
                                    :scale="imageScale"
                                    :selected="selectedArea?.id ?? -1"
                                    :onClickArea="onClickArea"
                                    :onClickCompound="onClickCompound"
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

        <compound-modal
            :model-value="compoundModalOpen"
            :compoundId="selectedCompound"
            @update:model-value="compoundModalOpen = $event"
        />
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
import CompoundModal from '@/components/modals/CompoundModal.vue';
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

const sampleStore = useGroupSampleStore();
const visualisationStore = useVisualisationStore();

const { downloadPng } = usePngDownloader();

const image = ref<HTMLElement | null>(null);

const pngUrl = ref<string | undefined>(undefined);
const areas  = ref<any[]>([]);

const imageLoaded = ref<boolean>(false);
const imageScale = ref<number>(1);

const compoundModalOpen = ref<boolean>(false);
const filterModalOpen = ref<boolean>(false);

const selectedArea = ref<any | undefined>(undefined);
const selectedCompound = ref<string>('');

const scale = ref<number>(1);
const translate = ref<{ x: number, y: number }>({ x: 0, y: 0 });

const { pathway, highlightedItems: highlightedGroups } = storeToRefs(visualisationStore);

const abundance = ref<ToggleButtonValue>('disabled');
const showAbundanceView = ref<boolean>(false);

const filter = ref<ActiveButtonValue>(true);

const legendItems = computed(() => highlightedGroups.value.map(groupId => {
    const group = sampleStore.group(groupId);
    return {
        label: group.name,
        color: ColorConstants.LEGEND[groupId],
    }
}));

const coloredAreas = computed(() => {
    if (showAbundanceView.value) {
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

const onResize = (event: any) => {
    if (event.width && event.width !== 0) {
        imageScale.value = event.width / event.naturalWidth;
        imageLoaded.value = true;
    }
}

const onClickArea = (area: any) => {
    if (selectedArea.value && selectedArea.value.id === area.id) {
        selectedArea.value = undefined;
        return;
    }
    selectedArea.value = area;
}

const onClickCompound = (compound: any) => {
    selectedCompound.value = compound.info.compounds[0].id;
    compoundModalOpen.value = true;
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
    showAbundanceView.value = value;
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
    onAbundance(highlightedGroups.value.length === 2 && showAbundanceView.value)
    abundance.value = highlightedGroups.value.length !== 2 ? 'disabled' : true;
    filter.value = highlightedGroups.value.length > 0 ? 'active' : true;
});
</script>

<style scoped>
.image-container {
    position: relative;
    outline-color: white;
    outline-style: solid;
    outline-width: 10px;
    outline-offset: -5px;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 100px);
}

.legend {
    position: absolute;
    right: 0;
    margin: 12px;
    font-size: 90%;
    background-color: white;
    z-index: 1;
}

.abundance-legend {
    position: absolute;
    right: 0;
    margin: 12px;
    font-size: 90%;
    background-color: white;
    z-index: 1;
}
</style>

