"use client";

import { HeatMap } from "@/components/ui/HeatMap";
import { cn } from "@/lib/utils";
import { useHeatmapChartStore } from "@/modules/Heatmap/store";
import { getProcessedData } from "@/utils/date";

const values = [
    { date: "2024-02-26", count: 5 },
    { date: "2024-08-01", count: 3 },
    { date: "2024-08-10", count: 7 },
    { date: "2024-08-15", count: 2 },
    { date: "2024-08-20", count: 8 },
    { date: "2024-09-01", count: 4 },
    { date: "2024-09-10", count: 6 },
    { date: "2024-09-15", count: 1 },
    { date: "2024-09-20", count: 9 },
    { date: "2024-10-01", count: 0 },
    { date: "2024-10-10", count: 5 },
    { date: "2024-10-15", count: 3 },
    { date: "2024-10-20", count: 7 },
    { date: "2024-11-01", count: 2 },
    { date: "2024-11-10", count: 8 },
    { date: "2024-11-15", count: 4 },
    { date: "2024-11-20", count: 6 },
    { date: "2024-12-01", count: 1 },
    { date: "2024-12-10", count: 9 },
    { date: "2024-12-15", count: 0 },
    { date: "2024-12-20", count: 5 },
    { date: "2025-01-01", count: 3 },
    { date: "2025-01-10", count: 7 },
    { date: "2025-01-15", count: 2 },
    { date: "2025-01-20", count: 8 },
    { date: "2025-02-01", count: 4 },
    { date: "2025-02-10", count: 6 },
    { date: "2025-02-15", count: 1 },
    { date: "2025-02-20", count: 9 },
    { date: "2025-02-26", count: 5 }, // Today's date
];

export const HeatmapChartView = () => {
    const { weeks, maxCount } = getProcessedData(values);

    const { borderEnabled, backgroundColor } = useHeatmapChartStore(
        (state) => state
    );

    return (
        <div
            className={cn(
                `flex w-full flex-col items-center justify-center overflow-hidden rounded-xl pb-7 pt-7`,
                borderEnabled && "border"
            )}
            style={{
                backgroundColor: `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a}`,
            }}
        >
            <HeatMap weeks={weeks} maxCount={maxCount} />
        </div>
    );
};
