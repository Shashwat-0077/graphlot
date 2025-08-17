"use client";

import { InfoIcon as TooltipIcon, Box, Grid3X3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
    MAX_BORDER_WIDTH,
    MAX_MARGIN,
    MIN_BORDER_WIDTH,
    MIN_MARGIN,
} from "@/constants";
import {
    GridOrientationSelect,
    GridStylesSelect,
} from "@/components/ui/grid-orientation-select";
import { TooltipStylesSelect } from "@/components/ui/tooltip-style-select";
import { useAreaChartStore } from "@/modules/chart-types/area/store";
import { NumberInput } from "@/components/ui/number-input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/utils";

/* ---------------- GRID SETTINGS ---------------- */

function GridToggleSetting() {
    const gridEnabled = useAreaChartStore((s) => s.gridEnabled);
    const setVisuals = useAreaChartStore((s) => s.setVisuals);

    return (
        <div className="bg-muted/10 flex items-center justify-between rounded-md p-3">
            <Label className="text-sm font-medium">Enable Grid</Label>
            <Checkbox
                checked={gridEnabled}
                onCheckedChange={() => setVisuals("gridEnabled", !gridEnabled)}
            />
        </div>
    );
}

function GridOrientationSetting() {
    const gridOrientation = useAreaChartStore((s) => s.gridOrientation);
    const gridEnabled = useAreaChartStore((s) => s.gridEnabled);
    const setVisuals = useAreaChartStore((s) => s.setVisuals);

    return (
        <div
            className={cn(
                "items-center justify-between space-y-2 sm:flex",
                gridEnabled ? "" : "cursor-not-allowed opacity-50"
            )}
        >
            <Label className="text-muted-foreground text-sm font-medium">
                Grid Orientation
            </Label>
            <GridOrientationSelect
                disabled={!gridEnabled}
                gridOrientation={gridOrientation}
                setGridOrientation={(orientation) =>
                    setVisuals("gridOrientation", orientation)
                }
            />
        </div>
    );
}

function GridStyleSetting() {
    const gridStyle = useAreaChartStore((s) => s.gridStyle);
    const gridEnabled = useAreaChartStore((s) => s.gridEnabled);
    const setVisuals = useAreaChartStore((s) => s.setVisuals);

    return (
        <div
            className={cn(
                "items-center justify-between space-y-2 sm:flex",
                gridEnabled ? "" : "cursor-not-allowed opacity-50"
            )}
        >
            <Label className="text-muted-foreground text-sm font-medium">
                Grid Style
            </Label>
            <GridStylesSelect
                gridStyle={gridStyle}
                setGridStyle={(style) => setVisuals("gridStyle", style)}
                disabled={!gridEnabled}
            />
        </div>
    );
}

function GridWidthSetting() {
    const gridWidth = useAreaChartStore((s) => s.gridWidth);
    const setVisuals = useAreaChartStore((s) => s.setVisuals);
    const gridEnabled = useAreaChartStore((s) => s.gridEnabled);

    return (
        <div
            className={cn(
                "space-y-2",
                gridEnabled ? "" : "cursor-not-allowed opacity-50"
            )}
        >
            <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-sm font-medium">
                    Grid Width
                </Label>
                <span className="text-muted-foreground text-xs">
                    {gridWidth}px
                </span>
            </div>
            <Slider
                min={MIN_BORDER_WIDTH}
                max={MAX_BORDER_WIDTH}
                step={1}
                value={[gridWidth]}
                onValueChange={(value) => setVisuals("gridWidth", value[0])}
                className="w-full"
                disabled={!gridEnabled}
            />
        </div>
    );
}

/* ---------------- TOOLTIP SETTINGS ---------------- */

function TooltipEnableToggle() {
    const tooltipEnabled = useAreaChartStore((s) => s.tooltipEnabled);
    const setVisuals = useAreaChartStore((s) => s.setVisuals);

    return (
        <div className="bg-muted/10 flex items-center justify-between rounded-md p-3">
            <Label className="text-sm font-medium">Enable Tooltip</Label>
            <Checkbox
                checked={tooltipEnabled}
                onCheckedChange={() =>
                    setVisuals("tooltipEnabled", !tooltipEnabled)
                }
            />
        </div>
    );
}

