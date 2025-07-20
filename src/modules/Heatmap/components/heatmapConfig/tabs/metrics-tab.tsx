import { Badge } from "@/components/ui/badge";
import { useHeatmapChartStore } from "@/modules/Heatmap/store";

import { MetricCard } from "../metric-card";

export function MetricsTab() {
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

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Available Metrics</h3>
                <Badge variant="secondary">{enabledMetricsCount} enabled</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <MetricCard type="streak" />
                <MetricCard type="longestStreak" />
                <MetricCard type="sumOfAllEntries" />
                <MetricCard type="averageOfAllEntries" />
                <MetricCard type="numberOfEntries" />
            </div>
        </div>
    );
}
