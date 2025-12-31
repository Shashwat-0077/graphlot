"use client";

import { InfoIcon as TooltipIcon, Box } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
    MAX_BORDER_WIDTH,
    MAX_MARGIN,
    MAX_X_OFFSET,
    MAX_Y_OFFSET,
    MIN_BORDER_WIDTH,
    MIN_MARGIN,
    MIN_X_OFFSET,
    MIN_Y_OFFSET,
} from "@/constants";
import { TooltipStylesSelect } from "@/components/ui/tooltip-style-select";
import { useRadialChartStore } from "@/modules/chart-types/radial/store";
import { NumberInput } from "@/components/ui/number-input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/utils";

/* ---------------- TOOLTIP SETTINGS ---------------- */

function TooltipEnableToggle() {
    const tooltipEnabled = useRadialChartStore((s) => s.tooltipEnabled);
    const setVisuals = useRadialChartStore((s) => s.setVisuals);

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
    const tooltipStyle = useRadialChartStore((s) => s.tooltipStyle);
    const setVisuals = useRadialChartStore((s) => s.setVisuals);
    const tooltipEnabled = useRadialChartStore((s) => s.tooltipEnabled);

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
    const tooltipBorderWidth = useRadialChartStore((s) => s.tooltipBorderWidth);
    const setVisuals = useRadialChartStore((s) => s.setVisuals);
    const tooltipEnabled = useRadialChartStore((s) => s.tooltipEnabled);

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
    const tooltipBorderRadius = useRadialChartStore(
        (s) => s.tooltipBorderRadius
    );
    const setVisuals = useRadialChartStore((s) => s.setVisuals);
    const tooltipEnabled = useRadialChartStore((s) => s.tooltipEnabled);

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
    const tooltipTotalEnabled = useRadialChartStore(
        (s) => s.tooltipTotalEnabled
    );
    const setVisuals = useRadialChartStore((s) => s.setVisuals);
    const tooltipEnabled = useRadialChartStore((s) => s.tooltipEnabled);

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
    const tooltipSeparatorEnabled = useRadialChartStore(
        (s) => s.tooltipSeparatorEnabled
    );
    const setVisuals = useRadialChartStore((s) => s.setVisuals);
    const tooltipEnabled = useRadialChartStore((s) => s.tooltipEnabled);

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
    const borderWidth = useRadialChartStore((s) => s.borderWidth);
    const setBoxModel = useRadialChartStore((s) => s.setBoxModel);

    return (
        <div className="space-y-2">
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
    const marginTop = useRadialChartStore((s) => s.marginTop);
    const setBoxModel = useRadialChartStore((s) => s.setBoxModel);

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
    const marginBottom = useRadialChartStore((s) => s.marginBottom);
    const setBoxModel = useRadialChartStore((s) => s.setBoxModel);

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
    const marginLeft = useRadialChartStore((s) => s.marginLeft);
    const setBoxModel = useRadialChartStore((s) => s.setBoxModel);

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
    const marginRight = useRadialChartStore((s) => s.marginRight);
    const setBoxModel = useRadialChartStore((s) => s.setBoxModel);

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

function XOffsetSettings() {
    const xOffset = useRadialChartStore((s) => s.xOffset);
    const setBoxModel = useRadialChartStore((s) => s.setBoxModel);

    return (
        <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">X Offset</Label>
            <NumberInput
                min={MIN_X_OFFSET}
                max={MAX_X_OFFSET}
                step={1}
                value={xOffset}
                onValueChange={(value) => setBoxModel("xOffset", value)}
                suffix="px"
            />
        </div>
    );
}

function YOffsetSettings() {
    const yOffset = useRadialChartStore((s) => s.yOffset);
    const setBoxModel = useRadialChartStore((s) => s.setBoxModel);

    return (
        <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Y Offset</Label>
            <NumberInput
                min={MIN_Y_OFFSET}
                max={MAX_Y_OFFSET}
                step={1}
                value={yOffset}
                onValueChange={(value) => setBoxModel("yOffset", value)}
                suffix="px"
            />
        </div>
    );
}

/* ---------------- MAIN COMPONENT ---------------- */

export const GridAndBoxModelSettings = () => {
    return (
        <TooltipProvider>
            <div className="space-y-4">
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
                            <Label className="text-muted-foreground mt-10 text-sm font-medium">
                                Margin (px)
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                                <MarginTopInput />
                                <MarginBottomInput />
                                <MarginLeftInput />
                                <MarginRightInput />
                            </div>
                        </div>

                        <div>
                            <Label className="text-muted-foreground mt-10 text-sm font-medium">
                                Offsets (px)
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                                <XOffsetSettings />
                                <YOffsetSettings />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    );
};
