import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import { HeatmapSelect } from "@/modules/Heatmap/schema";
import { RGBAColor, DayOfWeek } from "@/constants";
import { defaultHeatmapConfig } from "@/modules/Heatmap/heatmap-default-config";

export type HeatmapChartState = Omit<HeatmapSelect, "chartId">;

export type HeatmapChartActions = {
    setBackgroundColor: (color: RGBAColor) => void;
    setTextColor: (color: RGBAColor) => void;
    toggleTooltip: () => void;
    toggleLegend: () => void;
    toggleBorder: () => void;
    setMetric: (metric: string) => void;
    toggleLabel: () => void;
    setDateField: (dateField: string) => void;
    setValueField: (valueField: string) => void;

    setStreak: (streak: number) => void;
    toggleStreak: () => void;
    setStreakColor: (color: RGBAColor) => void;
    toggleDaysToIncludeInStreak: (day: DayOfWeek) => void;
    setDaysToIncludeInStreak: (days: DayOfWeek[]) => void;
    isDayIncludedInStreak: (day: DayOfWeek) => boolean;

    setLongestStreak: (longestStreak: number) => void;
    toggleLongestStreak: () => void;
    setLongestStreakColor: (color: RGBAColor) => void;

    setSumOfAllEntries: (sum: number) => void;
    toggleSumOfAllEntries: () => void;
    setSumOfAllEntriesColor: (color: RGBAColor) => void;

    setAverageOfAllEntries: (average: number) => void;
    toggleAverageOfAllEntries: () => void;
    setAverageOfAllEntriesColor: (color: RGBAColor) => void;

    setNumberOfEntries: (count: number) => void;
    toggleNumberOfEntries: () => void;
    setNumberOfEntriesColor: (color: RGBAColor) => void;

    toggleButtonHover: () => void;
    setDefaultBoxColor: (color: RGBAColor) => void;
    setAccent: (color: RGBAColor) => void;

    // State operations
    reset: () => void;
};

export type HeatmapChartStore = HeatmapChartState & HeatmapChartActions;

export const initHeatmapChartStore = (
    data?: Partial<HeatmapChartState>
): HeatmapChartState => {
    return { ...defaultHeatmapConfig, ...data };
};

export const createHeatmapChartStore = (
    initialState: Partial<HeatmapChartState> = {}
) => {
    return createStore<HeatmapChartStore>()(
        immer((set, get) => ({
            ...defaultHeatmapConfig,
            ...initialState,

            // Basic appearance
            setBackgroundColor: (color) =>
                set((state) => {
                    state.backgroundColor = color;
                }),
            setTextColor: (color) =>
                set((state) => {
                    state.textColor = color;
                }),
            toggleTooltip: () =>
                set((state) => {
                    state.tooltipEnabled = !state.tooltipEnabled;
                }),
            toggleLegend: () =>
                set((state) => {
                    state.legendEnabled = !state.legendEnabled;
                }),
            toggleBorder: () =>
                set((state) => {
                    state.borderEnabled = !state.borderEnabled;
                }),
            toggleAverageOfAllEntries: () =>
                set((state) => {
                    state.averageOfAllEntries.enabled =
                        !state.averageOfAllEntries.enabled;
                }),
            setDateField: (dateField) =>
                set((state) => {
                    state.dateField = dateField;
                }),
            setValueField: (valueField) =>
                set((state) => {
                    state.valueField = valueField;
                }),

            toggleLongestStreak: () =>
                set((state) => {
                    state.longestStreak.enabled = !state.longestStreak.enabled;
                }),
            toggleNumberOfEntries: () =>
                set((state) => {
                    state.numberOfEntries.enabled =
                        !state.numberOfEntries.enabled;
                }),
            toggleSumOfAllEntries: () =>
                set((state) => {
                    state.sumOfAllEntries.enabled =
                        !state.sumOfAllEntries.enabled;
                }),
            toggleStreak: () =>
                set((state) => {
                    state.streak.enabled = !state.streak.enabled;
                }),
            toggleLabel: () =>
                set((state) => {
                    state.labelEnabled = !state.labelEnabled;
                }),

            // Metric operations
            setMetric: (metric) =>
                set((state) => {
                    state.metric = metric;
                }),
            setStreak: (streak) =>
                set((state) => {
                    state.streak.value = streak;
                }),
            setLongestStreak: (longestStreak) =>
                set((state) => {
                    state.longestStreak.value = longestStreak;
                }),
            setSumOfAllEntries: (sum) =>
                set((state) => {
                    state.sumOfAllEntries.value = sum;
                }),
            setAverageOfAllEntries: (average) =>
                set((state) => {
                    state.averageOfAllEntries.value = average;
                }),
            setNumberOfEntries: (count) =>
                set((state) => {
                    state.numberOfEntries.value = count;
                }),
            toggleButtonHover: () =>
                set((state) => {
                    state.buttonHoverEnabled = !state.buttonHoverEnabled;
                }),

            // Color operations
            setDefaultBoxColor: (color) =>
                set((state) => {
                    state.defaultBoxColor = color;
                }),
            setAccent: (color) =>
                set((state) => {
                    state.accent = color;
                }),
            setLongestStreakColor: (color) =>
                set((state) => {
                    state.longestStreak.color = color;
                }),
            setNumberOfEntriesColor: (color) =>
                set((state) => {
                    state.numberOfEntries.color = color;
                }),
            setStreakColor: (color) =>
                set((state) => {
                    state.streak.color = color;
                }),
            setSumOfAllEntriesColor: (color) =>
                set((state) => {
                    state.sumOfAllEntries.color = color;
                }),
            setAverageOfAllEntriesColor: (color) =>
                set((state) => {
                    state.averageOfAllEntries.color = color;
                }),

            // Days to include in streak
            toggleDaysToIncludeInStreak: (day) =>
                set((state) => {
                    const daysSet = new Set(state.streak.daysToInclude);
                    if (daysSet.has(day)) {
                        daysSet.delete(day);
                    } else {
                        daysSet.add(day);
                    }
                    state.streak.daysToInclude = Array.from(daysSet);
                }),
            setDaysToIncludeInStreak: (days) =>
                set((state) => {
                    state.streak.daysToInclude = days;
                }),
            isDayIncludedInStreak: (day) =>
                get().streak.daysToInclude.includes(day),

            // State operations
            reset: () => set(() => ({ ...defaultHeatmapConfig })),
        }))
    );
};
