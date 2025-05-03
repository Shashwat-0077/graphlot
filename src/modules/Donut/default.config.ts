import {
    ColorType,
    FilterType,
    SORT_DEFAULT,
    SortOptionsType,
} from "@/constants";

const defaultDonutChartConfig = {
    background_color: { r: 25, g: 25, b: 25, a: 1 } as ColorType,
    text_color: { r: 255, g: 255, b: 255, a: 1 } as ColorType,
    tooltip_enabled: true,
    label_enabled: true,
    legend_enabled: true,
    has_border: false,
    color_palette: [] as ColorType[],
    x_axis: "",
    sort_by: SORT_DEFAULT as SortOptionsType,
    omit_zero_values: false,
    filters: [] as FilterType[],
};

export default defaultDonutChartConfig;
