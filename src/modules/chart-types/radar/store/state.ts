import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import {
    ChartBoxModelSlice,
    ChartColorSlice,
    ChartTypographySlice,
    ChartVisualSlice,
    createBoxModelSlice,
    createColorSlice,
    createTypographySlice,
    createVisualSlice,
} from "@/modules/chart-attributes/store/state";
import { RadarChartSelect } from "@/modules/chart-types/radar/schema/types";
import {
    RadarSpecificConfig,
    radarSpecificConfigDefaults,
    defaultRadarChartConfig,
} from "@/modules/chart-types/radar/default-radar-config";

export type RadarChartState = Omit<
    RadarChartSelect,
    "chartId" | "specificConfig"
> &
    RadarSpecificConfig & {
        isLoading: boolean;
        error: Error | null;
    };

export interface RadarChartSlice extends RadarChartState {
    setRadarConfig: <T extends keyof RadarChartState>(
        key: T,
        value: RadarChartState[T] | undefined
    ) => void;
}

export interface RadarRootStore
    extends RadarChartSlice,
        ChartVisualSlice,
        ChartBoxModelSlice,
        ChartColorSlice,
        ChartTypographySlice {}

export const createRadarChartSlice = (
    // eslint-disable-next-line
    set: any,
    initialState?: Partial<RadarChartState>
): RadarChartSlice => {
    return {
        isLoading: true,
        error: null,
        cumulativeEnabled:
            initialState?.cumulativeEnabled ??
            defaultRadarChartConfig.cumulativeEnabled,
        omitZeroValuesEnabled:
            initialState?.omitZeroValuesEnabled ??
            defaultRadarChartConfig.omitZeroValuesEnabled,
        strokeWidth:
            initialState?.strokeWidth ??
            radarSpecificConfigDefaults.strokeWidth,
        xAxisEnabled:
            initialState?.xAxisEnabled ??
            radarSpecificConfigDefaults.xAxisEnabled,
        xAxisField:
            initialState?.xAxisField ?? defaultRadarChartConfig.xAxisField,
        xAxisSortOrder:
            initialState?.xAxisSortOrder ??
            defaultRadarChartConfig.xAxisSortOrder,

        yAxisField:
            initialState?.yAxisField ?? defaultRadarChartConfig.yAxisField,
        yAxisSortOrder:
            initialState?.yAxisSortOrder ??
            defaultRadarChartConfig.yAxisSortOrder,

        setRadarConfig: (key, value) => {
            set((state: RadarChartState) => {
                if (value === undefined) {
                    return;
                }
                state[key] = value;
            });
        },
    };
};

export const createRadarChartStore = (
    initialState: Partial<RadarRootStore> = {}
) => {
    return createStore<RadarRootStore>()(
        immer((set) => ({
            ...createRadarChartSlice(set, initialState),
            ...createVisualSlice(set, initialState),
            ...createBoxModelSlice(set, initialState),
            ...createColorSlice(set, initialState),
            ...createTypographySlice(set, initialState),
        }))
    );
};
