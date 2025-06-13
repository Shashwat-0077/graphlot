"use client";
import { AreaChartIcon, Layers, LayoutGrid } from "lucide-react";

import { Label } from "@/components/ui/label";
import { DualRangeSlider, Slider } from "@/components/ui/slider";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AREA_CHART_LINE_STYLE_OPTIONS,
    MAX_OPACITY,
    MAX_STROKE_WIDTH,
    MIN_OPACITY,
    MIN_STROKE_WIDTH,
} from "@/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAreaChartStore } from "@/modules/Area/store";

export const AreaChartStyleConfig = () => {
    // Area chart selectors
    const areaStyle = useAreaChartStore((state) => state.lineStyle);
    const setAreaStyle = useAreaChartStore((state) => state.setAreaStyle);
    const strokeWidth = useAreaChartStore((state) => state.strokeWidth);
    const setStrokeWidth = useAreaChartStore((state) => state.setStrokeWidth);
    const {
        opacity: fillOpacity,
        start: fillStart,
        end: fillEnd,
    } = useAreaChartStore((state) => state.fill);
    const setFillOpacity = useAreaChartStore((state) => state.setFillOpacity);
    const setFillRange = useAreaChartStore((state) => state.setFillRange);
    const isAreaChart = useAreaChartStore((state) => state.isAreaChart);
    const toggleIsAreaChart = useAreaChartStore(
        (state) => state.toggleIsAreaChart
    );
    const stackedEnabled = useAreaChartStore((state) => state.stackedEnabled);
    const toggleStacked = useAreaChartStore((state) => state.toggleStacked);
    const xAxisEnabled = useAreaChartStore((state) => state.xAxisEnabled);
    const yAxisEnabled = useAreaChartStore((state) => state.yAxisEnabled);
    const toggleXAxis = useAreaChartStore((state) => state.toggleXAxis);
    const toggleYAxis = useAreaChartStore((state) => state.toggleYAxis);

    return (
        <Card className="border bg-card shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <AreaChartIcon className="h-4 w-4" />
                    Area Chart Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Area Chart Type */}
                {isAreaChart !== undefined && toggleIsAreaChart && (
                    <div className="flex items-center justify-between rounded-md bg-muted/10 p-3">
                        <div className="flex items-center gap-2">
                            <AreaChartIcon className="h-4 w-4 text-muted-foreground" />
                            <Label className="text-sm">Area Chart</Label>
                        </div>
                        <ToggleSwitch
                            defaultChecked={isAreaChart}
                            toggleFunction={toggleIsAreaChart}
                        />
                    </div>
                )}

                {/* Area Style */}
                {areaStyle && setAreaStyle && (
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                            Line Style
                        </Label>
                        <Select value={areaStyle} onValueChange={setAreaStyle}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                            <SelectContent>
                                {AREA_CHART_LINE_STYLE_OPTIONS.map((style) => (
                                    <SelectItem key={style} value={style}>
                                        {style.charAt(0).toUpperCase() +
                                            style.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Stroke Width */}
                {strokeWidth !== undefined && setStrokeWidth && isAreaChart && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-muted-foreground">
                                Stroke Width
                            </Label>
                            <span className="text-xs text-muted-foreground">
                                {strokeWidth}px
                            </span>
                        </div>
                        <Slider
                            min={MIN_STROKE_WIDTH}
                            max={MAX_STROKE_WIDTH}
                            step={0.5}
                            value={[strokeWidth]}
                            onValueChange={(value) => setStrokeWidth(value[0])}
                            className="w-full"
                            disabled={!isAreaChart}
                        />
                    </div>
                )}

                {/* Fill Opacity */}
                {fillOpacity !== undefined && setFillOpacity && isAreaChart && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-muted-foreground">
                                Fill Opacity
                            </Label>
                            <span className="text-xs text-muted-foreground">
                                {fillOpacity.toFixed(2)}
                            </span>
                        </div>
                        <Slider
                            min={MIN_OPACITY}
                            max={MAX_OPACITY}
                            step={0.01}
                            value={[fillOpacity]}
                            onValueChange={(value) => setFillOpacity(value[0])}
                            className="w-full"
                            disabled={!isAreaChart}
                        />
                    </div>
                )}
                {/* Fill Range */}
                {fillEnd !== undefined &&
                    fillStart !== undefined &&
                    setFillRange &&
                    isAreaChart && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                                Fill Range
                            </Label>
                            <DualRangeSlider
                                min={0}
                                max={1}
                                step={0.01}
                                value={[fillStart, fillEnd]}
                                onValueChange={(value) =>
                                    setFillRange([value[0], value[1]])
                                }
                                className="w-full"
                                disabled={!isAreaChart}
                            />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Start: {fillStart.toFixed(2)}</span>
                                <span>End: {fillEnd.toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                {/* Stacked */}
                {stackedEnabled !== undefined && toggleStacked && (
                    <div className="flex items-center justify-between rounded-md bg-muted/10 p-3">
                        <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-muted-foreground" />
                            <Label className="text-sm">Stacked</Label>
                        </div>
                        <ToggleSwitch
                            defaultChecked={stackedEnabled}
                            toggleFunction={toggleStacked}
                        />
                    </div>
                )}

                {/* Axis Controls */}
                {(xAxisEnabled !== undefined || yAxisEnabled !== undefined) && (
                    <div className="space-y-3 rounded-md border p-3">
                        <Label className="text-sm font-medium">
                            Axis Controls
                        </Label>

                        {/* X Axis */}
                        {xAxisEnabled !== undefined && toggleXAxis && (
                            <div className="flex items-center justify-between rounded-md bg-muted/5 p-2">
                                <div className="flex items-center gap-2">
                                    <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                                    <Label className="text-xs">X Axis</Label>
                                </div>
                                <ToggleSwitch
                                    defaultChecked={xAxisEnabled}
                                    toggleFunction={toggleXAxis}
                                />
                            </div>
                        )}

                        {/* Y Axis */}
                        {yAxisEnabled !== undefined && toggleYAxis && (
                            <div className="flex items-center justify-between rounded-md bg-muted/5 p-2">
                                <div className="flex items-center gap-2">
                                    <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                                    <Label className="text-xs">Y Axis</Label>
                                </div>
                                <ToggleSwitch
                                    defaultChecked={yAxisEnabled}
                                    toggleFunction={toggleYAxis}
                                />
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
