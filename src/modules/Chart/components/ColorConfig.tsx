"use client";

import { Palette, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ColorPickerPopover from "@/components/ui/ColorPickerPopover";
import { Label } from "@/components/ui/label";
import ClearAll from "@/modules/Chart/components/ClearAll";
import { getRGBAString, invertRGBA } from "@/utils/colors";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChartColorStore } from "@/modules/Chart/store";

interface ColorsConfigProps {
    showBackground?: boolean;
    showLegendText?: boolean;
    showGrid?: boolean;
    showBorder?: boolean;
    showLabel?: boolean;
    showTooltipBackground?: boolean;
    showTooltipBorder?: boolean;
    showTooltipSeparator?: boolean;
    showTooltipText?: boolean;
    showColorPalette?: boolean;
}

export function ColorsConfig({
    showBackground = true,
    showLegendText = true,
    showGrid = true,
    showBorder = true,
    showLabel = true,
    showTooltipBackground = true,
    showTooltipBorder = true,
    showTooltipSeparator = true,
    showTooltipText = true,
    showColorPalette = true,
}: ColorsConfigProps) {
    // Color selectors
    const backgroundColor = useChartColorStore(
        (state) => state.backgroundColor
    );
    const setBackgroundColor = useChartColorStore(
        (state) => state.setBackgroundColor
    );
    const borderColor = useChartColorStore((state) => state.borderColor);
    const setBorderColor = useChartColorStore((state) => state.setBorderColor);
    const gridColor = useChartColorStore((state) => state.gridColor);
    const setGridColor = useChartColorStore((state) => state.setGridColor);
    const labelColor = useChartColorStore((state) => state.labelColor);
    const setLabelColor = useChartColorStore((state) => state.setLabelColor);
    const legendTextColor = useChartColorStore(
        (state) => state.legendTextColor
    );
    const setLegendTextColor = useChartColorStore(
        (state) => state.setLegendTextColor
    );
    const colorPalette = useChartColorStore((state) => state.colorPalette);
    const addColorPalette = useChartColorStore(
        (state) => state.addColorPalette
    );
    const clearColorPalette = useChartColorStore(
        (state) => state.clearColorPalette
    );
    const removeColorPalette = useChartColorStore(
        (state) => state.removeColorPalette
    );
    const updateColorPalette = useChartColorStore(
        (state) => state.updateColorPalette
    );
    const tooltipBackgroundColor = useChartColorStore(
        (state) => state.tooltipBackgroundColor
    );
    const setTooltipBackgroundColor = useChartColorStore(
        (state) => state.setTooltipBackgroundColor
    );
    const tooltipTextColor = useChartColorStore(
        (state) => state.tooltipTextColor
    );
    const setTooltipTextColor = useChartColorStore(
        (state) => state.setTooltipTextColor
    );
    const tooltipSeparatorColor = useChartColorStore(
        (state) => state.tooltipSeparatorColor
    );
    const setTooltipSeparatorColor = useChartColorStore(
        (state) => state.setTooltipSeparatorColor
    );
    const tooltipBorderColor = useChartColorStore(
        (state) => state.tooltipBorderColor
    );
    const setTooltipBorderColor = useChartColorStore(
        (state) => state.setTooltipBorderColor
    );

    return (
        <Card className="border bg-card shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <Palette className="h-4 w-4" />
                    Color Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs defaultValue="base-colors" className="w-full">
                    <TabsList className="w-full rounded-none border-b">
                        <TabsTrigger value="base-colors" className="flex-1">
                            Base Colors
                        </TabsTrigger>
                        <TabsTrigger value="chart-colors" className="flex-1">
                            Chart Colors
                        </TabsTrigger>
                    </TabsList>

                    {/* Base Colors Tab */}
                    <TabsContent value="base-colors" className="p-4 pt-6">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Background Color */}
                            {showBackground && (
                                <ColorPickerPopover
                                    isSingleColor={true}
                                    color={backgroundColor}
                                    setColor={setBackgroundColor}
                                >
                                    <div className="group relative overflow-hidden rounded-md border shadow-sm transition-all hover:shadow">
                                        <div
                                            className="flex h-16 items-center justify-between p-3"
                                            style={{
                                                backgroundColor:
                                                    getRGBAString(
                                                        backgroundColor
                                                    ),
                                            }}
                                        >
                                            <div
                                                className="flex items-center gap-2"
                                                style={{
                                                    color: getRGBAString(
                                                        invertRGBA(
                                                            backgroundColor,
                                                            true
                                                        )
                                                    ),
                                                }}
                                            >
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                                                    <span className="text-xs">
                                                        Bg
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    Background
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </ColorPickerPopover>
                            )}

                            {/* Text Color */}
                            {showLegendText && (
                                <ColorPickerPopover
                                    isSingleColor={true}
                                    color={legendTextColor}
                                    setColor={setLegendTextColor}
                                >
                                    <div className="group relative overflow-hidden rounded-md border shadow-sm transition-all hover:shadow">
                                        <div
                                            className="flex h-16 items-center justify-between p-3"
                                            style={{
                                                backgroundColor:
                                                    getRGBAString(
                                                        legendTextColor
                                                    ),
                                            }}
                                        >
                                            <div
                                                className="flex items-center gap-2"
                                                style={{
                                                    color: getRGBAString(
                                                        invertRGBA(
                                                            legendTextColor,
                                                            true
                                                        )
                                                    ),
                                                }}
                                            >
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                                                    <span className="text-xs">
                                                        Tx
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    Legend Text
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </ColorPickerPopover>
                            )}

                            {/* Grid Color */}
                            {showGrid && (
                                <ColorPickerPopover
                                    isSingleColor={true}
                                    color={gridColor}
                                    setColor={setGridColor}
                                >
                                    <div className="group relative overflow-hidden rounded-md border shadow-sm transition-all hover:shadow">
                                        <div
                                            className="flex h-16 items-center justify-between p-3"
                                            style={{
                                                backgroundColor:
                                                    getRGBAString(gridColor),
                                            }}
                                        >
                                            <div
                                                className="flex items-center gap-2"
                                                style={{
                                                    color: getRGBAString(
                                                        invertRGBA(
                                                            gridColor,
                                                            true
                                                        )
                                                    ),
                                                }}
                                            >
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                                                    <span className="text-xs">
                                                        Gr
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    Grid
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </ColorPickerPopover>
                            )}

                            {/* Border Color */}
                            {showBorder && (
                                <ColorPickerPopover
                                    isSingleColor={true}
                                    color={borderColor}
                                    setColor={setBorderColor}
                                >
                                    <div className="group relative overflow-hidden rounded-md border shadow-sm transition-all hover:shadow">
                                        <div
                                            className="flex h-16 items-center justify-between p-3"
                                            style={{
                                                backgroundColor:
                                                    getRGBAString(borderColor),
                                            }}
                                        >
                                            <div
                                                className="flex items-center gap-2"
                                                style={{
                                                    color: getRGBAString(
                                                        invertRGBA(
                                                            borderColor,
                                                            true
                                                        )
                                                    ),
                                                }}
                                            >
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                                                    <span className="text-xs">
                                                        Br
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    Border
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </ColorPickerPopover>
                            )}

                            {/* Label Color */}
                            {showLabel && (
                                <ColorPickerPopover
                                    isSingleColor={true}
                                    color={labelColor}
                                    setColor={setLabelColor}
                                >
                                    <div className="group relative overflow-hidden rounded-md border shadow-sm transition-all hover:shadow">
                                        <div
                                            className="flex h-16 items-center justify-between p-3"
                                            style={{
                                                backgroundColor:
                                                    getRGBAString(labelColor),
                                            }}
                                        >
                                            <div
                                                className="flex items-center gap-2"
                                                style={{
                                                    color: getRGBAString(
                                                        invertRGBA(
                                                            labelColor,
                                                            true
                                                        )
                                                    ),
                                                }}
                                            >
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                                                    <span className="text-xs">
                                                        Lb
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    Label
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </ColorPickerPopover>
                            )}

                            {/* Tooltip Background Color */}
                            {showTooltipBackground && (
                                <ColorPickerPopover
                                    isSingleColor={true}
                                    color={tooltipBackgroundColor}
                                    setColor={setTooltipBackgroundColor}
                                >
                                    <div className="group relative overflow-hidden rounded-md border shadow-sm transition-all hover:shadow">
                                        <div
                                            className="flex h-16 items-center justify-between p-3"
                                            style={{
                                                backgroundColor: getRGBAString(
                                                    tooltipBackgroundColor
                                                ),
                                            }}
                                        >
                                            <div
                                                className="flex items-center gap-2"
                                                style={{
                                                    color: getRGBAString(
                                                        invertRGBA(
                                                            tooltipBackgroundColor,
                                                            true
                                                        )
                                                    ),
                                                }}
                                            >
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                                                    <span className="text-xs">
                                                        Tb
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    Tooltip Background
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </ColorPickerPopover>
                            )}

                            {/* Tooltip Border Color */}
                            {showTooltipBorder && (
                                <ColorPickerPopover
                                    isSingleColor={true}
                                    color={tooltipBorderColor}
                                    setColor={setTooltipBorderColor}
                                >
                                    <div className="group relative overflow-hidden rounded-md border shadow-sm transition-all hover:shadow">
                                        <div
                                            className="flex h-16 items-center justify-between p-3"
                                            style={{
                                                backgroundColor:
                                                    getRGBAString(
                                                        tooltipBorderColor
                                                    ),
                                            }}
                                        >
                                            <div
                                                className="flex items-center gap-2"
                                                style={{
                                                    color: getRGBAString(
                                                        invertRGBA(
                                                            tooltipBorderColor,
                                                            true
                                                        )
                                                    ),
                                                }}
                                            >
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                                                    <span className="text-xs">
                                                        Tb
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    Tooltip Border
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </ColorPickerPopover>
                            )}

                            {/* Tooltip Separator Color */}
                            {showTooltipSeparator && (
                                <ColorPickerPopover
                                    isSingleColor={true}
                                    color={tooltipSeparatorColor}
                                    setColor={setTooltipSeparatorColor}
                                >
                                    <div className="group relative overflow-hidden rounded-md border shadow-sm transition-all hover:shadow">
                                        <div
                                            className="flex h-16 items-center justify-between p-3"
                                            style={{
                                                backgroundColor: getRGBAString(
                                                    tooltipSeparatorColor
                                                ),
                                            }}
                                        >
                                            <div
                                                className="flex items-center gap-2"
                                                style={{
                                                    color: getRGBAString(
                                                        invertRGBA(
                                                            tooltipSeparatorColor,
                                                            true
                                                        )
                                                    ),
                                                }}
                                            >
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                                                    <span className="text-xs">
                                                        Ts
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    Tooltip Separator
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </ColorPickerPopover>
                            )}

                            {/* Tooltip Text Color */}
                            {showTooltipText && (
                                <ColorPickerPopover
                                    isSingleColor={true}
                                    color={tooltipTextColor}
                                    setColor={setTooltipTextColor}
                                >
                                    <div className="group relative overflow-hidden rounded-md border shadow-sm transition-all hover:shadow">
                                        <div
                                            className="flex h-16 items-center justify-between p-3"
                                            style={{
                                                backgroundColor:
                                                    getRGBAString(
                                                        tooltipTextColor
                                                    ),
                                            }}
                                        >
                                            <div
                                                className="flex items-center gap-2"
                                                style={{
                                                    color: getRGBAString(
                                                        invertRGBA(
                                                            tooltipTextColor,
                                                            true
                                                        )
                                                    ),
                                                }}
                                            >
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                                                    <span className="text-xs">
                                                        Tt
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    Tooltip Text
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </ColorPickerPopover>
                            )}
                        </div>
                    </TabsContent>

                    {/* Chart Colors Tab */}
                    <TabsContent value="chart-colors" className="p-4 pt-6">
                        {showColorPalette && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="flex items-center gap-2 text-sm font-medium">
                                        <span>Color Palette</span>
                                        <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                            {colorPalette.length}
                                        </span>
                                    </Label>
                                    <ClearAll clearFn={clearColorPalette} />
                                </div>

                                <ScrollArea className="h-[590px] rounded-md border">
                                    <div className="p-3">
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                            {colorPalette.map(
                                                (color, index) => (
                                                    <ColorPickerPopover
                                                        key={index}
                                                        isSingleColor={false}
                                                        color={color}
                                                        colorIndex={index}
                                                        setColor={
                                                            updateColorPalette
                                                        }
                                                        removeColor={
                                                            removeColorPalette
                                                        }
                                                    >
                                                        <div className="group relative overflow-hidden rounded-md border shadow-sm transition-all hover:shadow-md">
                                                            <div
                                                                className="h-16 w-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        getRGBAString(
                                                                            color
                                                                        ),
                                                                }}
                                                            />
                                                            <div className="flex items-center justify-between bg-background p-2">
                                                                <span className="text-xs font-medium">
                                                                    Color{" "}
                                                                    {index + 1}
                                                                </span>
                                                                <div
                                                                    className="h-4 w-4 rounded-full border"
                                                                    style={{
                                                                        backgroundColor:
                                                                            getRGBAString(
                                                                                color
                                                                            ),
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </ColorPickerPopover>
                                                )
                                            )}

                                            <button
                                                className="flex h-[72px] flex-col items-center justify-center rounded-md border bg-background shadow-sm transition-all hover:bg-muted/20 hover:shadow"
                                                onClick={() => {
                                                    addColorPalette();
                                                }}
                                                type="button"
                                                aria-label="Add color"
                                            >
                                                <Plus className="mb-1 h-5 w-5" />
                                                <span className="text-xs">
                                                    Add Color
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
