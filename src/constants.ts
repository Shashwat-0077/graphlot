import { z } from "zod";

export const AREA = "Area" as const;
export const BAR = "Bar" as const;
export const DONUT = "Donut" as const;
export const RADAR = "Radar" as const;
export const HEATMAP = "Heatmap" as const;

export const CHART_TYPES = [AREA, BAR, DONUT, HEATMAP, RADAR] as const;
export type ChartType = (typeof CHART_TYPES)[number];

export const GRID_NONE = "NONE" as const;
export const GRID_HORIZONTAL = "HORIZONTAL" as const;
export const GRID_VERTICAL = "VERTICAL" as const;
export const GRID_BOTH = "BOTH" as const;
export const GRID_TYPE = [
    GRID_NONE,
    GRID_HORIZONTAL,
    GRID_VERTICAL,
    GRID_BOTH,
] as const;
export type GridType = (typeof GRID_TYPE)[number];

export const ColorSchema = z.object({
    r: z.number().min(0).max(255),
    g: z.number().min(0).max(255),
    b: z.number().min(0).max(255),
    a: z.number().min(0).max(1),
});

export type ColorType = z.infer<typeof ColorSchema>;

export const FilterSchema = z.object({
    column: z.string(),
    operation: z.string(),
    value: z.string(),
});
export type FilterType = z.infer<typeof FilterSchema>;

export const DAY_OF_WEEK = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
] as const;
export type DayOfWeek = (typeof DAY_OF_WEEK)[number];

export type ChartViewComponentType = ({
    chartName,
    notion_table_id,
}: {
    chartName: string;
    notion_table_id: string;
}) => React.JSX.Element;

export type ChartConfigComponentType = ({
    notion_table_id,
    chart_id,
}: {
    notion_table_id: string;
    chart_id: string;
}) => React.JSX.Element;

export type StateProviderType = ({
    children,
    char_id,
}: {
    children: React.ReactNode;
    char_id: string;
}) => React.JSX.Element;
