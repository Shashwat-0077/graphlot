"use client";

import { Palette, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getRGBAString } from "@/utils/colors";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorTile } from "@/components/ui/color-tile";
import ClearAll from "@/components/ui/clear-all";
import ColorPickerPopover from "@/components/ui/color-picker-popover";
import { useRadarChartStore } from "@/modules/chart-types/radar/store";
import { defaultChartColor } from "@/modules/chart-attributes/default-config";

function BackGroundColor() {
    const backgroundColor = useRadarChartStore(
        (state) => state.backgroundColor
    );
    const setColor = useRadarChartStore((state) => state.setColor);

    return (
        <ColorTile
            color={backgroundColor}
            setColor={(color) => setColor("backgroundColor", color)}
            label="Background"
        />
    );
}

function LegendTextColor() {
    const legendTextColor = useRadarChartStore(
        (state) => state.legendTextColor
    );
    const setColor = useRadarChartStore((state) => state.setColor);

    return (
        <ColorTile
            color={legendTextColor}
            setColor={(color) => setColor("legendTextColor", color)}
            label="Legend Text"
        />
    );
}

function GridColor() {
    const gridColor = useRadarChartStore((state) => state.gridColor);
    const setColor = useRadarChartStore((state) => state.setColor);

    return (
        <ColorTile
            color={gridColor}
            setColor={(color) => setColor("gridColor", color)}
            label="Grid"
        />
    );
}

function BorderColor() {
    const borderColor = useRadarChartStore((state) => state.borderColor);
    const setColor = useRadarChartStore((state) => state.setColor);

    return (
        <ColorTile
            color={borderColor}
            setColor={(color) => setColor("borderColor", color)}
            label="Border"
        />
    );
}

function LabelColor() {
    const labelColor = useRadarChartStore((state) => state.labelColor);
    const setColor = useRadarChartStore((state) => state.setColor);

    return (
        <ColorTile
            color={labelColor}
            setColor={(color) => setColor("labelColor", color)}
            label="Label"
        />
    );
}

function TooltipBackgroundColor() {
    const tooltipBackgroundColor = useRadarChartStore(
        (state) => state.tooltipBackgroundColor
    );
    const setColor = useRadarChartStore((state) => state.setColor);

    return (
        <ColorTile
            color={tooltipBackgroundColor}
            setColor={(color) => setColor("tooltipBackgroundColor", color)}
            label="Tooltip Background"
        />
    );
}

function TooltipBorderColor() {
    const tooltipBorderColor = useRadarChartStore(
        (state) => state.tooltipBorderColor
    );
    const setColor = useRadarChartStore((state) => state.setColor);

    return (
        <ColorTile
            color={tooltipBorderColor}
            setColor={(color) => setColor("tooltipBorderColor", color)}
            label="Tooltip Border"
        />
    );
}

function TooltipSeparatorColor() {
    const tooltipSeparatorColor = useRadarChartStore(
        (state) => state.tooltipSeparatorColor
    );
    const setColor = useRadarChartStore((state) => state.setColor);

    return (
        <ColorTile
            color={tooltipSeparatorColor}
            setColor={(color) => setColor("tooltipSeparatorColor", color)}
            label="Tooltip Separator"
        />
    );
}

function TooltipTextColor() {
    const tooltipTextColor = useRadarChartStore(
        (state) => state.tooltipTextColor
    );
    const setColor = useRadarChartStore((state) => state.setColor);

    return (
        <ColorTile
            color={tooltipTextColor}
            setColor={(color) => setColor("tooltipTextColor", color)}
            label="Tooltip Text"
        />
    );
}

function ChartColors() {
    const colorPalette = useRadarChartStore((state) => state.colorPalette);
    const setColor = useRadarChartStore((state) => state.setColor);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm font-medium">
                    <span>Color Palette</span>
                    <span className="bg-muted text-muted-foreground ml-2 rounded-full px-2 py-0.5 text-xs">
                        {colorPalette.length}
                    </span>
                </Label>
                <ClearAll
                    clearFn={() => {
                        setColor("colorPalette", []);
                    }}
                />
            </div>

            <ScrollArea className="h-[590px] rounded-md border">
                <div className="p-3">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {colorPalette.map((color, index) => (
                            <ColorPickerPopover
                                key={index}
                                isSingleColor={false}
                                color={color}
                                colorIndex={index}
                                setColor={(index, color) => {
                                    setColor(
                                        "colorPalette",
                                        colorPalette.map((c, i) =>
                                            i === index ? color : c
                                        )
                                    );
                                }}
                                removeColor={(index) => {
                                    setColor(
                                        "colorPalette",
                                        colorPalette.filter(
                                            (_c, i) => i !== index
                                        )
                                    );
                                }}
                            >
                                <div className="group relative overflow-hidden rounded-md border shadow-sm transition-all hover:shadow-md">
                                    <div
                                        className="h-16 w-full"
                                        style={{
                                            backgroundColor:
                                                getRGBAString(color),
                                        }}
                                    />
                                    <div className="bg-background flex items-center justify-between p-2">
                                        <span className="text-xs font-medium">
                                            Color {index + 1}
                                        </span>
                                        <div
                                            className="h-4 w-4 rounded-full border"
                                            style={{
                                                backgroundColor:
                                                    getRGBAString(color),
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </ColorPickerPopover>
                        ))}

                        <button
                            className="bg-background hover:bg-muted/20 flex h-[72px] flex-col items-center justify-center rounded-md border shadow-sm transition-all hover:shadow"
                            onClick={() => {
                                setColor("colorPalette", [
                                    ...colorPalette,
                                    defaultChartColor,
                                ]);
                            }}
                            type="button"
                            aria-label="Add color"
                        >
                            <Plus className="mb-1 h-5 w-5" />
                            <span className="text-xs">Add Color</span>
                        </button>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

export function ColorsSettings() {
    return (
        <Card className="bg-card border shadow-sm">
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
                        <BackGroundColor />
                        <LegendTextColor />
                        <GridColor />
                        <BorderColor />
                        <LabelColor />
                        <TooltipBackgroundColor />
                        <TooltipBorderColor />
                        <TooltipSeparatorColor />
                        <TooltipTextColor />
                    </TabsContent>

                    {/* Chart Colors Tab */}
                    <TabsContent value="chart-colors" className="p-4 pt-6">
                        <ChartColors />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
