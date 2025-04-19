import { ColorType, DayOfWeek } from "@/constants";

const defaultHeatmapChartConfig = {
    background_color: { r: 25, g: 25, b: 25, a: 1 } as ColorType,
    text_color: { r: 255, g: 255, b: 255, a: 1 } as ColorType,
    tooltip_enabled: true,
    label_enabled: true,
    has_border: false,
    metric: "count",
    streak: 0,
    streak_color: { r: 255, g: 255, b: 255, a: 1 } as ColorType,
    streak_enabled: true,
    days_to_include_in_streak: [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
    ] as DayOfWeek[],
    longest_streak: 0,
    longest_streak_color: { r: 255, g: 255, b: 255, a: 1 } as ColorType,
    longest_streak_enabled: true,
    sum_of_all_entries: 0,
    sum_of_all_entries_color: { r: 255, g: 255, b: 255, a: 1 } as ColorType,
    sum_of_all_entries_enabled: true,
    average_of_all_entries: 0,
    average_of_all_entries_color: { r: 255, g: 255, b: 255, a: 1 } as ColorType,
    average_of_all_entries_enabled: true,
    number_of_entries: 0,
    number_of_entries_color: { r: 255, g: 255, b: 255, a: 1 } as ColorType,
    number_of_entries_enabled: true,
    button_hover_enabled: false,
    default_box_color: { r: 38, g: 38, b: 38, a: 1 } as ColorType,
    accent: { r: 255, g: 255, b: 255, a: 1 } as ColorType,
};

export default defaultHeatmapChartConfig;
