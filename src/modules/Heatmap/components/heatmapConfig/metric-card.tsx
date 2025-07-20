"use client";

import { Zap, Maximize2, Layers, LineChart, SquareStack } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useHeatmapChartStore } from "@/modules/Heatmap/store";
import { DAYS_OF_WEEK } from "@/constants";
import { getFullDayFromAbbr } from "@/utils/date";

type MetricType =
    | "streak"
    | "longestStreak"
    | "sumOfAllEntries"
    | "averageOfAllEntries"
    | "numberOfEntries";

interface MetricCardProps {
    type: MetricType;
}

const metricConfig = {
    streak: {
        title: "Current Streak",
        icon: Zap,
        description: "Consecutive entries",
    },
    longestStreak: {
        title: "Longest Streak",
        icon: Maximize2,
        description: "Best streak",
    },
    sumOfAllEntries: {
        title: "Total",
        icon: Layers,
        description: "Sum",
    },
    averageOfAllEntries: {
        title: "Average",
        icon: LineChart,
        description: "Avg",
    },
    numberOfEntries: {
        title: "Entry Count",
        icon: SquareStack,
        description: "Count",
    },
};

export function MetricCard({ type }: MetricCardProps) {
    const config = metricConfig[type];
    const Icon = config.icon;

    // Get state based on type
    const enabled = useHeatmapChartStore((state) => {
        switch (type) {
            case "streak":
                return state.streak.enabled;
            case "longestStreak":
                return state.longestStreak.enabled;
            case "sumOfAllEntries":
                return state.sumOfAllEntries.enabled;
            case "averageOfAllEntries":
                return state.averageOfAllEntries.enabled;
            case "numberOfEntries":
                return state.numberOfEntries.enabled;
        }
    });

    const value = useHeatmapChartStore((state) => {
        switch (type) {
            case "streak":
                return state.streak.value;
            case "longestStreak":
                return state.longestStreak.value;
            case "sumOfAllEntries":
                return state.sumOfAllEntries.value;
            case "averageOfAllEntries":
                return state.averageOfAllEntries.value;
            case "numberOfEntries":
                return state.numberOfEntries.value;
        }
    });

    const color = useHeatmapChartStore((state) => {
        switch (type) {
            case "streak":
                return state.streak.color;
            case "longestStreak":
                return state.longestStreak.color;
            case "sumOfAllEntries":
                return state.sumOfAllEntries.color;
            case "averageOfAllEntries":
                return state.averageOfAllEntries.color;
            case "numberOfEntries":
                return state.numberOfEntries.color;
        }
    });

    const toggle = useHeatmapChartStore((state) => {
        switch (type) {
            case "streak":
                return state.toggleStreak;
            case "longestStreak":
                return state.toggleLongestStreak;
            case "sumOfAllEntries":
                return state.toggleSumOfAllEntries;
            case "averageOfAllEntries":
                return state.toggleAverageOfAllEntries;
            case "numberOfEntries":
                return state.toggleNumberOfEntries;
        }
    });

    // Special handling for streak days
    const isDayIncludedInStreak = useHeatmapChartStore(
        (state) => state.isDayIncludedInStreak
    );
    const toggleDaysToIncludeInStreak = useHeatmapChartStore(
        (state) => state.toggleDaysToIncludeInStreak
    );

    const displayValue =
        type === "averageOfAllEntries" && typeof value === "number"
            ? value.toFixed(1)
            : value || 0;

    return (
        <Card
            className={`transition-all ${enabled ? "ring-2 ring-primary" : ""}`}
        >
            <CardHeader className="cursor-pointer" onClick={toggle}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Checkbox checked={enabled} />
                        <div>
                            <CardTitle className="text-base">
                                {config.title}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                {config.description}: {displayValue}
                            </CardDescription>
                        </div>
                    </div>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            {enabled && (
                <CardContent className="pt-0">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div
                                className="h-4 w-4 rounded"
                                style={{
                                    backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
                                }}
                            />
                            <span className="text-sm">Color Preview</span>
                        </div>
                        {type === "streak" && (
                            <div className="space-y-2">
                                <Label className="text-xs">Include days:</Label>
                                <div className="grid grid-cols-2 gap-1">
                                    {DAYS_OF_WEEK.map((abbr) => (
                                        <div
                                            key={abbr}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox
                                                id={`day-${abbr}`}
                                                checked={isDayIncludedInStreak(
                                                    abbr
                                                )}
                                                onCheckedChange={() =>
                                                    toggleDaysToIncludeInStreak(
                                                        abbr
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`day-${abbr}`}
                                                className="text-xs"
                                            >
                                                {getFullDayFromAbbr(abbr).slice(
                                                    0,
                                                    3
                                                )}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
