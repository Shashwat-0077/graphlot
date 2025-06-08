"use client";
import { AreaChartIcon, Layers, LayoutGrid } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AREA_CHART_STYLE_OPTIONS,
    AreaChartStyle,
    MAX_OPACITY,
    MAX_STROKE_WIDTH,
    MIN_OPACITY,
    MIN_STROKE_WIDTH,
} from "@/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AreaChartStyleConfigProps {
    areaStyle?: string;
    setAreaStyle?: (value: AreaChartStyle) => void;
    strokeWidth?: number;
    setStrokeWidth?: (value: number) => void;
    fillOpacity?: number;
    setFillOpacity?: (value: number) => void;
    isAreaChart?: boolean;
    toggleIsAreaChart?: () => void;
    stackedEnabled?: boolean;
    toggleStacked?: () => void;
    xAxisEnabled?: boolean;
    yAxisEnabled?: boolean;
    toggleXAxis?: () => void;
    toggleYAxis?: () => void;
}

export const AreaChartStyleConfig = ({
    areaStyle,
    setAreaStyle,
    strokeWidth,
    setStrokeWidth,
    fillOpacity,
    setFillOpacity,
    isAreaChart,
    toggleIsAreaChart,
    stackedEnabled,
    toggleStacked,
    xAxisEnabled,
    yAxisEnabled,
    toggleXAxis,
    toggleYAxis,
}: AreaChartStyleConfigProps) => {
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
                {areaStyle && setAreaStyle && isAreaChart && (
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                            Area Style
                        </Label>
                        <Select
                            value={areaStyle}
                            onValueChange={setAreaStyle}
                            disabled={!isAreaChart}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                            <SelectContent>
                                {AREA_CHART_STYLE_OPTIONS.map((style) => (
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
                            step={0.05}
                            value={[fillOpacity]}
                            onValueChange={(value) => setFillOpacity(value[0])}
                            className="w-full"
                            disabled={!isAreaChart}
                        />
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
