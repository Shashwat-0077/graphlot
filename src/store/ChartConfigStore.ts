import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

export type ChartType = "Area" | "Bar" | "Donut" | "Radar" | "Heatmap" | null;
export type ColorType = {
    r: number;
    g: number;
    b: number;
    a: number;
};
// export type YAxisType = {
//     active: boolean;
//     name: string;
//     aggregation: "sum" | "average" | "count" | "cumulative_sum";
//     sort: "asc" | "desc";
// }[];

export type ChartConfigState = {
    type: ChartType;
    showLabel: boolean;
    label: string;
    showLegends: boolean;
    data_labels: "value" | "percentage" | "None";
    colors: ColorType[];
    bg_color: ColorType;
    XAxis: string;
    YAxis: string;
    groupBy: string;
    filters: {
        key: string;
        value: string;
    }[];
};

export type ChartConfigActions = {
    // setters
    setYAxis: (yAxis: string) => void;
    setXAxis: (key: string) => void;
    setLabel: (label: string) => void;
    setColor: (color: ColorType, index: number) => void;
    setBGColor: (color: ColorType) => void;
    setGroupBy: (key: string) => void;
    setDataLabels: (value: "value" | "percentage" | "None") => void;

    // toggles
    toggleLabel: () => void;
    toggleLegends: () => void;

    // actions
    addColor: () => void;
    removeColor: (index: number) => void;
    changeChartType: (type: NonNullable<ChartType>) => void;
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
    XAxis: "",
    YAxis: "",
    groupBy: "",
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
            setDataLabels: (value) =>
                set((state) => {
                    state.data_labels = value;
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
                    state.XAxis = key;
                }),
            setYAxis: (yAxis) =>
                set((state) => {
                    state.YAxis = yAxis;
                }),
            setGroupBy: (key) =>
                set((state) => {
                    state.groupBy = key;
                }),
        }))
    );
};
