export const TOOLTIP_STYLE_DASHED = 'dashed' as const;
export const TOOLTIP_STYLE_DOT = 'dot' as const;
export const TOOLTIP_STYLE_LINE = 'line' as const;

export const TOOLTIP_STYLE_OPTIONS = [TOOLTIP_STYLE_DASHED, TOOLTIP_STYLE_DOT, TOOLTIP_STYLE_LINE] as const;
export type TooltipStyle = (typeof TOOLTIP_STYLE_OPTIONS)[number];
