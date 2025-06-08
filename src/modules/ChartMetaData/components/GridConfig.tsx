"use client";
import { InfoIcon as TooltipIcon, Box, Grid3X3 } from "lucide-react";

import { Label } from "@/components/ui/label";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import {
    GridOrientationSelect,
    GridStylesSelect,
} from "@/components/ui/grid-select";
import { Slider } from "@/components/ui/slider";
import {
    MAX_BORDER_WIDTH,
    MAX_MARGIN,
    MIN_BORDER_WIDTH,
    MIN_MARGIN,
} from "@/constants";
import { TooltipStylesSelect } from "@/components/ui/tooltipStyleSelect";
import { NumberInput } from "@/components/ui/number-input";
import type {
    ChartBoxModelStore,
    ChartVisualStore,
} from "@/modules/ChartMetaData/store/state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const GridAndBoxModelConfig = ({
    gridOrientation,
    setGridOrientation,
    gridStyle,
    setGridStyle,
    gridWidth,
    setGridWidth,
    tooltipEnabled,
    toggleTooltip,
    tooltipStyle,
    setTooltipStyle,
    borderEnabled,
    toggleBorder,
    borderWidth,
    setBorderWidth,
    marginBottom,
    setMarginBottom,
    marginLeft,
    setMarginLeft,
    marginRight,
    setMarginRight,
    marginTop,
    setMarginTop,
}: Partial<ChartBoxModelStore & ChartVisualStore>) => {
    return (
        <div className="space-y-4">
            {/* Grid Configuration */}
            <Card className="border bg-card shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <Grid3X3 className="h-4 w-4" />
                        Grid Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Grid Orientation */}
                    {gridOrientation && setGridOrientation && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                                Grid Orientation
                            </Label>
                            <GridOrientationSelect
                                gridOrientation={gridOrientation}
                                setGridOrientation={setGridOrientation}
                            />
                        </div>
                    )}

                    {/* Grid Style */}
                    {gridStyle && setGridStyle && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                                Grid Style
                            </Label>
                            <GridStylesSelect
                                gridStyle={gridStyle}
                                setGridStyle={setGridStyle}
                            />
                        </div>
                    )}

                    {/* Grid Width */}
                    {gridWidth !== undefined && setGridWidth && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Grid Width
                                </Label>
                                <span className="text-xs text-muted-foreground">
                                    {gridWidth}px
                                </span>
                            </div>
                            <Slider
                                min={MIN_BORDER_WIDTH}
                                max={MAX_BORDER_WIDTH}
                                step={1}
                                value={[gridWidth]}
                                onValueChange={(value) =>
                                    setGridWidth(value[0])
                                }
                                className="w-full"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tooltip Configuration */}
            <Card className="border bg-card shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <TooltipIcon className="h-4 w-4" />
                        Tooltip Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Tooltip Enabled */}
                    {tooltipEnabled !== undefined && toggleTooltip && (
                        <div className="flex items-center justify-between rounded-md bg-muted/10 p-3">
                            <Label className="text-sm font-medium">
                                Enable Tooltip
                            </Label>
                            <ToggleSwitch
                                defaultChecked={tooltipEnabled}
                                toggleFunction={toggleTooltip}
                            />
                        </div>
                    )}

                    {/* Tooltip Style */}
                    {tooltipStyle && setTooltipStyle && tooltipEnabled && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                                Tooltip Style
                            </Label>
                            <TooltipStylesSelect
                                toolTipStyle={tooltipStyle}
                                setTooltipStyle={setTooltipStyle}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Border & Margin Configuration */}
            <Card className="border bg-card shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <Box className="h-4 w-4" />
                        Border & Margin
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Border Enabled */}
                    {borderEnabled !== undefined && toggleBorder && (
                        <div className="flex items-center justify-between rounded-md bg-muted/10 p-3">
                            <Label className="text-sm font-medium">
                                Enable Border
                            </Label>
                            <ToggleSwitch
                                defaultChecked={borderEnabled}
                                toggleFunction={toggleBorder}
                            />
                        </div>
                    )}

                    {/* Border Width */}
                    {borderWidth !== undefined &&
                        setBorderWidth &&
                        borderEnabled && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Border Width
                                    </Label>
                                    <span className="text-xs text-muted-foreground">
                                        {borderWidth}px
                                    </span>
                                </div>
                                <Slider
                                    min={MIN_BORDER_WIDTH}
                                    max={MAX_BORDER_WIDTH}
                                    step={1}
                                    value={[borderWidth]}
                                    onValueChange={(value) =>
                                        setBorderWidth(value[0])
                                    }
                                    className="w-full"
                                    disabled={!borderEnabled}
                                />
                            </div>
                        )}

                    {/* Margin */}
                    {marginTop !== undefined &&
                        setMarginTop &&
                        marginBottom !== undefined &&
                        setMarginBottom &&
                        marginLeft !== undefined &&
                        setMarginLeft &&
                        marginRight !== undefined &&
                        setMarginRight && (
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Margin (px)
                                </Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">
                                            Top
                                        </Label>
                                        <NumberInput
                                            min={MIN_MARGIN}
                                            max={MAX_MARGIN}
                                            step={1}
                                            value={marginTop}
                                            onValueChange={(value) =>
                                                setMarginTop(value)
                                            }
                                            className="w-full"
                                            suffix="px"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">
                                            Bottom
                                        </Label>
                                        <NumberInput
                                            min={MIN_MARGIN}
                                            max={MAX_MARGIN}
                                            step={1}
                                            value={marginBottom}
                                            onValueChange={(value) =>
                                                setMarginBottom(value)
                                            }
                                            className="w-full"
                                            suffix="px"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">
                                            Left
                                        </Label>
                                        <NumberInput
                                            min={MIN_MARGIN}
                                            max={MAX_MARGIN}
                                            step={1}
                                            value={marginLeft}
                                            onValueChange={(value) =>
                                                setMarginLeft(value)
                                            }
                                            className="w-full"
                                            suffix="px"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">
                                            Right
                                        </Label>
                                        <NumberInput
                                            min={MIN_MARGIN}
                                            max={MAX_MARGIN}
                                            step={1}
                                            value={marginRight}
                                            onValueChange={(value) =>
                                                setMarginRight(value)
                                            }
                                            className="w-full"
                                            suffix="px"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                </CardContent>
            </Card>
        </div>
    );
};
