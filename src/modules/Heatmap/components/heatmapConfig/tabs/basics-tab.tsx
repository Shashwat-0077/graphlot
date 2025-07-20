"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useHeatmapChartStore } from "@/modules/Heatmap/store";

export function BasicsTab() {
    const metric = useHeatmapChartStore((state) => state.metric);
    const setMetric = useHeatmapChartStore((state) => state.setMetric);
    const dateField = useHeatmapChartStore((state) => state.dateField);
    const setDateField = useHeatmapChartStore((state) => state.setDateField);
    const valueField = useHeatmapChartStore((state) => state.valueField);
    const setValueField = useHeatmapChartStore((state) => state.setValueField);

    const legendEnabled = useHeatmapChartStore((state) => state.legendEnabled);
    const toggleLegend = useHeatmapChartStore((state) => state.toggleLegend);
    const tooltipEnabled = useHeatmapChartStore(
        (state) => state.tooltipEnabled
    );
    const toggleTooltip = useHeatmapChartStore((state) => state.toggleTooltip);
    const borderEnabled = useHeatmapChartStore((state) => state.borderEnabled);
    const toggleBorder = useHeatmapChartStore((state) => state.toggleBorder);

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="metric-name">Metric Name</Label>
                    <Input
                        id="metric-name"
                        value={metric}
                        onChange={(e) => setMetric(e.target.value)}
                        placeholder="Enter your metric (e.g., Commits, Workouts)"
                    />
                    <p className="text-xs text-muted-foreground">
                        This will be displayed as the main label for your
                        heatmap
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="date-field">Date Field</Label>
                    <Input
                        id="date-field"
                        value={dateField}
                        onChange={(e) => setDateField(e.target.value)}
                        placeholder="date"
                    />
                    <p className="text-xs text-muted-foreground">
                        The field name containing date values in your data
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="value-field">Value Field</Label>
                    <Input
                        id="value-field"
                        value={valueField}
                        onChange={(e) => setValueField(e.target.value)}
                        placeholder="value"
                    />
                    <p className="text-xs text-muted-foreground">
                        The field name containing numeric values in your data
                    </p>
                </div>
            </div>

            <Card className="h-fit">
                <CardHeader>
                    <CardTitle className="text-base">Quick Settings</CardTitle>
                    <CardDescription>Toggle common features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Legend</Label>
                            <p className="text-xs text-muted-foreground">
                                Show color legend
                            </p>
                        </div>
                        <Checkbox
                            checked={legendEnabled}
                            onCheckedChange={toggleLegend}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Tooltips</Label>
                            <p className="text-xs text-muted-foreground">
                                Show hover tooltips
                            </p>
                        </div>
                        <Checkbox
                            checked={tooltipEnabled}
                            onCheckedChange={toggleTooltip}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Cell Borders</Label>
                            <p className="text-xs text-muted-foreground">
                                Show cell borders
                            </p>
                        </div>
                        <Checkbox
                            checked={borderEnabled}
                            onCheckedChange={toggleBorder}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
