// src/stores/counter-store.ts
import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

type ChartType = "Area" | "Bar" | "Donut" | "Radar" | "Heatmap" | null;
type colorType = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export type ChartConfigState = {
    type: ChartType;
    showLabel: boolean;
    label: string;
    showLegends: boolean;
    data_labels: "value" | "percentage" | "None";
    colors: colorType[];
    bg_color: colorType;
    data: {
        x: string;
        y: string[];
    };
    sortby: {
        key: string;
        order: "asc" | "desc";
    };
    filters: {
        key: string;
        value: string;
    }[];
};

export type ChartConfigActions = {
    changeChartType: (type: NonNullable<ChartType>) => void;
    toggleLabel: () => void;
    dataLabels: (value: "value" | "percentage" | "None") => void;
    changeSortBy: (key: string, order: "asc" | "desc") => void;
    setColor: (color: colorType, index: number) => void;
    addColor: () => void;
    removeColor: (index: number) => void;
    setBGColor: (color: colorType) => void;
    toggleLegends: () => void;
    setLabel: (label: string) => void;
    setXAxis: (key: string) => void;
    setYAxis: (newYAxis: string[]) => void;
};

export type ChartConfigStore = ChartConfigState & ChartConfigActions;

export const defaultInitState: ChartConfigState = {
    type: null,
    label: "",
    showLabel: true,
    showLegends: true,
    data_labels: "value",
    colors: [],
    bg_color: { r: 25, g: 25, b: 25, a: 1 },
    data: {
        x: "",
        y: [],
    },
    sortby: {
        key: "",
        order: "asc",
    },
    filters: [],
};

export const initChartConfigStore = (): ChartConfigState => {
    return defaultInitState;
};

export const createChartConfigStore = (
    initState: ChartConfigState = defaultInitState
) => {
    return createStore<ChartConfigStore>()(
        immer((set) => ({
            ...initState,
            changeChartType: (type) =>
                set((state) => {
                    state.type = type;
                }),
            toggleLabel: () =>
                set((state) => {
                    state.showLabel = !state.showLabel;
                }),
            dataLabels: (value) =>
                set((state) => {
                    state.data_labels = value;
                }),
            changeSortBy: (key, order) =>
                set((state) => {
                    state.sortby = {
                        key,
                        order,
                    };
                }),
            setColor: (color, index) =>
                set((state) => {
                    state.colors[index] = color;
                }),
            addColor: () =>
                set((state) => {
                    state.colors.push({ r: 255, g: 255, b: 255, a: 1 });
                }),
            removeColor: (index) =>
                set((state) => {
                    state.colors.splice(index, 1);
                }),
            setBGColor: (color) =>
                set((state) => {
                    state.bg_color = color;
                }),
            toggleLegends: () =>
                set((state) => {
                    state.showLegends = !state.showLegends;
                }),
            setLabel: (label) =>
                set((state) => {
                    state.label = label;
                }),
            setXAxis: (key) =>
                set((state) => {
                    state.data.x = key;
                }),
            setYAxis: (newYAxis) =>
                set((state) => {
                    state.data.y = newYAxis;
                }),
        }))
    );
};
