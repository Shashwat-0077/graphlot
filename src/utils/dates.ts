import type { DayOfWeek } from "@/constants";

export function getDayOfWeek(dateInput: string | Date): string {
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return days[date.getDay()];
}

export function getShortMonth(date: Date | undefined): string | null {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
    ];
    return date ? months[date.getMonth()] : null;
}

export function getPreviousSunday(dateInput: string | Date): Date {
    const date =
        dateInput instanceof Date ? new Date(dateInput) : new Date(dateInput);
    const dayOfWeek = date.getDay();
    date.setDate(date.getDate() - dayOfWeek);
    return date;
}

export function getProcessedData(
    values: {
        date: string;
        count: number;
    }[]
): { weeks: { date: Date; count: number }[][]; maxCount: number } {
    if (values.length === 0) {
        return { weeks: [], maxCount: 0 };
    }

    // Convert all dates to Date objects and sort them
    const sortedValues = values
        .map(({ date, count }) => ({ date: new Date(date), count }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Set the latest date to today
    const latestDate = new Date(); // Today's date

    // Get the earliest date from the sorted values
    const earliestDate = new Date(
        latestDate.getTime() - 1000 * 60 * 60 * 24 * 365
    ); // a year before

    // Initialize the result array and maxCount
    const weeks: { date: Date; count: number }[][] = [];
    let maxCount = 0;

    // Start from the previous Sunday of the earliest date
    const currentDate = getPreviousSunday(earliestDate);

    // Loop through each week until we surpass today's date
    while (currentDate <= latestDate) {
        const week: { date: Date; count: number }[] = [];

        // Loop through each day of the week
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentDate);

            date.setDate(currentDate.getDate() + i);
            date.setHours(0, 0, 0, 0);

            if (date > latestDate) {
                break;
            }

            // Find the corresponding count in the sortedValues array
            const value = sortedValues.find(
                (v) => v.date.toDateString() === date.toDateString()
            );

            // Update maxCount if the current count is greater
            if (value && value.count > maxCount) {
                maxCount = value.count;
            }

            // Push the date and count (or 0 if not found) to the week array
            week.push({
                date,
                count: value ? value.count : 0,
            });
        }

        // Push the week to the weeks array
        weeks.push(week);

        // Move to the next week
        currentDate.setDate(currentDate.getDate() + 7);
    }

    return { weeks, maxCount };
}

export const getFullDayFromAbbr = (day: DayOfWeek): string => {
    const days: {
        [key in DayOfWeek]: string;
    } = {
        Mon: "Monday",
        Tue: "Tuesday",
        Wed: "Wednesday",
        Thu: "Thursday",
        Fri: "Friday",
        Sat: "Saturday",
        Sun: "Sunday",
    };

    return days[day];
};
