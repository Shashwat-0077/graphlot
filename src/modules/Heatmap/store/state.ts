import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

import { HeatmapSelect } from "@/modules/Heatmap/schema";
import { ColorType, DayOfWeek } from "@/constants";

export type HeatmapChartState = Omit<HeatmapSelect, "chart_id">;

export type HeatmapChartActions = {
    // Basic appearance
    setBackgroundColor: (color: ColorType) => void;
    setTextColor: (color: ColorType) => void;
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
    setDefaultBoxColor: (color: ColorType) => void;
    setAccent: (color: ColorType) => void;
    setLongestStreakColor: (color: ColorType) => void;
    setNumberOfEntriesColor: (color: ColorType) => void;
    setStreakColor: (color: ColorType) => void;
    setSumOfAllEntriesColor: (color: ColorType) => void;
    setAverageOfAllEntriesColor: (color: ColorType) => void;

    toggleDaysToIncludeInStreak: (day: DayOfWeek) => void;
    setDaysToIncludeInStreak: (days: DayOfWeek[]) => void;
    isDayIncludedInStreak: (day: DayOfWeek) => boolean;

    // State operations
    reset: () => void;
};

export type HeatmapChartStore = HeatmapChartState & HeatmapChartActions;

export const defaultHeatmapChartState: HeatmapChartState = {
    background_color: { r: 25, g: 25, b: 25, a: 1 },
    text_color: { r: 255, g: 255, b: 255, a: 1 },
    tooltip_enabled: true,
    label_enabled: true,
    has_border: false,
    average_of_all_entries_enabled: true,
    sum_of_all_entries_enabled: true,
    streak_enabled: true,
    longest_streak_enabled: true,
    number_of_entries_enabled: true,
    metric: "count",
    streak: 0,
    longest_streak: 0,
    sum_of_all_entries: 0,
    average_of_all_entries: 0,
    number_of_entries: 0,
    button_hover_enabled: false,
    default_box_color: { r: 38, g: 38, b: 38, a: 1 },
    accent: { r: 255, g: 255, b: 255, a: 1 },
    average_of_all_entries_color: { r: 255, g: 255, b: 255, a: 1 },
    longest_streak_color: { r: 255, g: 255, b: 255, a: 1 },
    number_of_entries_color: { r: 255, g: 255, b: 255, a: 1 },
    streak_color: { r: 255, g: 255, b: 255, a: 1 },
    sum_of_all_entries_color: { r: 255, g: 255, b: 255, a: 1 },
    days_to_include_in_streak: [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
    ],
};

export const initHeatmapChartStore = (): HeatmapChartState => {
    return defaultHeatmapChartState;
};

export const createHeatmapChartStore = (
    initialState: Partial<HeatmapChartState> = {}
) => {
    return createStore<HeatmapChartStore>()(
        immer((set, get) => ({
            ...defaultHeatmapChartState,
            ...initialState,

            // Basic appearance
            setBackgroundColor: (color) =>
                set((state) => {
                    state.background_color = color;
                }),
            setTextColor: (color) =>
                set((state) => {
                    state.text_color = color;
                }),
            toggleTooltip: () =>
                set((state) => {
                    state.tooltip_enabled = !state.tooltip_enabled;
                }),
            toggleLegend: () =>
                set((state) => {
                    state.label_enabled = !state.label_enabled;
                }),
            toggleBorder: () =>
                set((state) => {
                    state.has_border = !state.has_border;
                }),
            toggleAverageOfAllEntries: () =>
                set((state) => {
                    state.average_of_all_entries_enabled =
                        !state.average_of_all_entries_enabled;
                }),
            toggleLongestStreak: () =>
                set((state) => {
                    state.longest_streak_enabled =
                        !state.longest_streak_enabled;
                }),
            toggleNumberOfEntries: () =>
                set((state) => {
                    state.number_of_entries_enabled =
                        !state.number_of_entries_enabled;
                }),
            toggleSumOfAllEntries: () =>
                set((state) => {
                    state.sum_of_all_entries_enabled =
                        !state.sum_of_all_entries_enabled;
                }),
            toggleStreak: () =>
                set((state) => {
                    state.streak_enabled = !state.streak_enabled;
                }),
            toggleLabel: () =>
                set((state) => {
                    state.label_enabled = !state.label_enabled;
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
                    state.longest_streak = longestStreak;
                }),
            setSumOfAllEntries: (sum) =>
                set((state) => {
                    state.sum_of_all_entries = sum;
                }),
            setAverageOfAllEntries: (average) =>
                set((state) => {
                    state.average_of_all_entries = average;
                }),
            setNumberOfEntries: (count) =>
                set((state) => {
                    state.number_of_entries = count;
                }),
            toggleButtonHover: () =>
                set((state) => {
                    state.button_hover_enabled = !state.button_hover_enabled;
                }),

            // Color operations
            setDefaultBoxColor: (color) =>
                set((state) => {
                    state.default_box_color = color;
                }),
            setAccent: (color) =>
                set((state) => {
                    state.accent = color;
                }),
            setLongestStreakColor: (color) =>
                set((state) => {
                    state.longest_streak_color = color;
                }),
            setNumberOfEntriesColor: (color) =>
                set((state) => {
                    state.number_of_entries_color = color;
                }),
            setStreakColor: (color) =>
                set((state) => {
                    state.streak_color = color;
                }),
            setSumOfAllEntriesColor: (color) =>
                set((state) => {
                    state.sum_of_all_entries_color = color;
                }),
            setAverageOfAllEntriesColor: (color) =>
                set((state) => {
                    state.average_of_all_entries_color = color;
                }),

            // Days to include in streak
            toggleDaysToIncludeInStreak: (day) =>
                set((state) => {
                    const daysSet = new Set(state.days_to_include_in_streak);
                    if (daysSet.has(day)) {
                        daysSet.delete(day);
                    } else {
                        daysSet.add(day);
                    }
                    state.days_to_include_in_streak = Array.from(daysSet);
                }),
            setDaysToIncludeInStreak: (days) =>
                set((state) => {
                    state.days_to_include_in_streak = days;
                }),
            isDayIncludedInStreak: (day) =>
                get().days_to_include_in_streak.includes(day),

            // State operations
            reset: () => set(() => ({ ...defaultHeatmapChartState })),
        }))
    );
};
