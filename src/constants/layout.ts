export const LAYOUT_TYPE_GRID = 'GRID' as const;
export const LAYOUT_TYPE_CAROUSEL = 'CAROUSEL' as const;

export const LAYOUT_OPTIONS = [LAYOUT_TYPE_GRID, LAYOUT_TYPE_CAROUSEL] as const;
export type LayoutType = (typeof LAYOUT_OPTIONS)[number];
