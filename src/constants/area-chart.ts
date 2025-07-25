export const AREA_CHART_LINE_STYLE_LINEAR = 'linear' as const;
export const AREA_CHART_LINE_STYLE_STEP = 'step' as const;
export const AREA_CHART_LINE_STYLE_BUMP = 'bump' as const;
export const AREA_CHART_LINE_STYLE_MONOTONE = 'monotone' as const;
export const AREA_CHART_LINE_STYLE_NATURAL = 'natural' as const;

export const AREA_CHART_LINE_STYLE_OPTIONS = [
    AREA_CHART_LINE_STYLE_LINEAR,
    AREA_CHART_LINE_STYLE_STEP,
    AREA_CHART_LINE_STYLE_BUMP,
    AREA_CHART_LINE_STYLE_MONOTONE,
    AREA_CHART_LINE_STYLE_NATURAL,
] as const;

export type AreaChartLineStyle = (typeof AREA_CHART_LINE_STYLE_OPTIONS)[number];
