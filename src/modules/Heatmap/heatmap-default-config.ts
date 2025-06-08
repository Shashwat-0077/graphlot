import { RGBAColor, DayOfWeek } from "@/constants";

export const defaultHeatmapConfig = {
    backgroundColor: { r: 255, g: 255, b: 255, a: 1 } as RGBAColor,
    textColor: { r: 0, g: 0, b: 0, a: 1 } as RGBAColor,

    tooltipEnabled: true,
    labelEnabled: true,
    borderEnabled: true,

    metric: "",
    streak: 0,
    streakColor: { r: 0, g: 128, b: 0, a: 1 } as RGBAColor,
    streakEnabled: true,
    daysToIncludeInStreak: [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
    ] as DayOfWeek[],

    longestStreak: 0,
    longestStreakColor: { r: 255, g: 0, b: 0, a: 1 } as RGBAColor,
    longestStreakEnabled: true,

    sumOfAllEntries: 0,
    sumOfAllEntriesColor: { r: 0, g: 0, b: 255, a: 1 } as RGBAColor,
    sumOfAllEntriesEnabled: true,

    averageOfAllEntries: 0,
    averageOfAllEntriesColor: { r: 128, g: 0, b: 128, a: 1 } as RGBAColor,
    averageOfAllEntriesEnabled: true,

    numberOfEntries: 0,
    numberOfEntriesColor: { r: 255, g: 165, b: 0, a: 1 } as RGBAColor,
    numberOfEntriesEnabled: true,

    buttonHoverEnabled: true,

    defaultBoxColor: { r: 240, g: 240, b: 240, a: 1 } as RGBAColor,
    accent: { r: 0, g: 123, b: 255, a: 1 } as RGBAColor,
};
