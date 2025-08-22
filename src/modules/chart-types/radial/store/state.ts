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
import { RadialChartSelect } from "@/modules/chart-types/radial/schema/types";
import {
    RadialSpecificConfig,
    radialSpecificConfigDefaults,
    defaultRadialChartConfig,
} from "@/modules/chart-types/radial/default-radial-config";

export type RadialChartState = Omit<
    RadialChartSelect,
    "chartId" | "specificConfig"
> &
    RadialSpecificConfig & {
        isLoading: boolean;
        error: Error | null;
    };

export interface RadialChartSlice extends RadialChartState {
    setRadialConfig: <T extends keyof RadialChartState>(
        key: T,
        value: RadialChartState[T] | undefined
    ) => void;
}

export interface RadialRootStore
    extends RadialChartSlice,
        ChartVisualSlice,
        ChartBoxModelSlice,
        ChartColorSlice,
        ChartTypographySlice {}

export const createRadialChartSlice = (
    // eslint-disable-next-line
    set: any,
    initialState?: Partial<RadialChartState>
): RadialChartSlice => {
    return {
        isLoading: true,
        error: null,
        omitZeroValuesEnabled:
            initialState?.omitZeroValuesEnabled ??
            defaultRadialChartConfig.omitZeroValuesEnabled,
        xAxisField:
            initialState?.xAxisField ?? defaultRadialChartConfig.xAxisField,
        xAxisSortOrder:
            initialState?.xAxisSortOrder ??
            defaultRadialChartConfig.xAxisSortOrder,
        yAxisField:
            initialState?.yAxisField ?? defaultRadialChartConfig.yAxisField,
        yAxisSortOrder:
            initialState?.yAxisSortOrder ??
            defaultRadialChartConfig.yAxisSortOrder,
        borderRadius:
            initialState?.borderRadius ??
            radialSpecificConfigDefaults.borderRadius,
        endAngle:
            initialState?.endAngle ?? radialSpecificConfigDefaults.endAngle,
        gap: initialState?.gap ?? radialSpecificConfigDefaults.gap,
        innerRadius:
            initialState?.innerRadius ??
            radialSpecificConfigDefaults.innerRadius,
        outerRadius:
            initialState?.outerRadius ??
            radialSpecificConfigDefaults.outerRadius,
        startAngle:
            initialState?.startAngle ?? radialSpecificConfigDefaults.startAngle,
        trackColor:
            initialState?.trackColor ?? radialSpecificConfigDefaults.trackColor,
        trackEnabled:
            initialState?.trackEnabled ??
            radialSpecificConfigDefaults.trackEnabled,

        setRadialConfig: (key, value) => {
            set((state: RadialChartState) => {
                if (value === undefined) {
                    return;
                }
                state[key] = value;
            });
        },
    };
};

export const createRadialChartStore = (
    initialState: Partial<RadialRootStore> = {}
) => {
    return createStore<RadialRootStore>()(
        immer((set) => ({
            ...createRadialChartSlice(set, initialState),
            ...createVisualSlice(set, initialState),
            ...createBoxModelSlice(set, initialState),
            ...createColorSlice(set, initialState),
            ...createTypographySlice(set, initialState),
        }))
    );
};
