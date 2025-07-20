import { RGBAColor, DayOfWeek } from "@/constants";

export const defaultHeatmapConfig = {
    backgroundColor: { r: 255, g: 255, b: 255, a: 1 } as RGBAColor,
    textColor: { r: 0, g: 0, b: 0, a: 1 } as RGBAColor,

    dateField: "",
    valueField: "",

    tooltipEnabled: true,
    labelEnabled: true,
    borderEnabled: true,
    legendEnabled: true,

    metric: "",

    streak: {
        value: 0,
        enabled: true,
        color: { r: 0, g: 128, b: 0, a: 1 } as RGBAColor,
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
        color: { r: 255, g: 0, b: 0, a: 1 } as RGBAColor,
    },

    sumOfAllEntries: {
        value: 0,
        enabled: true,
        color: { r: 0, g: 0, b: 255, a: 1 } as RGBAColor,
    },

    averageOfAllEntries: {
        value: 0,
        enabled: true,
        color: { r: 128, g: 0, b: 128, a: 1 } as RGBAColor,
    },

    numberOfEntries: {
        value: 0,
        enabled: true,
        color: { r: 255, g: 165, b: 0, a: 1 } as RGBAColor,
    },

    buttonHoverEnabled: true,
    defaultBoxColor: { r: 240, g: 240, b: 240, a: 1 } as RGBAColor,
    accent: { r: 0, g: 123, b: 255, a: 1 } as RGBAColor,
};
