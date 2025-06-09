"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

interface BarChartStyleConfigProps {
    yAxisEnabled: boolean;
    xAxisEnabled: boolean;
    toggleXAxis: () => void;
    toggleYAxis: () => void;
    barBorderRadius: number;
    setBarBorderRadius: (value: number) => void;
    barWidth: number;
    setBarWidth: (value: number) => void;
    barGap: number;
    setBarGap: (value: number) => void;
    fillOpacity: number;
    setFillOpacity: (value: number) => void;
    strokeWidth: number;
    setStrokeWidth: (value: number) => void;
    stacked: boolean;
    toggleStacked: () => void;
}

export function BarChartStyleConfig({
    yAxisEnabled,
    xAxisEnabled,
    toggleXAxis,
    toggleYAxis,
    barBorderRadius,
    setBarBorderRadius,
    barWidth,
    setBarWidth,
    barGap,
    setBarGap,
    fillOpacity,
    setFillOpacity,
    strokeWidth,
    setStrokeWidth,
    stacked,
    toggleStacked,
}: BarChartStyleConfigProps) {
    return (
        <div className="space-y-6">
            {/* Axis Controls */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium">Axis Configuration</h4>

                <div className="flex w-full items-center justify-between rounded-md bg-muted/10 p-3">
                    <Label className="text-sm">X Axis</Label>
                    <ToggleSwitch
                        defaultChecked={xAxisEnabled}
                        toggleFunction={toggleXAxis}
                    />
                </div>

                <div className="flex w-full items-center justify-between rounded-md bg-muted/10 p-3">
                    <Label className="text-sm">Y Axis</Label>
                    <ToggleSwitch
                        defaultChecked={yAxisEnabled}
                        toggleFunction={toggleYAxis}
                    />
                </div>
            </div>

            {/* Bar Styling */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium">Bar Styling</h4>

                {/* Bar Width */}
                <div className="space-y-2">
                    <Label className="text-sm">Bar Width</Label>
                    <div className="px-1">
                        <Slider
                            value={[barWidth]}
                            max={100}
                            min={1}
                            step={1}
                            onValueChange={([value]) => setBarWidth(value)}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Thin</span>
                        <span>{barWidth}px</span>
                        <span>Thick</span>
                    </div>
                </div>

                {/* Bar Gap */}
                <div className="space-y-2">
                    <Label className="text-sm">Bar Gap</Label>
                    <div className="px-1">
                        <Slider
                            value={[barGap]}
                            max={20}
                            min={0}
                            step={1}
                            onValueChange={([value]) => setBarGap(value)}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>None</span>
                        <span>{barGap}px</span>
                        <span>Large</span>
                    </div>
                </div>

                {/* Border Radius */}
                <div className="space-y-2">
                    <Label className="text-sm">Border Radius</Label>
                    <div className="px-1">
                        <Slider
                            value={[barBorderRadius]}
                            max={20}
                            min={0}
                            step={1}
                            onValueChange={([value]) =>
                                setBarBorderRadius(value)
                            }
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Square</span>
                        <span>{barBorderRadius}px</span>
                        <span>Rounded</span>
                    </div>
                </div>

                {/* Fill Opacity */}
                <div className="space-y-2">
                    <Label className="text-sm">Fill Opacity</Label>
                    <div className="px-1">
                        <Slider
                            value={[fillOpacity * 100]}
                            max={100}
                            min={0}
                            step={5}
                            onValueChange={([value]) =>
                                setFillOpacity(value / 100)
                            }
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Transparent</span>
                        <span>{Math.round(fillOpacity * 100)}%</span>
                        <span>Solid</span>
                    </div>
                </div>

                {/* Stroke Width */}
                <div className="space-y-2">
                    <Label className="text-sm">Stroke Width</Label>
                    <div className="px-1">
                        <Slider
                            value={[strokeWidth]}
                            max={10}
                            min={0}
                            step={1}
                            onValueChange={([value]) => setStrokeWidth(value)}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>None</span>
                        <span>{strokeWidth}px</span>
                        <span>Thick</span>
                    </div>
                </div>
            </div>

            {/* Layout Options */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium">Layout Options</h4>

                <div className="flex w-full items-center justify-between rounded-md bg-muted/10 p-3">
                    <Label className="text-sm">Stacked Bars</Label>
                    <ToggleSwitch
                        defaultChecked={stacked}
                        toggleFunction={toggleStacked}
                    />
                </div>
            </div>
        </div>
    );
}
