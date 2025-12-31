export const SORT_ALPHA_ASC = 'Alphabetically - ASC' as const;
export const SORT_ALPHA_DESC = 'Alphabetically - DSC' as const;
export const SORT_NUMERIC_ASC = 'Numerically - ASC' as const;
export const SORT_NUMERIC_DESC = 'Numerically - DSC' as const;
export const SORT_NONE = 'None' as const;

export const SORT_OPTIONS = [SORT_ALPHA_ASC, SORT_ALPHA_DESC, SORT_NUMERIC_ASC, SORT_NUMERIC_DESC, SORT_NONE] as const;
export type SortType = (typeof SORT_OPTIONS)[number];
