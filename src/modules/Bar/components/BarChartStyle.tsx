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
    borderRadiusBetweenBars: boolean; // Optional for backward compatibility
    toggleBorderRadiusBetweenBars: () => void; // Optional for backward compatibility
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
    borderRadiusBetweenBars, // Optional for backward compatibility
    toggleBorderRadiusBetweenBars, // Optional for backward compatibility
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

                {/* Callout for Stacked Bars */}
                {stacked && (
                    <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-4 w-4 text-primary"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-2">
                                <p className="text-xs text-primary/80">
                                    <strong>Note:</strong> Bar gap settings have
                                    no effect when bars are stacked.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

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
                    <div className="grid grid-cols-3 text-xs text-muted-foreground">
                        <span>Thin</span>
                        <span className="text-center">{barWidth}px</span>
                        <span className="text-right">Thick</span>
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
                    <div className="grid grid-cols-3 text-xs text-muted-foreground">
                        <span>None</span>
                        <span className="text-center">{barGap}px</span>
                        <span className="text-right">Large</span>
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
                    <div className="grid grid-cols-3 text-xs text-muted-foreground">
                        <span>Square</span>
                        <span className="text-center">{barBorderRadius}px</span>
                        <span className="text-right">Rounded</span>
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
                    <div className="grid grid-cols-3 text-xs text-muted-foreground">
                        <span>Transparent</span>
                        <span className="text-center">
                            {Math.round(fillOpacity * 100)}%
                        </span>
                        <span className="text-right">Solid</span>
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
                    <div className="grid grid-cols-3 text-xs text-muted-foreground">
                        <span>None</span>
                        <span className="text-center">{strokeWidth}px</span>
                        <span className="text-right">Thick</span>
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

                <div className="flex w-full items-center justify-between rounded-md bg-muted/10 p-3">
                    <Label className="text-sm">
                        Border Radius Between Bars
                    </Label>
                    <ToggleSwitch
                        defaultChecked={borderRadiusBetweenBars}
                        toggleFunction={toggleBorderRadiusBetweenBars}
                    />
                </div>
            </div>
        </div>
    );
}
