"use client";

import type React from "react";
import { AreaChartIcon, Axis3D, Layers, LayoutGrid, Type } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DualRangeSlider, Slider } from "@/components/ui/slider";
import {
    AnchorType,
    AREA_CHART_LINE_STYLE_OPTIONS,
    AreaChartLineStyle,
    FontStyleType,
    FontType,
    MAX_OPACITY,
    MAX_STROKE_WIDTH,
    MAX_TEXT_SIZE,
    MIN_OPACITY,
    MIN_STROKE_WIDTH,
    MIN_TEXT_SIZE,
} from "@/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAreaChartStore } from "@/modules/chart-types/area/store";
import { cn } from "@/utils";

/* -------------------- Typography -------------------- */
function LabelEnabled() {
    const labelEnabled = useAreaChartStore((s) => s.labelEnabled);
    const setTypography = useAreaChartStore((s) => s.setTypography);
    return (
        <div className="bg-muted/10 flex items-center justify-between rounded-md p-3">
            <Label className="text-sm font-medium">Enable Label</Label>
            <Checkbox
                checked={labelEnabled}
                onCheckedChange={() =>
                    setTypography("labelEnabled", !labelEnabled)
                }
                className="h-4 w-4"
            />
        </div>
    );
}

function LabelText() {
    const label = useAreaChartStore((s) => s.label);
    const labelEnabled = useAreaChartStore((s) => s.labelEnabled);
    const setTypography = useAreaChartStore((s) => s.setTypography);
    return (
        <div
            className={cn(
                "space-y-2",
                labelEnabled ? "" : "cursor-not-allowed opacity-50"
            )}
        >
            <Label className="text-muted-foreground text-sm font-medium">
                Label Text
            </Label>
            <Input
                value={label}
                onChange={(e) => setTypography("label", e.target.value)}
                placeholder="Enter label text"
                disabled={!labelEnabled}
                className="w-full"
            />
        </div>
    );
}

