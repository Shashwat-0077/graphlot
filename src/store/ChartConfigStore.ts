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
    showGrid: boolean;
    showToolTip: boolean;
    dataLabels: "value" | "percentage" | "None";
    colors: ColorType[];
    bgColor: ColorType;
    gridColor: ColorType;
    XAxis: string;
    YAxis: string;
    groupBy: string;
    filters: {
        column: string;
        operation: string;
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
    setGridColor: (color: ColorType) => void;
    setGroupBy: (key: string) => void;
    setDataLabels: (value: "value" | "percentage" | "None") => void;
    setFilterColumn: (column: string, index: number) => void;
    setFilterOperation: (operation: string, index: number) => void;
    setFilterValue: (value: string, index: number) => void;

    // toggles
    toggleLabel: () => void;
    toggleLegends: () => void;
    toggleGrid: () => void;
    toggleToolTip: () => void;

    // add/remove
    addColor: () => void;
    removeColor: (index: number) => void;
    addFilter: (filter: {
        column: string;
        operation: string;
        value: string;
    }) => void;
    removeFilter: (index: number) => void;

    // actions
    clearColors: () => void;
    clearFilters: () => void;
    changeChartType: (type: NonNullable<ChartType>) => void;
};

export type ChartConfigStore = ChartConfigState & ChartConfigActions;

export const defaultInitState: ChartConfigState = {
    type: null,
    label: "",
    showLabel: true,
    showGrid: true,
    showToolTip: true,
    showLegends: true,
    dataLabels: "value",
    colors: [],
    bgColor: { r: 25, g: 25, b: 25, a: 1 },
    gridColor: { r: 38, g: 38, b: 38, a: 1 },
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
                    state.dataLabels = value;
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
                    state.bgColor = color;
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
            clearColors: () =>
                set((state) => {
                    state.colors = [];
                }),
            toggleGrid: () =>
                set((state) => {
                    state.showGrid = !state.showGrid;
                }),
            toggleToolTip: () =>
                set((state) => {
                    state.showToolTip = !state.showToolTip;
                }),
            setGridColor: (color) =>
                set((state) => {
                    state.gridColor = color;
                }),
            addFilter: (filter) =>
                set((state) => {
                    state.filters.push(filter);
                }),
            removeFilter: (index) =>
                set((state) => {
                    state.filters.splice(index, 1);
                }),
            setFilterColumn: (column, index) =>
                set((state) => {
                    state.filters[index].column = column;
                }),
            setFilterOperation: (operation, index) =>
                set((state) => {
                    state.filters[index].operation = operation;
                }),
            setFilterValue: (value, index) =>
                set((state) => {
                    state.filters[index].value = value;
                }),
            clearFilters: () =>
                set((state) => {
                    state.filters = [];
                }),
        }))
    );
};
