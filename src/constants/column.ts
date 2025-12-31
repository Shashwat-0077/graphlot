export const COLUMN_SELECT_TYPES = {
    NUMBER: "Number",
    DATE: "Date",
    SELECT: "Select",
    MULTISELECT: "Multi-select",
    NONE: "None",
} as const;

export type ColumnType = {
    Status: string[];
    Select: string[];
    "Multi Select": string[];
    Number: string[];
    Date: string[];
};
export type ColumnMapSelectOptions =
    (typeof COLUMN_SELECT_TYPES)[keyof typeof COLUMN_SELECT_TYPES];
