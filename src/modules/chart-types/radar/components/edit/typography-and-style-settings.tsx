"use client";

import type React from "react";
import { Axis3D, LayoutGrid, Radar, Type } from "lucide-react";

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
import { useRadarChartStore } from "@/modules/chart-types/radar/store";
import { cn } from "@/utils";

/* -------------------- Typography -------------------- */
function LabelEnabled() {
    const labelEnabled = useRadarChartStore((s) => s.labelEnabled);
    const setTypography = useRadarChartStore((s) => s.setTypography);
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
    const label = useRadarChartStore((s) => s.label);
    const labelEnabled = useRadarChartStore((s) => s.labelEnabled);
    const setTypography = useRadarChartStore((s) => s.setTypography);
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
    const labelAnchor = useRadarChartStore((s) => s.labelAnchor);
    const labelEnabled = useRadarChartStore((s) => s.labelEnabled);
    const setTypography = useRadarChartStore((s) => s.setTypography);
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
    const labelFontFamily = useRadarChartStore((s) => s.labelFontFamily);
    const labelEnabled = useRadarChartStore((s) => s.labelEnabled);
    const setTypography = useRadarChartStore((s) => s.setTypography);
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
    const labelFontStyle = useRadarChartStore((s) => s.labelFontStyle);
    const labelEnabled = useRadarChartStore((s) => s.labelEnabled);
    const setTypography = useRadarChartStore((s) => s.setTypography);
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
    const labelSize = useRadarChartStore((s) => s.labelSize);
    const labelEnabled = useRadarChartStore((s) => s.labelEnabled);
    const setTypography = useRadarChartStore((s) => s.setTypography);
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
    const legendEnabled = useRadarChartStore((s) => s.legendEnabled);
    const setTypography = useRadarChartStore((s) => s.setTypography);
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

/* -------------------- Radar Settings -------------------- */

/* -------------------- Axis -------------------- */
function XAxisEnabled() {
    const xAxisEnabled = useRadarChartStore((s) => s.xAxisEnabled);
    const setRadarConfig = useRadarChartStore((s) => s.setRadarConfig);
    return (
        <div className="bg-muted/5 flex h-15 items-center justify-between rounded-md p-2">
            <div className="flex items-center gap-2">
                <LayoutGrid className="text-muted-foreground h-3.5 w-3.5" />
                <Label className="text-sm">X Axis</Label>
            </div>
            <Checkbox
                checked={xAxisEnabled}
                onCheckedChange={() =>
                    setRadarConfig("xAxisEnabled", !xAxisEnabled)
                }
            />
        </div>
    );
}

function StrokeWidth() {
    const strokeWidth = useRadarChartStore((s) => s.strokeWidth);
    const setRadarConfig = useRadarChartStore((s) => s.setRadarConfig);

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
                        setRadarConfig("strokeWidth", value)
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

            {/* Radar Settings */}
            <Card className="bg-card border shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <Radar className="h-4 w-4" />
                        Radar Chart Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Radar Styling */}
                    <div className="space-y-4">
                        {/* Stroke Width */}
                        <StrokeWidth />
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
                </CardContent>
            </Card>
        </div>
    );
};
