import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

export type ColorType = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

// Type for an array that can contain each DayOfWeek at most once
export type UniqueDaysArray =
    Readonly<{
        [K in DayOfWeek]?: true;
    }> extends infer R
        ? { [K in keyof R]: K extends DayOfWeek ? K : never }[keyof R][]
        : never;

export type HeatmapChartAppearanceState = {
    showBorder: boolean;
    showLabel: boolean;
    showToolTip: boolean;
    buttonOnHover: boolean;
    bgColor: ColorType;
    textColor: ColorType;
    defaultBoxColor: ColorType;
    accent: ColorType;
    longestStreak: {
        show: boolean;
        color: ColorType;
    };
    streak: {
        show: boolean;
        color: ColorType;
    };
    total: {
        show: boolean;
        color: ColorType;
    };
    numberOfEntries: {
        show: boolean;
        color: ColorType;
    };
    metric: string;
    daysToContInStreak: UniqueDaysArray;
};

export type HeatmapChartAppearanceActions = {
    setBgColor: (color: ColorType) => void;
    setTextColor: (color: ColorType) => void;
    setDefaultBoxColor: (color: ColorType) => void;
    setAscentColor: (color: ColorType) => void;
    toggleLabel: () => void;
    toggleToolTip: () => void;
    toggleBorder: () => void;
    toggleButtonOnHover: () => void;
    toggleLongestStreak: () => void;
    toggleStreak: () => void;
    toggleTotal: () => void;
    setMetric: (metric: string) => void;
    toggleDayToContInStreak: (day: DayOfWeek) => void;
    toggleNumberOfEntries: () => void;
    isDayPresentInArray: (day: DayOfWeek) => boolean;
    setNumberOfEntriesColor: (color: ColorType) => void;
    setTotalColor: (color: ColorType) => void;
    setLongestStreakColor: (color: ColorType) => void;
    setStreakColor: (color: ColorType) => void;
};

export type HeatmapChartAppearanceStore = HeatmapChartAppearanceState &
    HeatmapChartAppearanceActions;

export const defaultInitState: HeatmapChartAppearanceState = {
    showLabel: true,
    showToolTip: true,
    showBorder: true,
    buttonOnHover: true,
    numberOfEntries: {
        show: true,
        color: { r: 255, g: 255, b: 255, a: 1 },
    },
    longestStreak: {
        show: true,
        color: { r: 255, g: 255, b: 255, a: 1 },
    },
    streak: {
        show: true,
        color: { r: 255, g: 255, b: 255, a: 1 },
    },
    total: {
        show: true,
        color: { r: 255, g: 255, b: 255, a: 1 },
    },
    bgColor: { r: 25, g: 25, b: 25, a: 1 },
    textColor: { r: 255, g: 255, b: 255, a: 1 },
    defaultBoxColor: { r: 38, g: 38, b: 38, a: 1 },
    accent: { r: 255, g: 255, b: 255, a: 1 },
    metric: "",
    daysToContInStreak: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

export const initChartHeatmapAppearanceStore =
    (): HeatmapChartAppearanceState => {
        return defaultInitState;
    };

export const createHeatmapChartAppearanceStore = (
    initState: HeatmapChartAppearanceState = defaultInitState
) => {
    return createStore<HeatmapChartAppearanceStore>()(
        immer((set, get) => ({
            ...initState,
            setBgColor: (color) => set({ bgColor: color }),
            setTextColor: (color) => set({ textColor: color }),
            setDefaultBoxColor: (color) => set({ defaultBoxColor: color }),
            setAscentColor: (color) => set({ accent: color }),
            toggleLabel: () =>
                set((state) => ({ showLabel: !state.showLabel })),
            toggleToolTip: () =>
                set((state) => ({ showToolTip: !state.showToolTip })),
            toggleBorder: () => set((state) => ({ border: !state.showBorder })),
            toggleButtonOnHover: () =>
                set((state) => ({ buttonOnHover: !state.buttonOnHover })),
            toggleLongestStreak: () =>
                set((state) => ({
                    longestStreak: {
                        ...state.longestStreak,
                        show: !state.longestStreak.show,
                    },
                })),
            toggleStreak: () =>
                set((state) => ({
                    streak: { ...state.streak, show: !state.streak.show },
                })),
            toggleTotal: () =>
                set((state) => ({
                    total: { ...state.total, show: !state.total.show },
                })),
            setMetric: (metric) => set({ metric }),
            toggleDayToContInStreak: (day) => {
                const isPresent = get().isDayPresentInArray(day);
                const newDaysToContInStreak = isPresent
                    ? get().daysToContInStreak.filter((d) => d !== day)
                    : [...get().daysToContInStreak, day];
                set({ daysToContInStreak: newDaysToContInStreak });
            },
            isDayPresentInArray: (day) =>
                get().daysToContInStreak.includes(day),
            toggleNumberOfEntries: () =>
                set((state) => ({
                    numberOfEntries: {
                        ...state.numberOfEntries,
                        show: !state.numberOfEntries.show,
                    },
                })),
            setNumberOfEntriesColor: (color) =>
                set((state) => ({
                    numberOfEntries: { ...state.numberOfEntries, color },
                })),
            setTotalColor: (color) =>
                set((state) => ({
                    total: { ...state.total, color },
                })),
            setLongestStreakColor: (color) =>
                set((state) => ({
                    longestStreak: { ...state.longestStreak, color },
                })),
            setStreakColor: (color) =>
                set((state) => ({ streak: { ...state.streak, color } })),
        }))
    );
};
