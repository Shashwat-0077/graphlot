import {
    RGBAColor,
    ChartFilter,
    GRID_HORIZONTAL,
    GridOrientation,
    SORT_DEFAULT,
} from "@/constants";

const defaultBarChartConfig = {
    background_color: { r: 25, g: 25, b: 25, a: 1 } as RGBAColor,
    text_color: { r: 255, g: 255, b: 255, a: 1 } as RGBAColor,
    tooltip_enabled: true,
    label_enabled: true,
    legend_enabled: true,
    has_border: true,
    color_palette: [] as RGBAColor[],
    x_axis: "",
    y_axis: "",
    sort_x: SORT_DEFAULT,
    sort_y: SORT_DEFAULT,
    omit_zero_values: false,
    cumulative: false,
    filters: [] as ChartFilter[],
    grid_color: { r: 35, g: 35, b: 35, a: 1 } as RGBAColor,
    grid_type: GRID_HORIZONTAL as GridOrientation,
    bar_gap: 20,
    bar_size: 5,
};

export default defaultBarChartConfig;
