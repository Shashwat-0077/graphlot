import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

export type ColorType = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export type ChartAppearanceState = {
    bgColor: ColorType;
    showLabel: boolean;
    showLegends: boolean;
    showGrid: boolean;
    showToolTip: boolean;
    labelColor: ColorType;
    gridColor: ColorType;
    colors: ColorType[];
};

export type ChartAppearanceActions = {
    setColor: (color: ColorType, index: number) => void;
    setBgColor: (color: ColorType) => void;
    setGridColor: (color: ColorType) => void;
    setLabelColor: (color: ColorType) => void;
    toggleLegends: () => void;
    toggleGrid: () => void;
    toggleLabel: () => void;
    toggleToolTip: () => void;
    addColor: () => void;
    removeColor: (index: number) => void;
    clearColors: () => void;
};

export type ChartAppearanceStore = ChartAppearanceState &
    ChartAppearanceActions;

export const defaultInitState: ChartAppearanceState = {
    showLabel: true,
    showLegends: true,
    showGrid: true,
    showToolTip: true,
    colors: [],
    bgColor: { r: 25, g: 25, b: 25, a: 1 },
    gridColor: { r: 38, g: 38, b: 38, a: 1 },
    labelColor: { r: 255, g: 255, b: 255, a: 1 },
};

export const initChartAppearanceStore = (): ChartAppearanceState => {
    return defaultInitState;
};

export const createChartAppearanceStore = (
    initState: ChartAppearanceState = defaultInitState
) => {
    return createStore<ChartAppearanceStore>()(
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
            setGridColor: (color) =>
                set((state) => {
                    state.gridColor = color;
                }),
            toggleLegends: () =>
                set((state) => {
                    state.showLegends = !state.showLegends;
                }),
            toggleLabel: () =>
                set((state) => {
                    state.showLabel = !state.showLabel;
                }),
            toggleGrid: () =>
                set((state) => {
                    state.showGrid = !state.showGrid;
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
