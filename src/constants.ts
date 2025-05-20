import { z } from "zod";
import {
    GetDatabaseResponse,
    PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

// === Chart Types ===
export const CHART_TYPE_AREA = "Area" as const;
export const CHART_TYPE_BAR = "Bar" as const;
export const CHART_TYPE_RADIAL = "Radial" as const;
export const CHART_TYPE_RADAR = "Radar" as const;
export const CHART_TYPE_HEATMAP = "Heatmap" as const;

export const CHART_TYPES = [
    CHART_TYPE_AREA,
    CHART_TYPE_BAR,
    CHART_TYPE_RADIAL,
    CHART_TYPE_HEATMAP,
    CHART_TYPE_RADAR,
] as const;
export type ChartType = (typeof CHART_TYPES)[number];

// === Grid Types ===
export const GRID_ORIENTATION_NONE = "NONE" as const;
export const GRID_ORIENTATION_HORIZONTAL = "HORIZONTAL" as const;
export const GRID_ORIENTATION_VERTICAL = "VERTICAL" as const;
export const GRID_ORIENTATION_BOTH = "BOTH" as const;

export const GRID_ORIENTATION_OPTIONS = [
    GRID_ORIENTATION_NONE,
    GRID_ORIENTATION_HORIZONTAL,
    GRID_ORIENTATION_VERTICAL,
    GRID_ORIENTATION_BOTH,
] as const;
export type GridOrientation = (typeof GRID_ORIENTATION_OPTIONS)[number];

export const GRID_STYLE_DASHED = "dashed" as const;
export const GRID_STYLE_DOTTED = "dotted" as const;
export const GRID_STYLE_SOLID = "solid" as const;
export const GRID_STYLE_OPTIONS = [
    GRID_STYLE_DASHED,
    GRID_STYLE_DOTTED,
    GRID_STYLE_SOLID,
] as const;
export type GridStyle = (typeof GRID_STYLE_OPTIONS)[number];

// === Color Type ===
export const ColorSchema = z.object({
    r: z.number().min(0).max(255),
    g: z.number().min(0).max(255),
    b: z.number().min(0).max(255),
    a: z.number().min(0).max(1),
});
export type RGBAColor = z.infer<typeof ColorSchema>;

// === Filter Type ===
export const FilterSchema = z.object({
    column: z.string(),
    operation: z.string(),
    value: z.string(),
});
export type ChartFilter = z.infer<typeof FilterSchema>;

// === Days of Week ===
export const DAYS_OF_WEEK = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

// === Component Types ===
export type ChartViewComponent = (props: {
    chartName: string;
    notionTableId: string;
    userId: string;
}) => React.JSX.Element;

export type ChartConfigComponent = (props: {
    notionTableId: string;
    chartId: string;
}) => React.JSX.Element;

export type ChartStateProvider = (props: {
    children: React.ReactNode;
    chartId: string;
}) => React.JSX.Element;

// === Notion Types ===
export type NotionPropertySchema = GetDatabaseResponse["properties"];
export type NotionPropertyData = PageObjectResponse["properties"];

// === Sort Options ===
export const SORT_ALPHA_ASC = "Alphabetically - ASC" as const;
export const SORT_ALPHA_DESC = "Alphabetically - DSC" as const;
export const SORT_NUMERIC_ASC = "Numerically - ASC" as const;
export const SORT_NUMERIC_DESC = "Numerically - DSC" as const;
export const SORT_NONE = "None" as const;

export const SORT_OPTIONS = [
    SORT_ALPHA_ASC,
    SORT_ALPHA_DESC,
    SORT_NUMERIC_ASC,
    SORT_NUMERIC_DESC,
    SORT_NONE,
] as const;
export type SortType = (typeof SORT_OPTIONS)[number];

// === Layout Options ===
export const LAYOUT_TYPE_GRID = "GRID" as const;
export const LAYOUT_TYPE_CAROUSEL = "CAROUSEL" as const;

export const LAYOUT_OPTIONS = [LAYOUT_TYPE_GRID, LAYOUT_TYPE_CAROUSEL] as const;
export type LayoutType = (typeof LAYOUT_OPTIONS)[number];

// === Tooltips types ===
const TOOLTIP_STYLE_DASHED = "dashed" as const;
const TOOLTIP_STYLE_DOT = "dot" as const;
const TOOLTIP_STYLE_LINE = "line" as const;

export const TOOLTIP_STYLE_OPTIONS = [
    TOOLTIP_STYLE_DASHED,
    TOOLTIP_STYLE_DOT,
    TOOLTIP_STYLE_LINE,
] as const;
export type TooltipStyle = (typeof TOOLTIP_STYLE_OPTIONS)[number];

// === Area Chart Types ===
export const AREA_CHART_STYLE_LINEAR = "linear" as const;
export const AREA_CHART_STYLE_STEP = "step" as const;
export const AREA_CHART_STYLE_BUMP = "bump" as const;
export const AREA_CHART_STYLE_MONOTONE = "monotone" as const;
export const AREA_CHART_STYLE_NATURAL = "natural" as const;

export const AREA_CHART_STYLE_OPTIONS = [
    AREA_CHART_STYLE_LINEAR,
    AREA_CHART_STYLE_STEP,
    AREA_CHART_STYLE_BUMP,
    AREA_CHART_STYLE_MONOTONE,
    AREA_CHART_STYLE_NATURAL,
] as const;

export type AreaChartStyle = (typeof AREA_CHART_STYLE_OPTIONS)[number];

// === RANGES ===
export const MIN_BORDER_WIDTH = 0;
export const MAX_BORDER_WIDTH = 5;

export const MIN_STROKE_WIDTH = 1;
export const MAX_STROKE_WIDTH = 5;

export const MIN_OPACITY = 0;
export const MAX_OPACITY = 1;

export const MIN_TEXT_SIZE = 0;
export const MAX_TEXT_SIZE = 40;

// === ANCHOR ===
export const ANCHOR_START = "start" as const;
export const ANCHOR_MIDDLE = "middle" as const;
export const ANCHOR_END = "end" as const;
export const ANCHOR_OPTIONS = [
    ANCHOR_START,
    ANCHOR_MIDDLE,
    ANCHOR_END,
] as const;
export type AnchorType = (typeof ANCHOR_OPTIONS)[number];

// === FONTS ===
export const FONT_OPTIONS = [
    "Arial",
    "Courier New",
    "Georgia",
    "Times New Roman",
    "Trebuchet MS",
] as const;
export type FontType = (typeof FONT_OPTIONS)[number];

export const FONT_STYLES_BOLD = "bold" as const;
export const FONT_STYLES_ITALIC = "italic" as const;
export const FONT_STYLES_NORMAL = "normal" as const;
export const FONT_STYLES_UNDERLINE = "underline" as const;
export const FONT_STYLES_STRIKETHROUGH = "strikethrough" as const;
export const FONT_STYLES_OPTIONS = [
    FONT_STYLES_BOLD,
    FONT_STYLES_ITALIC,
    FONT_STYLES_NORMAL,
    FONT_STYLES_UNDERLINE,
    FONT_STYLES_STRIKETHROUGH,
] as const;
export type FontStyleType = (typeof FONT_STYLES_OPTIONS)[number];

export const RADIAL_LEGEND_POSITION_END = "end" as const;
export const RADIAL_LEGEND_POSITION_INSIDE_START = "insideStart" as const;
export const RADIAL_LEGEND_POSITION_INSIDE_END = "insideEnd" as const;
export const RADIAL_LEGEND_POSITION_MIDDLE = "middle" as const;

export const RADIAL_LEGEND_POSITION_OPTIONS = [
    RADIAL_LEGEND_POSITION_END,
    RADIAL_LEGEND_POSITION_INSIDE_START,
    RADIAL_LEGEND_POSITION_INSIDE_END,
    RADIAL_LEGEND_POSITION_MIDDLE,
] as const;
export type RadialLegendPositionType =
    (typeof RADIAL_LEGEND_POSITION_OPTIONS)[number];
