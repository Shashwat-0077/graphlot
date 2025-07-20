import { BarChart3, Settings, Palette, Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useHeatmapChartStore } from "@/modules/Heatmap/store";

export function QuickStatsCards() {
    const metric = useHeatmapChartStore((state) => state.metric);
    const streakValue = useHeatmapChartStore((state) => state.streak.value);

    // Calculate enabled metrics count
    const streakEnabled = useHeatmapChartStore((state) => state.streak.enabled);
    const longestStreakEnabled = useHeatmapChartStore(
        (state) => state.longestStreak.enabled
    );
    const sumOfAllEntriesEnabled = useHeatmapChartStore(
        (state) => state.sumOfAllEntries.enabled
    );
    const averageOfAllEntriesEnabled = useHeatmapChartStore(
        (state) => state.averageOfAllEntries.enabled
    );
    const numberOfEntriesEnabled = useHeatmapChartStore(
        (state) => state.numberOfEntries.enabled
    );

    const enabledMetricsCount = [
        streakEnabled,
        longestStreakEnabled,
        sumOfAllEntriesEnabled,
        averageOfAllEntriesEnabled,
        numberOfEntriesEnabled,
    ].filter(Boolean).length;

    // Calculate enabled features count
    const tooltipEnabled = useHeatmapChartStore(
        (state) => state.tooltipEnabled
    );
    const labelEnabled = useHeatmapChartStore((state) => state.labelEnabled);
    const borderEnabled = useHeatmapChartStore((state) => state.borderEnabled);
    const legendEnabled = useHeatmapChartStore((state) => state.legendEnabled);
    const buttonHoverEnabled = useHeatmapChartStore(
        (state) => state.buttonHoverEnabled
    );

    const enabledFeaturesCount = [
        tooltipEnabled,
        labelEnabled,
        borderEnabled,
        legendEnabled,
        buttonHoverEnabled,
    ].filter(Boolean).length;

    return (
        <div className="grid gap-4 md:grid-cols-4">
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium">
                                Active Metrics
                            </p>
                            <p className="text-2xl font-bold">
                                {enabledMetricsCount}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium">
                                Features Enabled
                            </p>
                            <p className="text-2xl font-bold">
                                {enabledFeaturesCount}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Metric Name</p>
                            <p className="truncate text-sm font-semibold">
                                {metric || "Not set"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium">
                                Current Streak
                            </p>
                            <p className="text-2xl font-bold">
                                {streakValue || 0}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
