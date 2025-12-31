import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import { HeatmapSelect } from "@/modules/chart-types/heatmap/schema/types";
import { defaultHeatmapConfig } from "@/modules/chart-types/heatmap/default-heatmap-config";

export type HeatmapState = Omit<HeatmapSelect, "chartId" | "specificConfig"> & {
    isLoading: boolean;
    error: Error | null;
};

export interface HeatmapRootStore extends HeatmapState {
    setHeatmapConfig: <T extends keyof HeatmapState>(
        key: T,
        value: HeatmapState[T] | undefined
    ) => void;
}

export const createHeatmapSlice = (
    // eslint-disable-next-line
    set: any,
    initialState?: Partial<HeatmapState>
): HeatmapRootStore => {
    return {
        isLoading: initialState?.isLoading ?? true,
        error: initialState?.error ?? null,
        accent: initialState?.accent ?? defaultHeatmapConfig.accent,
        averageOfAllEntries:
            initialState?.averageOfAllEntries ??
            defaultHeatmapConfig.averageOfAllEntries,
        backgroundColor:
            initialState?.backgroundColor ??
            defaultHeatmapConfig.backgroundColor,
        borderEnabled:
            initialState?.borderEnabled ?? defaultHeatmapConfig.borderEnabled,
        buttonHoverEnabled:
            initialState?.buttonHoverEnabled ??
            defaultHeatmapConfig.buttonHoverEnabled,
        dateField: initialState?.dateField ?? defaultHeatmapConfig.dateField,
        defaultBoxColor:
            initialState?.defaultBoxColor ??
            defaultHeatmapConfig.defaultBoxColor,
        labelEnabled:
            initialState?.labelEnabled ?? defaultHeatmapConfig.labelEnabled,
        legendEnabled:
            initialState?.legendEnabled ?? defaultHeatmapConfig.legendEnabled,
        longestStreak:
            initialState?.longestStreak ?? defaultHeatmapConfig.longestStreak,
        metric: initialState?.metric ?? defaultHeatmapConfig.metric,
        numberOfEntries:
            initialState?.numberOfEntries ??
            defaultHeatmapConfig.numberOfEntries,
        streak: initialState?.streak ?? defaultHeatmapConfig.streak,
        sumOfAllEntries:
            initialState?.sumOfAllEntries ??
            defaultHeatmapConfig.sumOfAllEntries,
        textColor: initialState?.textColor ?? defaultHeatmapConfig.textColor,
        tooltipEnabled:
            initialState?.tooltipEnabled ?? defaultHeatmapConfig.tooltipEnabled,
        valueField: initialState?.valueField ?? defaultHeatmapConfig.valueField,
        boxBorderRadius:
            initialState?.boxBorderRadius ??
            defaultHeatmapConfig.boxBorderRadius,

        setHeatmapConfig: (key, value) => {
            set((state: HeatmapState) => {
                if (value === undefined) {
                    return;
                }
                state[key] = value;
            });
        },
    };
};

export const createHeatmapStore = (
    initialState: Partial<HeatmapRootStore> = {}
) => {
    return createStore<HeatmapRootStore>()(
        immer((set) => ({
            ...createHeatmapSlice(set, initialState),
        }))
    );
};
