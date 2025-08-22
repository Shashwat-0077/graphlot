"use client";

import type React from "react";
import { BarChartIcon, Axis3D, LayoutGrid, Type } from "lucide-react";

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
import { Slider } from "@/components/ui/slider";
import {
    AnchorType,
    FontStyleType,
    FontType,
    MAX_TEXT_SIZE,
    MIN_TEXT_SIZE,
} from "@/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBarChartStore } from "@/modules/chart-types/bar/store";
import { cn } from "@/utils";

/* -------------------- Typography -------------------- */
function LabelEnabled() {
    const labelEnabled = useBarChartStore((s) => s.labelEnabled);
    const setTypography = useBarChartStore((s) => s.setTypography);
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
    const label = useBarChartStore((s) => s.label);
    const labelEnabled = useBarChartStore((s) => s.labelEnabled);
    const setTypography = useBarChartStore((s) => s.setTypography);
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
    const labelAnchor = useBarChartStore((s) => s.labelAnchor);
    const labelEnabled = useBarChartStore((s) => s.labelEnabled);
    const setTypography = useBarChartStore((s) => s.setTypography);
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
    const labelFontFamily = useBarChartStore((s) => s.labelFontFamily);
    const labelEnabled = useBarChartStore((s) => s.labelEnabled);
    const setTypography = useBarChartStore((s) => s.setTypography);
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
    const labelFontStyle = useBarChartStore((s) => s.labelFontStyle);
    const labelEnabled = useBarChartStore((s) => s.labelEnabled);
    const setTypography = useBarChartStore((s) => s.setTypography);
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
    const labelSize = useBarChartStore((s) => s.labelSize);
    const labelEnabled = useBarChartStore((s) => s.labelEnabled);
    const setTypography = useBarChartStore((s) => s.setTypography);
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
    const legendEnabled = useBarChartStore((s) => s.legendEnabled);
    const setTypography = useBarChartStore((s) => s.setTypography);
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

/* -------------------- Bar Settings -------------------- */

/* -------------------- Axis -------------------- */
function XAxisEnabled() {
    const xAxisEnabled = useBarChartStore((s) => s.xAxisEnabled);
    const setBarConfig = useBarChartStore((s) => s.setBarConfig);
    return (
        <div className="bg-muted/5 flex h-15 items-center justify-between rounded-md p-2">
            <div className="flex items-center gap-2">
                <LayoutGrid className="text-muted-foreground h-3.5 w-3.5" />
                <Label className="text-sm">X Axis</Label>
            </div>
            <Checkbox
                checked={xAxisEnabled}
                onCheckedChange={() =>
                    setBarConfig("xAxisEnabled", !xAxisEnabled)
                }
            />
        </div>
    );
}

function YAxisEnabled() {
    const yAxisEnabled = useBarChartStore((s) => s.yAxisEnabled);
    const setBarConfig = useBarChartStore((s) => s.setBarConfig);
    return (
        <div className="bg-muted/5 flex h-15 items-center justify-between rounded-md p-2">
            <div className="flex items-center gap-2">
                <LayoutGrid className="text-muted-foreground h-3.5 w-3.5" />
                <Label className="text-sm">Y Axis</Label>
            </div>
            <Checkbox
                checked={yAxisEnabled}
                onCheckedChange={() =>
                    setBarConfig("yAxisEnabled", !yAxisEnabled)
                }
            />
        </div>
    );
}

function StackedNote() {
    const stacked = useBarChartStore((s) => s.stacked);

    return (
        stacked && (
            <div className="border-primary/20 bg-primary/5 rounded-md border p-3">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg
                            className="text-primary h-4 w-4"
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
                        <p className="text-primary/80 text-xs">
                            <strong>Note:</strong> Bar gap settings have no
                            effect when bars are stacked.
                        </p>
                    </div>
                </div>
            </div>
        )
    );
}

function BarWidthSettings() {
    const barWidth = useBarChartStore((s) => s.barWidth);
    const setBarConfig = useBarChartStore((s) => s.setBarConfig);

    return (
        <div className="space-y-2">
            <Label className="text-sm">Bar Width</Label>
            <div className="px-1">
                <Slider
                    value={[barWidth]}
                    max={100}
                    min={1}
                    step={1}
                    onValueChange={([value]) => setBarConfig("barWidth", value)}
                />
            </div>
            <div className="text-muted-foreground grid grid-cols-3 text-xs">
                <span>Thin</span>
                <span className="text-center">{barWidth}px</span>
                <span className="text-right">Thick</span>
            </div>
        </div>
    );
}

function BarGapSettings() {
    const barGap = useBarChartStore((s) => s.barGap);
    const setBarConfig = useBarChartStore((s) => s.setBarConfig);

    return (
        <div className="space-y-2">
            <Label className="text-sm">Bar Gap</Label>
            <div className="px-1">
                <Slider
                    value={[barGap]}
                    max={20}
                    min={0}
                    step={1}
                    onValueChange={([value]) => setBarConfig("barGap", value)}
                />
            </div>
            <div className="text-muted-foreground grid grid-cols-3 text-xs">
                <span>None</span>
                <span className="text-center">{barGap}px</span>
                <span className="text-right">Large</span>
            </div>
        </div>
    );
}

function BorderRadiusSettings() {
    const barBorderRadius = useBarChartStore((s) => s.barBorderRadius);
    const setBarConfig = useBarChartStore((s) => s.setBarConfig);

    return (
        <div className="space-y-2">
            <Label className="text-sm">Border Radius</Label>
            <div className="px-1">
                <Slider
                    value={[barBorderRadius]}
                    max={20}
                    min={0}
                    step={1}
                    onValueChange={([value]) =>
                        setBarConfig("barBorderRadius", value)
                    }
                />
            </div>
            <div className="text-muted-foreground grid grid-cols-3 text-xs">
                <span>Square</span>
                <span className="text-center">{barBorderRadius}px</span>
                <span className="text-right">Rounded</span>
            </div>
        </div>
    );
}

function FillOpacitySettings() {
    const fillOpacity = useBarChartStore((s) => s.fillOpacity);
    const setBarConfig = useBarChartStore((s) => s.setBarConfig);

    return (
        <div className="space-y-2">
            <Label className="text-sm">Fill Opacity</Label>
            <div className="px-1">
                <Slider
                    value={[fillOpacity * 100]}
                    max={100}
                    min={0}
                    step={5}
                    onValueChange={([value]) =>
                        setBarConfig("fillOpacity", value / 100)
                    }
                />
            </div>
            <div className="text-muted-foreground grid grid-cols-3 text-xs">
                <span>Transparent</span>
                <span className="text-center">
                    {Math.round(fillOpacity * 100)}%
                </span>
                <span className="text-right">Solid</span>
            </div>
        </div>
    );
}

function StrokeWidthSettings() {
    const strokeWidth = useBarChartStore((s) => s.strokeWidth);
    const setBarConfig = useBarChartStore((s) => s.setBarConfig);

    return (
        <div className="space-y-2">
            <Label className="text-sm">Stroke Width</Label>
            <div className="px-1">
                <Slider
                    value={[strokeWidth]}
                    max={10}
                    min={0}
                    step={1}
                    onValueChange={([value]) =>
                        setBarConfig("strokeWidth", value)
                    }
                />
            </div>
            <div className="text-muted-foreground grid grid-cols-3 text-xs">
                <span>None</span>
                <span className="text-center">{strokeWidth}px</span>
                <span className="text-right">Thick</span>
            </div>
        </div>
    );
}

function StackedSettings() {
    const stacked = useBarChartStore((s) => s.stacked);
    const setBarConfig = useBarChartStore((s) => s.setBarConfig);

    return (
        <div className="bg-muted/10 flex w-full items-center justify-between rounded-md p-3">
            <Label className="text-sm">Stacked Bars</Label>
            <Checkbox
                checked={stacked}
                onCheckedChange={() => setBarConfig("stacked", !stacked)}
            />
        </div>
    );
}

function BorderRadiusBetweenBars() {
    const borderRadiusBetweenBars = useBarChartStore(
        (s) => s.borderRadiusBetweenBars
    );
    const setBarConfig = useBarChartStore((s) => s.setBarConfig);

    return (
        <div className="bg-muted/10 flex w-full items-center justify-between rounded-md p-3">
            <Label className="text-sm">Border Radius Between Bars</Label>
            <Checkbox
                checked={borderRadiusBetweenBars}
                onCheckedChange={() =>
                    setBarConfig(
                        "borderRadiusBetweenBars",
                        !borderRadiusBetweenBars
                    )
                }
            />
        </div>
    );
}

/* -------------------- Main Wrapper -------------------- */
export const TypographyAndStyleSettings = () => {
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

            {/* Bar Settings */}
            <Card className="bg-card border shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <BarChartIcon className="h-4 w-4" />
                        Bar Chart Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Bar Styling */}
                    <div className="space-y-4">
                        <StackedNote />
                        <BarWidthSettings />
                        <BarGapSettings />
                        <BorderRadiusSettings />
                        <FillOpacitySettings />
                        <StrokeWidthSettings />
                    </div>

                    {/* Layout Options */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium">Layout Options</h4>
                        <StackedSettings />
                        <BorderRadiusBetweenBars />
                    </div>
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
