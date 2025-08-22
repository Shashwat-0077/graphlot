import { RGBAColor, DayOfWeek } from "@/constants";

export const defaultHeatmapConfig = {
    backgroundColor: { r: 18, g: 18, b: 18, a: 1 } as RGBAColor, // very dark background
    textColor: { r: 230, g: 230, b: 230, a: 1 } as RGBAColor, // light gray text

    dateField: "",
    valueField: "",

    tooltipEnabled: true,
    labelEnabled: true,
    borderEnabled: true,
    legendEnabled: true,

    boxBorderRadius: 0, // in px

    metric: "",

    streak: {
        value: 0,
        enabled: true,
        color: { r: 0, g: 200, b: 100, a: 1 } as RGBAColor, // teal-green
        daysToInclude: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
        ] as DayOfWeek[],
    },

    longestStreak: {
        value: 0,
        enabled: true,
        color: { r: 255, g: 82, b: 82, a: 1 } as RGBAColor, // soft red
    },

    sumOfAllEntries: {
        value: 0,
        enabled: true,
        color: { r: 66, g: 165, b: 245, a: 1 } as RGBAColor, // blue
    },

    averageOfAllEntries: {
        value: 0,
        enabled: true,
        color: { r: 156, g: 39, b: 176, a: 1 } as RGBAColor, // purple
    },

    numberOfEntries: {
        value: 0,
        enabled: true,
        color: { r: 255, g: 193, b: 7, a: 1 } as RGBAColor, // amber
    },

    buttonHoverEnabled: true,
    defaultBoxColor: { r: 38, g: 38, b: 38, a: 1 } as RGBAColor, // dark gray boxes
    accent: { r: 0, g: 123, b: 255, a: 1 } as RGBAColor, // blue accent
};
