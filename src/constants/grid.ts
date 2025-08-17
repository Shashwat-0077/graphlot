export const GRID_ORIENTATION_TYPE_ONE = "TYPE_ONE" as const; // horizontal lines and for radar its polygon
export const GRID_ORIENTATION_TYPE_TWO = "TYPE_TWO" as const; // vertical lines and for radar its circular lines
export const GRID_ORIENTATION_TYPE_THREE = "TYPE_THREE" as const; // both horizontal and vertical lines and for radar its nothing

export const GRID_ORIENTATION_OPTIONS = [
    GRID_ORIENTATION_TYPE_ONE,
    GRID_ORIENTATION_TYPE_TWO,
    GRID_ORIENTATION_TYPE_THREE,
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
