import { ANCHOR_OPTIONS, FONT_OPTIONS, FONT_STYLES_OPTIONS } from "@/constants";

export const defaultChartTypographySettings = {
    label: "",
    labelEnabled: false,
    labelSize: 12,
    labelFontFamily: FONT_OPTIONS[0],
    labelFontStyle: FONT_STYLES_OPTIONS[2],
    labelAnchor: ANCHOR_OPTIONS[0],
    legendEnabled: true,
};
