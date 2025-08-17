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
import { BarChartSelect } from "@/modules/chart-types/bar/schema/types";
import {
    BarSpecificConfig,
    barSpecificConfigDefaults,
    defaultBarChartConfig,
} from "@/modules/chart-types/bar/default-bar-config";

export type BarChartState = Omit<BarChartSelect, "chartId" | "specificConfig"> &
    BarSpecificConfig & {
        isLoading: boolean;
        error: Error | null;
    };

export interface BarChartSlice extends BarChartState {
    setBarConfig: <T extends keyof BarChartState>(
        key: T,
        value: BarChartState[T] | undefined
    ) => void;
}

export interface BarRootStore
    extends BarChartSlice,
        ChartVisualSlice,
        ChartBoxModelSlice,
        ChartColorSlice,
        ChartTypographySlice {}

export const createBarChartSlice = (
    // eslint-disable-next-line
    set: any,
    initialState?: Partial<BarChartState>
): BarChartSlice => {
    return {
        isLoading: true,
        error: null,
        cumulativeEnabled:
            initialState?.cumulativeEnabled ??
            defaultBarChartConfig.cumulativeEnabled,
        omitZeroValuesEnabled:
            initialState?.omitZeroValuesEnabled ??
            defaultBarChartConfig.omitZeroValuesEnabled,
        strokeWidth:
            initialState?.strokeWidth ?? barSpecificConfigDefaults.strokeWidth,
        xAxisEnabled:
            initialState?.xAxisEnabled ??
            barSpecificConfigDefaults.xAxisEnabled,
        xAxisField:
            initialState?.xAxisField ?? defaultBarChartConfig.xAxisField,
        xAxisSortOrder:
            initialState?.xAxisSortOrder ??
            defaultBarChartConfig.xAxisSortOrder,
        yAxisEnabled:
            initialState?.yAxisEnabled ??
            barSpecificConfigDefaults.yAxisEnabled,
        yAxisField:
            initialState?.yAxisField ?? defaultBarChartConfig.yAxisField,
        yAxisSortOrder:
            initialState?.yAxisSortOrder ??
            defaultBarChartConfig.yAxisSortOrder,
        barBorderRadius:
            initialState?.barBorderRadius ??
            barSpecificConfigDefaults.barBorderRadius,
        barGap: initialState?.barGap ?? barSpecificConfigDefaults.barGap,
        barWidth: initialState?.barWidth ?? barSpecificConfigDefaults.barWidth,
        borderRadiusBetweenBars:
            initialState?.borderRadiusBetweenBars ??
            barSpecificConfigDefaults.borderRadiusBetweenBars,
        fillOpacity:
            initialState?.fillOpacity ?? barSpecificConfigDefaults.fillOpacity,
        stacked: initialState?.stacked ?? barSpecificConfigDefaults.stacked,

        setBarConfig: (key, value) => {
            set((state: BarChartState) => {
                if (value === undefined) {
                    return;
                }
                state[key] = value;
            });
        },
    };
};

export const createBarChartStore = (
    initialState: Partial<BarRootStore> = {}
) => {
    return createStore<BarRootStore>()(
        immer((set) => ({
            ...createBarChartSlice(set, initialState),
            ...createVisualSlice(set, initialState),
            ...createBoxModelSlice(set, initialState),
            ...createColorSlice(set, initialState),
            ...createTypographySlice(set, initialState),
        }))
    );
};
