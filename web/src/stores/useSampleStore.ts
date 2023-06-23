import useMultiSampleStore from "./MultiSampleStore"
import useSingleSampleStore from "./SingleSampleStore"

export enum AnalysisType { SINGLE, MULTI };

export const useSampleStore = (analysis: AnalysisType) => {
    const storeMap = new Map<AnalysisType, Function>([
        [ AnalysisType.SINGLE, () => useSingleSampleStore() ],
        [ AnalysisType.MULTI,  () => useMultiSampleStore()  ]
    ]);

    const getSampleStore = () => {
        return storeMap.get(analysis);
    }

    return {
        getSampleStore
    };
};
