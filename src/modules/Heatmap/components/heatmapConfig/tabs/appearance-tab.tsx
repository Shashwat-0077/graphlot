import { Badge } from "@/components/ui/badge";
import { useHeatmapChartStore } from "@/modules/Heatmap/store";

import { FeatureCard } from "../feature-card";

export function AppearanceTab() {
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
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Visual Features</h3>
                <Badge variant="secondary">
                    {enabledFeaturesCount} enabled
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <FeatureCard type="label" />
                <FeatureCard type="tooltip" />
                <FeatureCard type="border" />
                <FeatureCard type="legend" />
                <FeatureCard type="buttonHover" />
            </div>
        </div>
    );
}
