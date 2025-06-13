"use client";
import { InfoIcon as TooltipIcon, Box, Grid3X3 } from "lucide-react";

import { Label } from "@/components/ui/label";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import {
    GridOrientationSelect,
    GridOrientationSelectForRadar,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    useChartBoxModelStore,
    useChartVisualStore,
} from "@/modules/Chart/store";
import { TooltipProvider } from "@/components/ui/tooltip";

interface GridAndBoxModelConfigProps {
    showGrid?: boolean;
    showGridOrientation?: boolean;
    showGridOrientationRadar?: boolean; // Specific for radar charts
    showGridStyle?: boolean;
    showGridWidth?: boolean;
    showTooltipEnabled?: boolean;
    showTooltipStyle?: boolean;
    showTooltipBorderWidth?: boolean;
    showTooltipBorderRadius?: boolean;
    showTooltipTotal?: boolean;
    showTooltipSeparator?: boolean;
    showBorderWidth?: boolean;
    showMargins?: boolean;
}

export const GridAndBoxModelConfig = ({
    showGrid = true,
    showGridOrientation = true,
    showGridOrientationRadar = false,
    showGridStyle = true,
    showGridWidth = true,
    showTooltipEnabled = true,
    showTooltipStyle = true,
    showTooltipBorderWidth = true,
    showTooltipBorderRadius = true,
    showTooltipTotal = true,
    showTooltipSeparator = true,
    showBorderWidth = true,
    showMargins = true,
}: GridAndBoxModelConfigProps) => {
    // Use individual selectors for each property
    const gridOrientation = useChartVisualStore(
        (state) => state.gridOrientation
    );
    const setGridOrientation = useChartVisualStore(
        (state) => state.setGridOrientation
    );
    const gridStyle = useChartVisualStore((state) => state.gridStyle);
    const setGridStyle = useChartVisualStore((state) => state.setGridStyle);
    const gridWidth = useChartVisualStore((state) => state.gridWidth);
    const setGridWidth = useChartVisualStore((state) => state.setGridWidth);
    const tooltipEnabled = useChartVisualStore((state) => state.tooltipEnabled);
    const toggleTooltip = useChartVisualStore((state) => state.toggleTooltip);
    const tooltipStyle = useChartVisualStore((state) => state.tooltipStyle);
    const setTooltipStyle = useChartVisualStore(
        (state) => state.setTooltipStyle
    );
    const tooltipBorderWidth = useChartVisualStore(
        (state) => state.tooltipBorderWidth
    );
    const tooltipBorderRadius = useChartVisualStore(
        (state) => state.tooltipBorderRadius
    );
    const tooltipTotalEnabled = useChartVisualStore(
        (state) => state.tooltipTotalEnabled
    );
    const tooltipSeparatorEnabled = useChartVisualStore(
        (state) => state.tooltipSeparatorEnabled
    );
    const setTooltipBorderWidth = useChartVisualStore(
        (state) => state.setTooltipBorderWidth
    );
    const setTooltipBorderRadius = useChartVisualStore(
        (state) => state.setTooltipBorderRadius
    );
    const toggleTooltipTotalEnabled = useChartVisualStore(
        (state) => state.toggleTooltipTotalEnabled
    );
    const toggleTooltipSeparatorEnabled = useChartVisualStore(
        (state) => state.toggleTooltipSeparatorEnabled
    );

    const borderWidth = useChartBoxModelStore((state) => state.borderWidth);
    const setBorderWidth = useChartBoxModelStore(
        (state) => state.setBorderWidth
    );
    const marginBottom = useChartBoxModelStore((state) => state.marginBottom);
    const setMarginBottom = useChartBoxModelStore(
        (state) => state.setMarginBottom
    );
    const marginLeft = useChartBoxModelStore((state) => state.marginLeft);
    const setMarginLeft = useChartBoxModelStore((state) => state.setMarginLeft);
    const marginRight = useChartBoxModelStore((state) => state.marginRight);
    const setMarginRight = useChartBoxModelStore(
        (state) => state.setMarginRight
    );
    const marginTop = useChartBoxModelStore((state) => state.marginTop);
    const setMarginTop = useChartBoxModelStore((state) => state.setMarginTop);

    return (
        <TooltipProvider>
            <div className="space-y-4">
                {/* Grid Configuration */}

                {showGrid && (
                    <Card className="border bg-card shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base font-medium">
                                <Grid3X3 className="h-4 w-4" />
                                Grid Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Grid Orientation */}
                            {showGridOrientation && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Grid Orientation
                                    </Label>

                                    {showGridOrientationRadar ? (
                                        <GridOrientationSelectForRadar
                                            gridOrientation={gridOrientation}
                                            setGridOrientation={
                                                setGridOrientation
                                            }
                                        />
                                    ) : (
                                        <GridOrientationSelect
                                            gridOrientation={gridOrientation}
                                            setGridOrientation={
                                                setGridOrientation
                                            }
                                        />
                                    )}
                                </div>
                            )}

                            {/* Grid Style */}
                            {showGridStyle && (
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
                            {showGridWidth && (
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
                )}

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
                        {showTooltipEnabled && (
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

                        {tooltipEnabled && (
                            <>
                                {/* Tooltip Style */}
                                {showTooltipStyle && (
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

                                {/* Tooltip Border Width */}
                                {showTooltipBorderWidth && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Border Width
                                            </Label>
                                            <span className="text-xs text-muted-foreground">
                                                {tooltipBorderWidth}px
                                            </span>
                                        </div>
                                        <Slider
                                            min={MIN_BORDER_WIDTH}
                                            max={MAX_BORDER_WIDTH}
                                            step={1}
                                            value={[tooltipBorderWidth]}
                                            onValueChange={(value) =>
                                                setTooltipBorderWidth(value[0])
                                            }
                                            className="w-full"
                                        />
                                    </div>
                                )}

                                {/* Tooltip Border Radius */}
                                {showTooltipBorderRadius && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Border Radius
                                            </Label>
                                            <span className="text-xs text-muted-foreground">
                                                {tooltipBorderRadius}px
                                            </span>
                                        </div>
                                        <Slider
                                            min={0}
                                            max={20}
                                            step={1}
                                            value={[tooltipBorderRadius]}
                                            onValueChange={(value) =>
                                                setTooltipBorderRadius(value[0])
                                            }
                                            className="w-full"
                                        />
                                    </div>
                                )}

                                {/* Tooltip Total Enabled */}
                                {showTooltipTotal && (
                                    <div className="flex items-center justify-between rounded-md bg-muted/10 p-3">
                                        <Label className="text-sm font-medium">
                                            Show Total in Tooltip
                                        </Label>
                                        <ToggleSwitch
                                            defaultChecked={tooltipTotalEnabled}
                                            toggleFunction={
                                                toggleTooltipTotalEnabled
                                            }
                                        />
                                    </div>
                                )}

                                {/* Tooltip Separator Enabled */}
                                {showTooltipSeparator && (
                                    <div className="flex items-center justify-between rounded-md bg-muted/10 p-3">
                                        <Label className="text-sm font-medium">
                                            Show Separator in Tooltip
                                        </Label>
                                        <ToggleSwitch
                                            defaultChecked={
                                                tooltipSeparatorEnabled
                                            }
                                            toggleFunction={
                                                toggleTooltipSeparatorEnabled
                                            }
                                        />
                                    </div>
                                )}
                            </>
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
                        {/* Border Width */}
                        {showBorderWidth && (
                            <div className="space-y-2 pt-3">
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
                                />
                            </div>
                        )}

                        {/* Margin */}
                        {showMargins && (
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
        </TooltipProvider>
    );
};