function LabelAnchor() {
    const labelAnchor = useAreaChartStore((s) => s.labelAnchor);
    const labelEnabled = useAreaChartStore((s) => s.labelEnabled);
    const setTypography = useAreaChartStore((s) => s.setTypography);
    return (
        <div
            className={cn(
                "space-y-2",
                labelEnabled ? "" : "cursor-not-allowed opacity-50"
            )}
        >
            <Label className="text-muted-foreground text-sm font-medium">
                Label Position
            </Label>
            <Select
                value={labelAnchor}
                onValueChange={(v: AnchorType) =>
                    setTypography("labelAnchor", v)
                }
                disabled={!labelEnabled}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="start">Start</SelectItem>
                    <SelectItem value="middle">Middle</SelectItem>
                    <SelectItem value="end">End</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

function LabelFontFamily() {
    const labelFontFamily = useAreaChartStore((s) => s.labelFontFamily);
    const labelEnabled = useAreaChartStore((s) => s.labelEnabled);
    const setTypography = useAreaChartStore((s) => s.setTypography);
    return (
        <div
            className={cn(
                "space-y-2",
                labelEnabled ? "" : "cursor-not-allowed opacity-50"
            )}
        >
            <Label className="text-muted-foreground text-sm font-medium">
                Font Family
            </Label>
            <Select
                value={labelFontFamily}
                onValueChange={(v: FontType) =>
                    setTypography("labelFontFamily", v)
                }
                disabled={!labelEnabled}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Courier New">Courier New</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Times New Roman">
                        Times New Roman
                    </SelectItem>
                    <SelectItem value="Verdana">Verdana</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

function LabelFontStyle() {
    const labelFontStyle = useAreaChartStore((s) => s.labelFontStyle);
    const labelEnabled = useAreaChartStore((s) => s.labelEnabled);
    const setTypography = useAreaChartStore((s) => s.setTypography);
    return (
        <div
            className={cn(
                "space-y-2",
                labelEnabled ? "" : "cursor-not-allowed opacity-50"
            )}
        >
            <Label className="text-muted-foreground text-sm font-medium">
                Font Style
            </Label>
            <Select
                value={labelFontStyle}
                onValueChange={(v: FontStyleType) =>
                    setTypography("labelFontStyle", v)
                }
                disabled={!labelEnabled}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="italic">Italic</SelectItem>
                    <SelectItem value="underline">Underline</SelectItem>
                    <SelectItem value="strikethrough">Strikethrough</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

function LabelSize() {
    const labelSize = useAreaChartStore((s) => s.labelSize);
    const labelEnabled = useAreaChartStore((s) => s.labelEnabled);
    const setTypography = useAreaChartStore((s) => s.setTypography);
    return (
        <div
            className={cn(
                "space-y-2",
                labelEnabled ? "" : "cursor-not-allowed opacity-50"
            )}
        >
            <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-sm font-medium">
                    Font Size
                </Label>
                <span className="text-muted-foreground text-xs">
                    {labelSize}px
                </span>
            </div>

            <Slider
                min={MIN_TEXT_SIZE}
                max={MAX_TEXT_SIZE}
                step={1}
                value={[labelSize]}
                onValueChange={(v) => setTypography("labelSize", v[0])}
                disabled={!labelEnabled}
            />
        </div>
    );
}

function LegendEnabled() {
    const legendEnabled = useAreaChartStore((s) => s.legendEnabled);
    const setTypography = useAreaChartStore((s) => s.setTypography);
    return (
        <div className="bg-muted/10 flex items-center justify-between rounded-md p-3">
            <Label className="text-sm font-medium">Enable Legend</Label>
            <Checkbox
                checked={legendEnabled}
                onCheckedChange={() =>
                    setTypography("legendEnabled", !legendEnabled)
                }
                className="h-4 w-4"
            />
        </div>
    );
}

/* -------------------- Area Settings -------------------- */
function IsAreaChart() {
    const isAreaChart = useAreaChartStore((s) => s.isAreaChart);
    const setAreaConfig = useAreaChartStore((s) => s.setAreaConfig);
    return (
        <div className="bg-muted/10 flex items-center justify-between rounded-md p-3">
            <div className="flex items-center gap-2">
                <AreaChartIcon className="text-muted-foreground h-4 w-4" />
                <Label className="text-sm">Area Chart</Label>
            </div>
            <Checkbox
                checked={isAreaChart}
                onCheckedChange={() =>
                    setAreaConfig("isAreaChart", !isAreaChart)
                }
            />
        </div>
    );
}

function StackedEnabled() {
    const stackedEnabled = useAreaChartStore((s) => s.stackedEnabled);
    const setAreaConfig = useAreaChartStore((s) => s.setAreaConfig);
    return (
        <div className="bg-muted/10 flex items-center justify-between rounded-md p-3">
            <div className="flex items-center gap-2">
                <Layers className="text-muted-foreground h-4 w-4" />
                <Label className="text-sm">Stacked</Label>
            </div>
            <Checkbox
                checked={stackedEnabled}
                onCheckedChange={() =>
                    setAreaConfig("stackedEnabled", !stackedEnabled)
                }
            />
        </div>
    );
}

function LineStyle() {
    const lineStyle = useAreaChartStore((s) => s.lineStyle);
    const setAreaConfig = useAreaChartStore((s) => s.setAreaConfig);
    return (
        <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-medium">
                Line Style
            </Label>
            <Select
                value={lineStyle}
                onValueChange={(v: AreaChartLineStyle) =>
                    setAreaConfig("lineStyle", v)
                }
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                    {AREA_CHART_LINE_STYLE_OPTIONS.map((style) => (
                        <SelectItem key={style} value={style}>
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function StrokeWidth() {
    const strokeWidth = useAreaChartStore((s) => s.strokeWidth);
    const isAreaChart = useAreaChartStore((s) => s.isAreaChart);
    const setAreaConfig = useAreaChartStore((s) => s.setAreaConfig);
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-sm font-medium">
                    Stroke Width
                </Label>
                <span className="text-muted-foreground text-xs">
                    {strokeWidth}px
                </span>
            </div>
            <Slider
                min={MIN_STROKE_WIDTH}
                max={MAX_STROKE_WIDTH}
                step={0.5}
                value={[strokeWidth]}
                onValueChange={(v) => setAreaConfig("strokeWidth", v[0])}
                className="w-full"
                disabled={!isAreaChart}
            />
        </div>
    );
}

function FillOpacity() {
    const fillOpacity = useAreaChartStore((s) => s.fill.opacity);
    const fillStart = useAreaChartStore((s) => s.fill.start);
    const fillEnd = useAreaChartStore((s) => s.fill.end);
    const isAreaChart = useAreaChartStore((s) => s.isAreaChart);
    const setAreaConfig = useAreaChartStore((s) => s.setAreaConfig);
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-sm font-medium">
                    Fill Opacity
                </Label>
                <span className="text-muted-foreground text-xs">
                    {fillOpacity.toFixed(2)}
                </span>
            </div>
            <Slider
                min={MIN_OPACITY}
                max={MAX_OPACITY}
                step={0.01}
                value={[fillOpacity]}
                onValueChange={(v) =>
                    setAreaConfig("fill", {
                        start: fillStart,
                        end: fillEnd,
                        opacity: v[0],
                    })
                }
                className="w-full"
                disabled={!isAreaChart}
            />
        </div>
    );
}

function FillRange() {
    const fillOpacity = useAreaChartStore((s) => s.fill.opacity);
    const fillStart = useAreaChartStore((s) => s.fill.start);
    const fillEnd = useAreaChartStore((s) => s.fill.end);
    const isAreaChart = useAreaChartStore((s) => s.isAreaChart);
    const setAreaConfig = useAreaChartStore((s) => s.setAreaConfig);
    return (
        <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-medium">
                Fill Range
            </Label>
            <DualRangeSlider
                min={0}
                max={1}
                step={0.01}
                value={[fillStart, fillEnd]}
                onValueChange={(v) =>
                    setAreaConfig("fill", {
                        start: v[0],
                        end: v[1],
                        opacity: fillOpacity,
                    })
                }
                className="w-full"
                disabled={!isAreaChart}
            />
            <div className="text-muted-foreground mt-4 flex items-center justify-between text-xs">
                <span>Start: {fillStart.toFixed(2)}</span>
                <span>End: {fillEnd.toFixed(2)}</span>
            </div>
        </div>
    );
}

/* -------------------- Axis -------------------- */
function XAxisEnabled() {
    const xAxisEnabled = useAreaChartStore((s) => s.xAxisEnabled);
    const setAreaConfig = useAreaChartStore((s) => s.setAreaConfig);
    return (
        <div className="bg-muted/5 flex h-15 items-center justify-between rounded-md p-2">
            <div className="flex items-center gap-2">
                <LayoutGrid className="text-muted-foreground h-3.5 w-3.5" />
                <Label className="text-sm">X Axis</Label>
            </div>
            <Checkbox
                checked={xAxisEnabled}
                onCheckedChange={() =>
                    setAreaConfig("xAxisEnabled", !xAxisEnabled)
                }
            />
        </div>
    );
}

function YAxisEnabled() {
    const yAxisEnabled = useAreaChartStore((s) => s.yAxisEnabled);
    const setAreaConfig = useAreaChartStore((s) => s.setAreaConfig);
    return (
        <div className="bg-muted/5 flex h-15 items-center justify-between rounded-md p-2">
            <div className="flex items-center gap-2">
                <LayoutGrid className="text-muted-foreground h-3.5 w-3.5" />
                <Label className="text-sm">Y Axis</Label>
            </div>
            <Checkbox
                checked={yAxisEnabled}
                onCheckedChange={() =>
                    setAreaConfig("yAxisEnabled", !yAxisEnabled)
                }
            />
        </div>
    );
}

/* -------------------- Main Wrapper -------------------- */
export const TypographyAndStyleConfig = () => {
    return (
        <div className="space-y-4">
            {/* Typography */}
            <Card className="bg-card border shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <Type className="h-4 w-4" />
                        Typography Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <LabelEnabled />
                    <LabelText />
                    <LabelAnchor />
                    <LabelFontFamily />
                    <LabelFontStyle />
                    <LabelSize />
                    <LegendEnabled />
                </CardContent>
            </Card>

            {/* Area Settings */}
            <Card className="bg-card border shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <AreaChartIcon className="h-4 w-4" />
                        Area Chart Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <IsAreaChart />
                    <StackedEnabled />
                    <LineStyle />
                    <StrokeWidth />
                    <FillOpacity />
                    <FillRange />
                </CardContent>
            </Card>

            {/* Axis Controls */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <Axis3D className="h-4 w-4" />
                        Axis Controls
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <XAxisEnabled />
                    <YAxisEnabled />
                </CardContent>
            </Card>
        </div>
    );
};