function TooltipStyleSetting() {
    const tooltipStyle = useAreaChartStore((s) => s.tooltipStyle);
    const setVisuals = useAreaChartStore((s) => s.setVisuals);
    const tooltipEnabled = useAreaChartStore((s) => s.tooltipEnabled);

    return (
        <div
            className={cn(
                "items-center justify-between space-y-2 sm:flex",
                tooltipEnabled ? "" : "cursor-not-allowed opacity-50"
            )}
        >
            <Label className="text-muted-foreground text-sm font-medium">
                Tooltip Style
            </Label>
            <TooltipStylesSelect
                disabled={!tooltipEnabled}
                toolTipStyle={tooltipStyle}
                setTooltipStyle={(style) => setVisuals("tooltipStyle", style)}
            />
        </div>
    );
}

function TooltipBorderWidthSetting() {
    const tooltipBorderWidth = useAreaChartStore((s) => s.tooltipBorderWidth);
    const setVisuals = useAreaChartStore((s) => s.setVisuals);
    const tooltipEnabled = useAreaChartStore((s) => s.tooltipEnabled);

    return (
        <div
            className={cn(
                "space-y-2",
                tooltipEnabled ? "" : "cursor-not-allowed opacity-50"
            )}
        >
            <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-sm font-medium">
                    Border Width
                </Label>
                <span className="text-muted-foreground text-xs">
                    {tooltipBorderWidth}px
                </span>
            </div>
            <Slider
                disabled={!tooltipEnabled}
                min={MIN_BORDER_WIDTH}
                max={MAX_BORDER_WIDTH}
                step={1}
                value={[tooltipBorderWidth]}
                onValueChange={(value) =>
                    setVisuals("tooltipBorderWidth", value[0])
                }
                className="w-full"
            />
        </div>
    );
}

function TooltipBorderRadiusSetting() {
    const tooltipBorderRadius = useAreaChartStore((s) => s.tooltipBorderRadius);
    const setVisuals = useAreaChartStore((s) => s.setVisuals);
    const tooltipEnabled = useAreaChartStore((s) => s.tooltipEnabled);

    return (
        <div
            className={cn(
                "space-y-2",
                tooltipEnabled ? "" : "cursor-not-allowed opacity-50"
            )}
        >
            <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-sm font-medium">
                    Border Radius
                </Label>
                <span className="text-muted-foreground text-xs">
                    {tooltipBorderRadius}px
                </span>
            </div>
            <Slider
                disabled={!tooltipEnabled}
                min={0}
                max={20}
                step={1}
                value={[tooltipBorderRadius]}
                onValueChange={(value) =>
                    setVisuals("tooltipBorderRadius", value[0])
                }
                className="w-full"
            />
        </div>
    );
}

function TooltipTotalToggle() {
    const tooltipTotalEnabled = useAreaChartStore((s) => s.tooltipTotalEnabled);
    const setVisuals = useAreaChartStore((s) => s.setVisuals);
    const tooltipEnabled = useAreaChartStore((s) => s.tooltipEnabled);

    return (
        <div
            className={cn(
                "bg-muted/10 flex items-center justify-between rounded-md p-3",
                tooltipEnabled ? "" : "cursor-not-allowed opacity-50"
            )}
        >
            <Label className="text-sm font-medium">Show Total in Tooltip</Label>
            <Checkbox
                checked={tooltipTotalEnabled}
                onCheckedChange={() =>
                    setVisuals("tooltipTotalEnabled", !tooltipTotalEnabled)
                }
                disabled={!tooltipEnabled}
            />
        </div>
    );
}

function TooltipSeparatorToggle() {
    const tooltipSeparatorEnabled = useAreaChartStore(
        (s) => s.tooltipSeparatorEnabled
    );
    const setVisuals = useAreaChartStore((s) => s.setVisuals);
    const tooltipEnabled = useAreaChartStore((s) => s.tooltipEnabled);

    return (
        <div
            className={cn(
                "bg-muted/10 flex items-center justify-between rounded-md p-3",
                tooltipEnabled ? "" : "cursor-not-allowed opacity-50"
            )}
        >
            <Label className="text-sm font-medium">
                Show Separator in Tooltip
            </Label>
            <Checkbox
                checked={tooltipSeparatorEnabled}
                onCheckedChange={() =>
                    setVisuals(
                        "tooltipSeparatorEnabled",
                        !tooltipSeparatorEnabled
                    )
                }
                disabled={!tooltipEnabled}
            />
        </div>
    );
}

