export type FontType =
    | "Arial"
    | "Courier New"
    | "Georgia"
    | "Times New Roman"
    | "Trebuchet MS";
export const FONT_OPTIONS = [
    "Arial",
    "Courier New",
    "Georgia",
    "Times New Roman",
    "Trebuchet MS",
] as const;

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
