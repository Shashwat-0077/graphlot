export const CHART_TYPE_AREA = 'Area' as const;
export const CHART_TYPE_BAR = 'Bar' as const;
export const CHART_TYPE_RADIAL = 'Radial' as const;
export const CHART_TYPE_RADAR = 'Radar' as const;
export const CHART_TYPE_HEATMAP = 'Heatmap' as const;

export const CHART_TYPES = [
    CHART_TYPE_AREA,
    CHART_TYPE_BAR,
    CHART_TYPE_RADIAL,
    CHART_TYPE_HEATMAP,
    CHART_TYPE_RADAR,
] as const;
export type ChartType = (typeof CHART_TYPES)[number];
