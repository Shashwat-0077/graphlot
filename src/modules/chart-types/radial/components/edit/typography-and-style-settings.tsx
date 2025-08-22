"use client";

import type React from "react";
import { Donut, Square, Type } from "lucide-react";

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
    FontStyleType,
    FontType,
    MAX_TEXT_SIZE,
    MIN_TEXT_SIZE,
} from "@/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRadialChartStore } from "@/modules/chart-types/radial/store";
import { cn } from "@/utils";

/* -------------------- Typography -------------------- */
function LabelEnabled() {
    const labelEnabled = useRadialChartStore((s) => s.labelEnabled);
    const setTypography = useRadialChartStore((s) => s.setTypography);
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
    const label = useRadialChartStore((s) => s.label);
    const labelEnabled = useRadialChartStore((s) => s.labelEnabled);
    const setTypography = useRadialChartStore((s) => s.setTypography);
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
    const labelAnchor = useRadialChartStore((s) => s.labelAnchor);
    const labelEnabled = useRadialChartStore((s) => s.labelEnabled);
    const setTypography = useRadialChartStore((s) => s.setTypography);
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
    const labelFontFamily = useRadialChartStore((s) => s.labelFontFamily);
    const labelEnabled = useRadialChartStore((s) => s.labelEnabled);
    const setTypography = useRadialChartStore((s) => s.setTypography);
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
    const labelFontStyle = useRadialChartStore((s) => s.labelFontStyle);
    const labelEnabled = useRadialChartStore((s) => s.labelEnabled);
    const setTypography = useRadialChartStore((s) => s.setTypography);
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
    const labelSize = useRadialChartStore((s) => s.labelSize);
    const labelEnabled = useRadialChartStore((s) => s.labelEnabled);
    const setTypography = useRadialChartStore((s) => s.setTypography);
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
    const legendEnabled = useRadialChartStore((s) => s.legendEnabled);
    const setTypography = useRadialChartStore((s) => s.setTypography);
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

/* -------------------- Radial Settings -------------------- */
function GapSetting() {
    const gap = useRadialChartStore((s) => s.gap);
    const setRadialConfig = useRadialChartStore((s) => s.setRadialConfig);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-sm font-medium">
                    Gap
                </Label>
                <span className="text-muted-foreground text-xs">{gap}</span>
            </div>
            <Slider
                value={[gap]}
                min={0}
                max={20}
                step={1}
                onValueChange={(values) => setRadialConfig("gap", values[0])}
                className="w-full"
            />
        </div>
    );
}

function BorderRadius() {
    const borderRadius = useRadialChartStore((s) => s.borderRadius);
    const setRadialConfig = useRadialChartStore((s) => s.setRadialConfig);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-sm font-medium">
                    Border Radius
                </Label>
                <span className="text-muted-foreground text-xs">
                    {borderRadius}
                </span>
            </div>
            <Slider
                value={[borderRadius]}
                min={0}
                max={30}
                step={1}
                onValueChange={(values) =>
                    setRadialConfig("borderRadius", values[0])
                }
                className="w-full"
            />
        </div>
    );
}

function RadiusRange() {
    const innerRadius = useRadialChartStore((s) => s.innerRadius);
    const outerRadius = useRadialChartStore((s) => s.outerRadius);
    const setRadialConfig = useRadialChartStore((s) => s.setRadialConfig);

    return (
        <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-medium">
                Radius Range
            </Label>

            <DualRangeSlider
                value={[innerRadius, outerRadius]}
                min={0}
                max={250}
                step={1}
                onValueChange={(values) => {
                    setRadialConfig("innerRadius", values[0]);
                    setRadialConfig("outerRadius", values[1]);
                }}
                className="w-full"
            />
            <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>Inner: {innerRadius}</span>
                <span>Outer: {outerRadius}</span>
            </div>
        </div>
    );
}

function AngleRange() {
    const startAngle = useRadialChartStore((s) => s.startAngle);
    const endAngle = useRadialChartStore((s) => s.endAngle);
    const setRadialConfig = useRadialChartStore((s) => s.setRadialConfig);

    return (
        <div className="space-y-2 pb-4">
            <Label className="text-muted-foreground text-sm font-medium">
                Angle Range
            </Label>

            <DualRangeSlider
                value={[startAngle, endAngle]}
                min={0}
                max={360}
                step={1}
                onValueChange={(values) => {
                    setRadialConfig("startAngle", values[0]);
                    setRadialConfig("endAngle", values[1]);
                }}
                className="w-full"
            />
            <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>Start: {startAngle}°</span>
                <span>End: {endAngle}°</span>
            </div>
        </div>
    );
}

function TrackEnabled() {
    const trackEnabled = useRadialChartStore((s) => s.trackEnabled);
    const setRadialConfig = useRadialChartStore((s) => s.setRadialConfig);

    return (
        <div className="bg-muted/5 flex items-center justify-between rounded-md p-2">
            <div className="flex items-center gap-2">
                <Square className="text-muted-foreground h-3.5 w-3.5" />
                <Label className="text-xs">Track</Label>
            </div>
            <Checkbox
                checked={trackEnabled}
                onCheckedChange={() => {
                    setRadialConfig("trackEnabled", !trackEnabled);
                }}
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

            {/* Radial Settings */}
            <Card className="bg-card border shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <Donut className="h-4 w-4" />
                        Radial Chart Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Radial Styling */}
                    <Label className="text-sm font-medium">
                        Chart Dimensions
                    </Label>

                    <GapSetting />
                    <BorderRadius />
                    <RadiusRange />
                    <AngleRange />
                    <TrackEnabled />
                </CardContent>
            </Card>
        </div>
    );
};
