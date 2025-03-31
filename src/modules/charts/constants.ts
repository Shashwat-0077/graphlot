export const AREA = "Area" as const;
export const BAR = "Bar" as const;
export const DONUT = "Donut" as const;
export const RADAR = "Radar" as const;
export const HEATMAP = "Heatmap" as const;

export const CHART_TYPES = [AREA, BAR, DONUT, HEATMAP, RADAR] as const;
export type ChartType = (typeof CHART_TYPES)[number];
