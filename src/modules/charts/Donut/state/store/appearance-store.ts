import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

export type ColorType = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export type DonutChartAppearanceState = {
    bgColor: ColorType;
    showLabel: boolean;
    showLegends: boolean;
    showToolTip: boolean;
    labelColor: ColorType;
    colors: ColorType[];
};

export type DonutChartAppearanceActions = {
    setColor: (color: ColorType, index: number) => void;
    setBgColor: (color: ColorType) => void;
    setLabelColor: (color: ColorType) => void;
    toggleLegends: () => void;
    toggleLabel: () => void;
    toggleToolTip: () => void;
    addColor: () => void;
    removeColor: (index: number) => void;
    clearColors: () => void;
};

export type DonutChartAppearanceStore = DonutChartAppearanceState &
    DonutChartAppearanceActions;

export const defaultInitState: DonutChartAppearanceState = {
    showLabel: true,
    showLegends: true,
    showToolTip: true,
    colors: [],
    bgColor: { r: 25, g: 25, b: 25, a: 1 },
    labelColor: { r: 255, g: 255, b: 255, a: 1 },
};

export const initChartDonutAppearanceStore = (): DonutChartAppearanceState => {
    return defaultInitState;
};

export const createDonutChartAppearanceStore = (
    initState: DonutChartAppearanceState = defaultInitState
) => {
    return createStore<DonutChartAppearanceStore>()(
        immer((set) => ({
            ...initState,
            setColor: (color, index) =>
                set((state) => {
                    state.colors[index] = color;
                }),
            setBgColor: (color) =>
                set((state) => {
                    state.bgColor = color;
                }),
            setLabelColor: (color) =>
                set((state) => {
                    state.labelColor = color;
                }),
            toggleLegends: () =>
                set((state) => {
                    state.showLegends = !state.showLegends;
                }),
            toggleLabel: () =>
                set((state) => {
                    state.showLabel = !state.showLabel;
                }),
            toggleToolTip: () =>
                set((state) => {
                    state.showToolTip = !state.showToolTip;
                }),
            addColor: () =>
                set((state) => {
                    state.colors.push({ r: 0, g: 0, b: 0, a: 1 });
                }),
            removeColor: (index) =>
                set((state) => {
                    state.colors.splice(index, 1);
                }),
            clearColors: () =>
                set((state) => {
                    state.colors = [];
                }),
        }))
    );
};
