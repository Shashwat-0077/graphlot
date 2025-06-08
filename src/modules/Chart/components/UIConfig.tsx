"use client";

import type React from "react";
import { Type } from "lucide-react";

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
import { MAX_TEXT_SIZE, MIN_TEXT_SIZE } from "@/constants";
import type { ChartTypographyStore } from "@/modules/Chart/store/state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const UIConfig = ({
    label,
    setLabel,
    labelAnchor,
    setLabelAnchor,
    labelEnabled,
    toggleLabel,
    labelFontFamily,
    setLabelFontFamily,
    labelFontStyle,
    setLabelFontStyle,
    labelSize,
    setLabelSize,
    legendEnabled,
    toggleLegend,
    children,
}: Partial<
    ChartTypographyStore & {
        children?: React.ReactNode;
    }
>) => {
    return (
        <div className="space-y-4">
            <Card className="border bg-card shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <Type className="h-4 w-4" />
                        Typography Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Label Enable/Disable */}
                    {labelEnabled !== undefined && toggleLabel && (
                        <div className="flex items-center justify-between rounded-md bg-muted/10 p-3">
                            <Label className="text-sm font-medium">
                                Enable Label
                            </Label>
                            <Checkbox
                                checked={labelEnabled}
                                onCheckedChange={toggleLabel}
                                className="h-4 w-4"
                            />
                        </div>
                    )}

                    {/* Label Text Input */}
                    {label !== undefined && setLabel && labelEnabled && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                                Label Text
                            </Label>
                            <Input
                                value={label}
                                onChange={(e) => {
                                    setLabel(e.target.value);
                                }}
                                placeholder="Enter label text"
                                disabled={!labelEnabled}
                                className="w-full"
                            />
                        </div>
                    )}

                    {/* Label Anchor */}
                    {labelAnchor && setLabelAnchor && labelEnabled && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                                Label Position
                            </Label>
                            <Select
                                value={labelAnchor}
                                onValueChange={setLabelAnchor}
                                disabled={!labelEnabled}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="start">Start</SelectItem>
                                    <SelectItem value="middle">
                                        Middle
                                    </SelectItem>
                                    <SelectItem value="end">End</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Label Font Family */}
                    {labelFontFamily && setLabelFontFamily && labelEnabled && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                                Font Family
                            </Label>
                            <Select
                                value={labelFontFamily}
                                onValueChange={setLabelFontFamily}
                                disabled={!labelEnabled}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select font" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Arial">Arial</SelectItem>
                                    <SelectItem value="Courier New">
                                        Courier New
                                    </SelectItem>
                                    <SelectItem value="Georgia">
                                        Georgia
                                    </SelectItem>
                                    <SelectItem value="Times New Roman">
                                        Times New Roman
                                    </SelectItem>
                                    <SelectItem value="Verdana">
                                        Verdana
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Label Font Style */}
                    {labelFontStyle && setLabelFontStyle && labelEnabled && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                                Font Style
                            </Label>
                            <Select
                                value={labelFontStyle}
                                onValueChange={setLabelFontStyle}
                                disabled={!labelEnabled}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">
                                        Normal
                                    </SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                    <SelectItem value="italic">
                                        Italic
                                    </SelectItem>
                                    <SelectItem value="underline">
                                        Underline
                                    </SelectItem>
                                    <SelectItem value="strikethrough">
                                        Strikethrough
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Label Size */}
                    {labelSize !== undefined &&
                        setLabelSize &&
                        labelEnabled && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Font Size
                                    </Label>
                                    <span className="text-xs text-muted-foreground">
                                        {labelSize}px
                                    </span>
                                </div>
                                <Slider
                                    min={MIN_TEXT_SIZE}
                                    max={MAX_TEXT_SIZE}
                                    step={1}
                                    value={[labelSize]}
                                    onValueChange={(value) =>
                                        setLabelSize(value[0])
                                    }
                                    className="w-full"
                                    disabled={!labelEnabled}
                                />
                            </div>
                        )}

                    {/* Legend Enable/Disable */}
                    {legendEnabled !== undefined && toggleLegend && (
                        <div className="flex items-center justify-between rounded-md bg-muted/10 p-3">
                            <Label className="text-sm font-medium">
                                Enable Legend
                            </Label>
                            <Checkbox
                                checked={legendEnabled}
                                onCheckedChange={toggleLegend}
                                className="h-4 w-4"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Render children (AreaChartStyleConfig) */}
            {children}
        </div>
    );
};
