import { RGBAColor, ChartFilter, SORT_DEFAULT, SortType } from "@/constants";

const defaultRadarChartConfig = {
    background_color: { r: 25, g: 25, b: 25, a: 1 } as RGBAColor,
    text_color: { r: 255, g: 255, b: 255, a: 1 } as RGBAColor,
    tooltip_enabled: true,
    label_enabled: true,
    legend_enabled: true,
    has_border: false,
    color_palette: [] as RGBAColor[],
    x_axis: "",
    y_axis: "",
    sort_x: SORT_DEFAULT as SortType,
    sort_y: SORT_DEFAULT as SortType,
    omit_zero_values: false,
    cumulative: false,
    filters: [] as ChartFilter[],
    grid_color: { r: 35, g: 35, b: 35, a: 1 } as RGBAColor,
    grid_enabled: true,
};

export default defaultRadarChartConfig;
