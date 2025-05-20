import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import { HeatmapSelect } from "@/modules/Heatmap/schema";
import { RGBAColor, DayOfWeek } from "@/constants";
import { defaultHeatmapConfig } from "@/modules/Heatmap/heatmap-default-config";

export type HeatmapChartState = Omit<HeatmapSelect, "chartId">;

export type HeatmapChartActions = {
    // Basic appearance
    setBackgroundColor: (color: RGBAColor) => void;
    setTextColor: (color: RGBAColor) => void;
    toggleTooltip: () => void;
    toggleLegend: () => void;
    toggleBorder: () => void;
    toggleAverageOfAllEntries: () => void;
    toggleLongestStreak: () => void;
    toggleNumberOfEntries: () => void;
    toggleSumOfAllEntries: () => void;
    toggleStreak: () => void;
    toggleLabel: () => void;

    // Metric operations
    setMetric: (metric: string) => void;
    setStreak: (streak: number) => void;
    setLongestStreak: (longestStreak: number) => void;
    setSumOfAllEntries: (sum: number) => void;
    setAverageOfAllEntries: (average: number) => void;
    setNumberOfEntries: (count: number) => void;
    toggleButtonHover: () => void;

    // Color operations
    setDefaultBoxColor: (color: RGBAColor) => void;
    setAccent: (color: RGBAColor) => void;
    setLongestStreakColor: (color: RGBAColor) => void;
    setNumberOfEntriesColor: (color: RGBAColor) => void;
    setStreakColor: (color: RGBAColor) => void;
    setSumOfAllEntriesColor: (color: RGBAColor) => void;
    setAverageOfAllEntriesColor: (color: RGBAColor) => void;

    toggleDaysToIncludeInStreak: (day: DayOfWeek) => void;
    setDaysToIncludeInStreak: (days: DayOfWeek[]) => void;
    isDayIncludedInStreak: (day: DayOfWeek) => boolean;

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
                    state.labelEnabled = !state.labelEnabled;
                }),
            toggleBorder: () =>
                set((state) => {
                    state.borderEnabled = !state.borderEnabled;
                }),
            toggleAverageOfAllEntries: () =>
                set((state) => {
                    state.averageOfAllEntriesEnabled =
                        !state.averageOfAllEntriesEnabled;
                }),
            toggleLongestStreak: () =>
                set((state) => {
                    state.longestStreakEnabled = !state.longestStreakEnabled;
                }),
            toggleNumberOfEntries: () =>
                set((state) => {
                    state.numberOfEntriesEnabled =
                        !state.numberOfEntriesEnabled;
                }),
            toggleSumOfAllEntries: () =>
                set((state) => {
                    state.sumOfAllEntriesEnabled =
                        !state.sumOfAllEntriesEnabled;
                }),
            toggleStreak: () =>
                set((state) => {
                    state.streakEnabled = !state.streakEnabled;
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
                    state.streak = streak;
                }),
            setLongestStreak: (longestStreak) =>
                set((state) => {
                    state.longestStreak = longestStreak;
                }),
            setSumOfAllEntries: (sum) =>
                set((state) => {
                    state.sumOfAllEntries = sum;
                }),
            setAverageOfAllEntries: (average) =>
                set((state) => {
                    state.averageOfAllEntries = average;
                }),
            setNumberOfEntries: (count) =>
                set((state) => {
                    state.numberOfEntries = count;
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
                    state.longestStreakColor = color;
                }),
            setNumberOfEntriesColor: (color) =>
                set((state) => {
                    state.numberOfEntriesColor = color;
                }),
            setStreakColor: (color) =>
                set((state) => {
                    state.streakColor = color;
                }),
            setSumOfAllEntriesColor: (color) =>
                set((state) => {
                    state.sumOfAllEntriesColor = color;
                }),
            setAverageOfAllEntriesColor: (color) =>
                set((state) => {
                    state.averageOfAllEntriesColor = color;
                }),

            // Days to include in streak
            toggleDaysToIncludeInStreak: (day) =>
                set((state) => {
                    const daysSet = new Set(state.daysToIncludeInStreak);
                    if (daysSet.has(day)) {
                        daysSet.delete(day);
                    } else {
                        daysSet.add(day);
                    }
                    state.daysToIncludeInStreak = Array.from(daysSet);
                }),
            setDaysToIncludeInStreak: (days) =>
                set((state) => {
                    state.daysToIncludeInStreak = days;
                }),
            isDayIncludedInStreak: (day) =>
                get().daysToIncludeInStreak.includes(day),

            // State operations
            reset: () => set(() => ({ ...defaultHeatmapConfig })),
        }))
    );
};
