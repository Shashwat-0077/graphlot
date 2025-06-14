"use client";

import { PieChart, Square } from "lucide-react";

import { Slider, DualRangeSlider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRadialChartStore } from "@/modules/Radial/store";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { NumberInput } from "@/components/ui/number-input";

export function RadialChartStyleConfig() {
    // Radial chart selectors
    const innerRadius = useRadialChartStore((state) => state.innerRadius);
    const setInnerRadius = useRadialChartStore((state) => state.setInnerRadius);
    const outerRadius = useRadialChartStore((state) => state.outerRadius);
    const setOuterRadius = useRadialChartStore((state) => state.setOuterRadius);
    const startAngle = useRadialChartStore((state) => state.startAngle);
    const setStartAngle = useRadialChartStore((state) => state.setStartAngle);
    const endAngle = useRadialChartStore((state) => state.endAngle);
    const setEndAngle = useRadialChartStore((state) => state.setEndAngle);
    const gap = useRadialChartStore((state) => state.gap);
    const setGap = useRadialChartStore((state) => state.setGap);
    const trackEnabled = useRadialChartStore((state) => state.trackEnabled);
    const toggleTrack = useRadialChartStore((state) => state.toggleTrack);
    const borderRadius = useRadialChartStore((state) => state.borderRadius);
    const setBorderRadius = useRadialChartStore(
        (state) => state.setBorderRadius
    );
    const offsetX = useRadialChartStore((state) => state.offset.x);
    const offsetY = useRadialChartStore((state) => state.offset.y);
    const setOffsetX = useRadialChartStore((state) => state.setOffsetX);
    const setOffsetY = useRadialChartStore((state) => state.setOffsetY);

    return (
        <Card className="border bg-card shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <PieChart className="h-4 w-4" />
                    Radial Chart Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Radial Chart Settings */}
                <Label className="text-sm font-medium">Chart Dimensions</Label>

                {/* Gap */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-muted-foreground">
                            Gap
                        </Label>
                        <span className="text-xs text-muted-foreground">
                            {gap}
                        </span>
                    </div>
                    <Slider
                        value={[gap]}
                        min={0}
                        max={20}
                        step={1}
                        onValueChange={(values) => setGap(values[0])}
                        className="w-full"
                    />
                </div>

                {/* Border Radius */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-muted-foreground">
                            Border Radius
                        </Label>
                        <span className="text-xs text-muted-foreground">
                            {borderRadius}
                        </span>
                    </div>
                    <Slider
                        value={[borderRadius]}
                        min={0}
                        max={30}
                        step={1}
                        onValueChange={(values) => setBorderRadius(values[0])}
                        className="w-full"
                    />
                </div>

                {/* Radius Range */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                        Radius Range
                    </Label>

                    <DualRangeSlider
                        value={[innerRadius, outerRadius]}
                        min={0}
                        max={250}
                        step={1}
                        onValueChange={(values) => {
                            setInnerRadius(values[0]);
                            setOuterRadius(values[1]);
                        }}
                        className="w-full"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Inner: {innerRadius}</span>
                        <span>Outer: {outerRadius}</span>
                    </div>
                </div>

                {/* Angle Range */}
                <div className="space-y-2 pb-4">
                    <Label className="text-sm font-medium text-muted-foreground">
                        Angle Range
                    </Label>

                    <DualRangeSlider
                        value={[startAngle, endAngle]}
                        min={0}
                        max={360}
                        step={1}
                        onValueChange={(values) => {
                            setStartAngle(values[0]);
                            setEndAngle(values[1]);
                        }}
                        className="w-full"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Start: {startAngle}°</span>
                        <span>End: {endAngle}°</span>
                    </div>
                </div>

                {/* Chart Options */}
                <div className="space-y-3 rounded-md border p-3">
                    <Label className="text-sm font-medium">Chart Options</Label>

                    {/* Track Enabled */}
                    {trackEnabled !== undefined && toggleTrack && (
                        <div className="flex items-center justify-between rounded-md bg-muted/5 p-2">
                            <div className="flex items-center gap-2">
                                <Square className="h-3.5 w-3.5 text-muted-foreground" />
                                <Label className="text-xs">Track</Label>
                            </div>
                            <ToggleSwitch
                                defaultChecked={trackEnabled}
                                toggleFunction={toggleTrack}
                            />
                        </div>
                    )}
                </div>
                <div className="space-y-3 rounded-md border p-3">
                    <Label className="text-sm font-medium text-muted-foreground">
                        Offset (px)
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                                X Offset
                            </Label>
                            <NumberInput
                                min={-250}
                                max={250}
                                step={1}
                                value={offsetX}
                                onValueChange={(value) =>
                                    setOffsetX(value || 0)
                                }
                                className="w-full"
                                suffix="px"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                                Y offset
                            </Label>
                            <NumberInput
                                min={-250}
                                max={250}
                                step={1}
                                value={offsetY}
                                onValueChange={(value) =>
                                    setOffsetY(value || 0)
                                }
                                className="w-full"
                                suffix="px"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
