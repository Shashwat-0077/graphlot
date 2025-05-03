import {
    ColorType,
    FilterType,
    GRID_HORIZONTAL,
    GridType,
    SORT_DEFAULT,
    SortOptionsType,
} from "@/constants";

const defaultAreaChartConfig = {
    background_color: { r: 25, g: 25, b: 25, a: 1 } as ColorType,
    text_color: { r: 255, g: 255, b: 255, a: 1 } as ColorType,
    tooltip_enabled: true,
    label_enabled: true,
    legend_enabled: true,
    has_border: true,
    color_palette: [] as ColorType[],
    x_axis: "",
    y_axis: "",
    sort_y: SORT_DEFAULT as SortOptionsType,
    sort_x: SORT_DEFAULT as SortOptionsType,
    omit_zero_values: false,
    cumulative: false,
    filters: [] as FilterType[],
    grid_color: { r: 35, g: 35, b: 35, a: 1 } as ColorType,
    grid_type: GRID_HORIZONTAL as GridType,
};

export default defaultAreaChartConfig;
