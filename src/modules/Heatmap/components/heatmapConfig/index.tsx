"use client";

import { useEffect, useState } from "react";

import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHeatmapChartStore } from "@/modules/Heatmap/store";
import type { ChartConfigComponent } from "@/constants";
import { useUpdateHeatmap } from "@/modules/Heatmap/api/client/use-update-heatmap";

import { HeatmapHeader } from "./heatmap-header";
import { QuickStatsCards } from "./quick-stats-cards";
import { BasicsTab } from "./tabs/basics-tab";
import { MetricsTab } from "./tabs/metrics-tab";
import { AppearanceTab } from "./tabs/appearance-tab";
import { ColorsTab } from "./tabs/colors-tab";
import { SaveReminder } from "./save-reminder";

export const HeatmapConfig: ChartConfigComponent = ({ chartId }) => {
    const [isLoading, setIsLoading] = useState(false);

    // Store state
    const backgroundColor = useHeatmapChartStore(
        (state) => state.backgroundColor
    );
    const textColor = useHeatmapChartStore((state) => state.textColor);
    const tooltipEnabled = useHeatmapChartStore(
        (state) => state.tooltipEnabled
    );
    const dateField = useHeatmapChartStore((state) => state.dateField);
    const valueField = useHeatmapChartStore((state) => state.valueField);
    const labelEnabled = useHeatmapChartStore((state) => state.labelEnabled);
    const borderEnabled = useHeatmapChartStore((state) => state.borderEnabled);
    const legendEnabled = useHeatmapChartStore((state) => state.legendEnabled);
    const metric = useHeatmapChartStore((state) => state.metric);

    // Streak states
    const streakValue = useHeatmapChartStore((state) => state.streak.value);
    const streakEnabled = useHeatmapChartStore((state) => state.streak.enabled);
    const streakColor = useHeatmapChartStore((state) => state.streak.color);
    const daysToIncludeInStreak = useHeatmapChartStore(
        (state) => state.streak.daysToInclude
    );

    // Other metric states
    const longestStreakValue = useHeatmapChartStore(
        (state) => state.longestStreak.value
    );
    const longestStreakEnabled = useHeatmapChartStore(
        (state) => state.longestStreak.enabled
    );
    const longestStreakColor = useHeatmapChartStore(
        (state) => state.longestStreak.color
    );

    const sumOfAllEntriesValue = useHeatmapChartStore(
        (state) => state.sumOfAllEntries.value
    );
    const sumOfAllEntriesEnabled = useHeatmapChartStore(
        (state) => state.sumOfAllEntries.enabled
    );
    const sumOfAllEntriesColor = useHeatmapChartStore(
        (state) => state.sumOfAllEntries.color
    );

    const averageOfAllEntriesValue = useHeatmapChartStore(
        (state) => state.averageOfAllEntries.value
    );
    const averageOfAllEntriesEnabled = useHeatmapChartStore(
        (state) => state.averageOfAllEntries.enabled
    );
    const averageOfAllEntriesColor = useHeatmapChartStore(
        (state) => state.averageOfAllEntries.color
    );

    const numberOfEntriesValue = useHeatmapChartStore(
        (state) => state.numberOfEntries.value
    );
    const numberOfEntriesEnabled = useHeatmapChartStore(
        (state) => state.numberOfEntries.enabled
    );
    const numberOfEntriesColor = useHeatmapChartStore(
        (state) => state.numberOfEntries.color
    );

    const buttonHoverEnabled = useHeatmapChartStore(
        (state) => state.buttonHoverEnabled
    );
    const defaultBoxColor = useHeatmapChartStore(
        (state) => state.defaultBoxColor
    );
    const accent = useHeatmapChartStore((state) => state.accent);

    const { mutate: updateChart } = useUpdateHeatmap({
        onSuccess: () => {
            setIsLoading(false);
            toast({
                title: "Chart updated successfully",
                description: "Your changes have been saved",
            });
        },
        onError: () => {
            setIsLoading(false);
            toast({
                title: "Error updating chart",
                description: "Please try again",
                variant: "destructive",
            });
        },
    });

    const handleUpdate = () => {
        setIsLoading(true);
        toast({
            title: "Saving chart...",
            description: "Please wait while we update your chart",
        });

        updateChart({
            param: { id: chartId },
            json: {
                heatmap: {
                    dateField,
                    valueField,
                    backgroundColor,
                    textColor,
                    tooltipEnabled,
                    labelEnabled,
                    borderEnabled,
                    legendEnabled,
                    metric,
                    streak: {
                        value: streakValue,
                        enabled: streakEnabled,
                        color: streakColor,
                        daysToInclude: daysToIncludeInStreak,
                    },
                    longestStreak: {
                        value: longestStreakValue,
                        enabled: longestStreakEnabled,
                        color: longestStreakColor,
                    },
                    sumOfAllEntries: {
                        value: sumOfAllEntriesValue,
                        enabled: sumOfAllEntriesEnabled,
                        color: sumOfAllEntriesColor,
                    },
                    averageOfAllEntries: {
                        value: averageOfAllEntriesValue,
                        enabled: averageOfAllEntriesEnabled,
                        color: averageOfAllEntriesColor,
                    },
                    numberOfEntries: {
                        value: numberOfEntriesValue,
                        enabled: numberOfEntriesEnabled,
                        color: numberOfEntriesColor,
                    },
                    buttonHoverEnabled,
                    defaultBoxColor,
                    accent,
                },
            },
        });
    };

    const copyShareUrl = () => {
        const shareUrl = `${window.location.origin}/heatmap/${chartId}/view`;
        navigator.clipboard.writeText(shareUrl);
        toast({
            title: "Share URL copied",
            description:
                "The chart share URL has been copied to your clipboard",
        });
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                handleUpdate();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="mx-auto max-w-6xl space-y-6 p-6">
            <HeatmapHeader
                onSave={handleUpdate}
                onShare={copyShareUrl}
                isLoading={isLoading}
            />

            <QuickStatsCards />

            <Card>
                <CardContent className="p-6">
                    <Tabs defaultValue="basics" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="basics" className="gap-2">
                                Basics
                            </TabsTrigger>
                            <TabsTrigger value="metrics" className="gap-2">
                                Metrics
                            </TabsTrigger>
                            <TabsTrigger value="appearance" className="gap-2">
                                Appearance
                            </TabsTrigger>
                            <TabsTrigger value="colors" className="gap-2">
                                Colors
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="basics" className="space-y-6 pt-6">
                            <BasicsTab />
                        </TabsContent>

                        <TabsContent value="metrics" className="space-y-6 pt-6">
                            <MetricsTab />
                        </TabsContent>

                        <TabsContent
                            value="appearance"
                            className="space-y-6 pt-6"
                        >
                            <AppearanceTab />
                        </TabsContent>

                        <TabsContent value="colors" className="space-y-6 pt-6">
                            <ColorsTab />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <SaveReminder onSave={handleUpdate} isLoading={isLoading} />
        </div>
    );
};
