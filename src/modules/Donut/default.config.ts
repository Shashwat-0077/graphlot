import { RGBAColor, ChartFilter, SORT_DEFAULT, SortType } from "@/constants";

const defaultDonutChartConfig = {
    background_color: { r: 25, g: 25, b: 25, a: 1 } as RGBAColor,
    text_color: { r: 255, g: 255, b: 255, a: 1 } as RGBAColor,
    tooltip_enabled: true,
    label_enabled: true,
    legend_enabled: true,
    has_border: false,
    color_palette: [] as RGBAColor[],
    x_axis: "",
    sort_by: SORT_DEFAULT as SortType,
    omit_zero_values: false,
    filters: [] as ChartFilter[],
};

export default defaultDonutChartConfig;
