"use client";

import { Palette, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ColorPickerPopover from "@/components/ui/ColorPickerPopover";
import { Label } from "@/components/ui/label";
import ClearAll from "@/modules/Chart/components/ClearAll";
import { getRGBAString } from "@/utils/colors";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChartColorStore } from "@/modules/Chart/store";
import { ColorTile } from "@/components/ui/ColorTile";

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
    children?: React.ReactNode;
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
    children,
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
                        {/* Background Color */}
                        {showBackground && (
                            <ColorTile
                                color={backgroundColor}
                                setColor={setBackgroundColor}
                                label="Background"
                            />
                        )}

                        {/* Text Color */}
                        {showLegendText && (
                            <ColorTile
                                color={legendTextColor}
                                setColor={setLegendTextColor}
                                label="Legend Text"
                            />
                        )}

                        {/* Grid Color */}
                        {showGrid && (
                            <ColorTile
                                color={gridColor}
                                setColor={setGridColor}
                                label="Grid"
                            />
                        )}

                        {/* Border Color */}
                        {showBorder && (
                            <ColorTile
                                color={borderColor}
                                setColor={setBorderColor}
                                label="Border"
                            />
                        )}

                        {/* Label Color */}
                        {showLabel && (
                            <ColorTile
                                color={labelColor}
                                setColor={setLabelColor}
                                label="Label"
                            />
                        )}

                        {/* Tooltip Background Color */}
                        {showTooltipBackground && (
                            <ColorTile
                                color={tooltipBackgroundColor}
                                setColor={setTooltipBackgroundColor}
                                label="Tooltip Background"
                            />
                        )}

                        {/* Tooltip Border Color */}
                        {showTooltipBorder && (
                            <ColorTile
                                color={tooltipBorderColor}
                                setColor={setTooltipBorderColor}
                                label="Tooltip Border"
                            />
                        )}

                        {/* Tooltip Separator Color */}
                        {showTooltipSeparator && (
                            <ColorTile
                                color={tooltipSeparatorColor}
                                setColor={setTooltipSeparatorColor}
                                label="Tooltip Separator"
                            />
                        )}

                        {/* Tooltip Text Color */}
                        {showTooltipText && (
                            <ColorTile
                                color={tooltipTextColor}
                                setColor={setTooltipTextColor}
                                label="Tooltip Text"
                            />
                        )}

                        {children}
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
