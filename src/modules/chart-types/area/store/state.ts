import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import {
    AreaSpecificConfig,
    areaSpecificConfigDefaults,
    defaultAreaChartConfig,
} from "@/modules/chart-types/area/default-area-config";
import { AreaChartSelect } from "@/modules/chart-types/area/schema/types";
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

export type AreaChartState = Omit<
    AreaChartSelect,
    "chartId" | "specificConfig"
> &
    AreaSpecificConfig & {
        isLoading: boolean;
        error: Error | null;
    };

export interface AreaChartSlice extends AreaChartState {
    setAreaConfig: <T extends keyof AreaChartState>(
        key: T,
        value: AreaChartState[T] | undefined
    ) => void;
}

export interface AreaRootStore
    extends AreaChartSlice,
        ChartVisualSlice,
        ChartBoxModelSlice,
        ChartColorSlice,
        ChartTypographySlice {}

export const createAreaChartSlice = (
    // eslint-disable-next-line
    set: any,
    initialState?: Partial<AreaChartState>
): AreaChartSlice => {
    return {
        isLoading: true,
        error: null,
        cumulativeEnabled:
            initialState?.cumulativeEnabled ??
            defaultAreaChartConfig.cumulativeEnabled,
        fill: initialState?.fill ?? areaSpecificConfigDefaults.fill,
        isAreaChart:
            initialState?.isAreaChart ?? areaSpecificConfigDefaults.isAreaChart,
        lineStyle:
            initialState?.lineStyle ?? areaSpecificConfigDefaults.lineStyle,
        omitZeroValuesEnabled:
            initialState?.omitZeroValuesEnabled ??
            defaultAreaChartConfig.omitZeroValuesEnabled,
        stackedEnabled:
            initialState?.stackedEnabled ??
            areaSpecificConfigDefaults.stackedEnabled,
        strokeWidth:
            initialState?.strokeWidth ?? areaSpecificConfigDefaults.strokeWidth,
        xAxisEnabled:
            initialState?.xAxisEnabled ??
            areaSpecificConfigDefaults.xAxisEnabled,
        xAxisField:
            initialState?.xAxisField ?? defaultAreaChartConfig.xAxisField,
        xAxisSortOrder:
            initialState?.xAxisSortOrder ??
            defaultAreaChartConfig.xAxisSortOrder,
        yAxisEnabled:
            initialState?.yAxisEnabled ??
            areaSpecificConfigDefaults.yAxisEnabled,
        yAxisField:
            initialState?.yAxisField ?? defaultAreaChartConfig.yAxisField,
        yAxisSortOrder:
            initialState?.yAxisSortOrder ??
            defaultAreaChartConfig.yAxisSortOrder,

        setAreaConfig: (key, value) => {
            set((state: AreaChartState) => {
                if (value === undefined) {
                    return;
                }
                state[key] = value;
            });
        },
    };
};

export const createAreaChartStore = (
    initialState: Partial<AreaRootStore> = {}
) => {
    return createStore<AreaRootStore>()(
        immer((set) => ({
            ...createAreaChartSlice(set, initialState),
            ...createVisualSlice(set, initialState),
            ...createBoxModelSlice(set, initialState),
            ...createColorSlice(set, initialState),
            ...createTypographySlice(set, initialState),
        }))
    );
};