/* ---------------- BORDER & MARGIN SETTINGS ---------------- */

function BorderWidthSetting() {
    const borderWidth = useAreaChartStore((s) => s.borderWidth);
    const setBoxModel = useAreaChartStore((s) => s.setBoxModel);

    return (
        <div className="space-y-2 pt-3">
            <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-sm font-medium">
                    Border Width
                </Label>
                <span className="text-muted-foreground text-xs">
                    {borderWidth}px
                </span>
            </div>
            <Slider
                min={MIN_BORDER_WIDTH}
                max={MAX_BORDER_WIDTH}
                step={1}
                value={[borderWidth]}
                onValueChange={(value) => setBoxModel("borderWidth", value[0])}
                className="w-full"
            />
        </div>
    );
}

function MarginTopInput() {
    const marginTop = useAreaChartStore((s) => s.marginTop);
    const setBoxModel = useAreaChartStore((s) => s.setBoxModel);

    return (
        <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Top</Label>
            <NumberInput
                min={MIN_MARGIN}
                max={MAX_MARGIN}
                step={1}
                value={marginTop}
                onValueChange={(value) => setBoxModel("marginTop", value)}
                suffix="px"
            />
        </div>
    );
}

function MarginBottomInput() {
    const marginBottom = useAreaChartStore((s) => s.marginBottom);
    const setBoxModel = useAreaChartStore((s) => s.setBoxModel);

    return (
        <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Bottom</Label>
            <NumberInput
                min={MIN_MARGIN}
                max={MAX_MARGIN}
                step={1}
                value={marginBottom}
                onValueChange={(value) => setBoxModel("marginBottom", value)}
                suffix="px"
            />
        </div>
    );
}

function MarginLeftInput() {
    const marginLeft = useAreaChartStore((s) => s.marginLeft);
    const setBoxModel = useAreaChartStore((s) => s.setBoxModel);

    return (
        <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Left</Label>
            <NumberInput
                min={MIN_MARGIN}
                max={MAX_MARGIN}
                step={1}
                value={marginLeft}
                onValueChange={(value) => setBoxModel("marginLeft", value)}
                suffix="px"
            />
        </div>
    );
}

function MarginRightInput() {
    const marginRight = useAreaChartStore((s) => s.marginRight);
    const setBoxModel = useAreaChartStore((s) => s.setBoxModel);

    return (
        <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Right</Label>
            <NumberInput
                min={MIN_MARGIN}
                max={MAX_MARGIN}
                step={1}
                value={marginRight}
                onValueChange={(value) => setBoxModel("marginRight", value)}
                suffix="px"
            />
        </div>
    );
}

/* ---------------- MAIN COMPONENT ---------------- */

export const GridAndBoxModelConfig = () => {
    return (
        <TooltipProvider>
            <div className="space-y-4">
                {/* Grid Settings */}
                <Card className="bg-card border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <Grid3X3 className="h-4 w-4" />
                            Grid Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <GridToggleSetting />
                        <GridOrientationSetting />
                        <GridStyleSetting />
                        <GridWidthSetting />
                    </CardContent>
                </Card>

                {/* Tooltip Settings */}
                <Card className="bg-card border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <TooltipIcon className="h-4 w-4" />
                            Tooltip Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <TooltipEnableToggle />
                        <TooltipStyleSetting />
                        <TooltipBorderWidthSetting />
                        <TooltipBorderRadiusSetting />
                        <TooltipTotalToggle />
                        <TooltipSeparatorToggle />
                    </CardContent>
                </Card>

                {/* Border & Margin Settings */}
                <Card className="bg-card border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <Box className="h-4 w-4" />
                            Border & Margin
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <BorderWidthSetting />
                        <div className="space-y-3">
                            <Label className="text-muted-foreground text-sm font-medium">
                                Margin (px)
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                                <MarginTopInput />
                                <MarginBottomInput />
                                <MarginLeftInput />
                                <MarginRightInput />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    );
};
