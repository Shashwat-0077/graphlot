"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

interface RadarChartStyleConfigProps {
    strokeWidth: number;
    setStrokeWidth: (width: number) => void;
    xAxisEnabled: boolean;
    yAxisEnabled: boolean;
    toggleXAxis: () => void;
    toggleYAxis: () => void;
}

export function RadarChartStyleConfig({
    strokeWidth,
    setStrokeWidth,
    xAxisEnabled,
    yAxisEnabled,
    toggleXAxis,
    toggleYAxis,
}: RadarChartStyleConfigProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <Label className="text-sm font-medium">Radar Chart Style</Label>

                {/* Stroke Width */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">
                            Stroke Width
                        </Label>
                        <span className="text-xs text-muted-foreground">
                            {strokeWidth}px
                        </span>
                    </div>
                    <Slider
                        value={[strokeWidth]}
                        onValueChange={(value) => setStrokeWidth(value[0])}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                    />
                </div>

                {/* Axis Controls */}
                <div className="space-y-3">
                    <div className="flex w-full items-center justify-between rounded-md bg-muted/10 p-3 transition-colors hover:bg-muted/20">
                        <Label className="text-sm font-medium">X Axis</Label>
                        <ToggleSwitch
                            defaultChecked={xAxisEnabled}
                            toggleFunction={toggleXAxis}
                        />
                    </div>

                    <div className="flex w-full items-center justify-between rounded-md bg-muted/10 p-3 transition-colors hover:bg-muted/20">
                        <Label className="text-sm font-medium">Y Axis</Label>
                        <ToggleSwitch
                            defaultChecked={yAxisEnabled}
                            toggleFunction={toggleYAxis}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
