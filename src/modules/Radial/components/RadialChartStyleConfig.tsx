"use client";

import { PieChart, Settings, Layers } from "lucide-react";

import { Slider, DualRangeSlider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    RADIAL_LEGEND_POSITION_OPTIONS,
    type RadialLegendPositionType,
} from "@/constants";
import { useRadialChartStore } from "@/modules/Radial/store";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

export function RadialChartStyleConfig() {
    // Radial chart selectors
    const innerRadius = useRadialChartStore((state) => state.innerRadius);
    const setInnerRadius = useRadialChartStore((state) => state.setInnerRadius);
    const outerRadius = useRadialChartStore((state) => state.outerRadius);
    const setOuterRadius = useRadialChartStore((state) => state.setOuterRadius);
    const startAngle = useRadialChartStore((state) => state.startAngle);
    const setStartAngle = useRadialChartStore((state) => state.setStartAngle);
    const endAngle = useRadialChartStore((state) => state.endAngle);
    const setEndAngle = useRadialChartStore((state) => state.setEndAngle);
    const legendPosition = useRadialChartStore((state) => state.legendPosition);
    const setLegendPosition = useRadialChartStore(
        (state) => state.setLegendPosition
    );
    const legendTextSize = useRadialChartStore((state) => state.legendTextSize);
    const setLegendTextSize = useRadialChartStore(
        (state) => state.setLegendTextSize
    );
    const gap = useRadialChartStore((state) => state.gap);
    const setGap = useRadialChartStore((state) => state.setGap);
    const stacked = useRadialChartStore((state) => state.stacked);
    const toggleStacked = useRadialChartStore((state) => state.toggleStacked);

    return (
        <Card className="border bg-card shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <PieChart className="h-4 w-4" />
                    Radial Chart Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Radial Chart Settings */}
                <Label className="text-sm font-medium">Chart Dimensions</Label>

                {/* Inner Radius */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-muted-foreground">
                            Inner Radius
                        </Label>
                        <span className="text-xs text-muted-foreground">
                            {innerRadius}
                        </span>
                    </div>
                    <Slider
                        value={[innerRadius]}
                        min={0}
                        max={250}
                        step={1}
                        onValueChange={(values) => setInnerRadius(values[0])}
                        className="w-full"
                    />
                </div>

                {/* Outer Radius */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-muted-foreground">
                            Outer Radius
                        </Label>
                        <span className="text-xs text-muted-foreground">
                            {outerRadius}
                        </span>
                    </div>
                    <Slider
                        value={[outerRadius]}
                        min={0}
                        max={250}
                        step={1}
                        onValueChange={(values) => setOuterRadius(values[0])}
                        className="w-full"
                    />
                </div>

                {/* Gap */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-muted-foreground">
                            Gap
                        </Label>
                        <span className="text-xs text-muted-foreground">
                            {gap}
                        </span>
                    </div>
                    <Slider
                        value={[gap]}
                        min={0}
                        max={20}
                        step={1}
                        onValueChange={(values) => setGap(values[0])}
                        className="w-full"
                    />
                </div>

                {/* Angle Range */}
                <div className="space-y-2 pb-4">
                    <Label className="text-sm font-medium text-muted-foreground">
                        Angle Range
                    </Label>
                    <DualRangeSlider
                        value={[startAngle, endAngle]}
                        min={0}
                        max={360}
                        step={1}
                        onValueChange={(values) => {
                            setStartAngle(values[0]);
                            setEndAngle(values[1]);
                        }}
                        className="w-full"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Start: {startAngle}°</span>
                        <span>End: {endAngle}°</span>
                    </div>
                </div>

                {/* Legend Settings */}
                <div className="space-y-3 rounded-md border p-3">
                    <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-sm font-medium">
                            Legend Settings
                        </Label>
                    </div>

                    {/* Legend Position */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                            Position
                        </Label>
                        <Select
                            onValueChange={(value) =>
                                setLegendPosition(
                                    value as RadialLegendPositionType
                                )
                            }
                            value={legendPosition}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                            <SelectContent>
                                {RADIAL_LEGEND_POSITION_OPTIONS.map(
                                    (position) => (
                                        <SelectItem
                                            key={position}
                                            value={position}
                                        >
                                            {position.charAt(0).toUpperCase() +
                                                position.slice(1)}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Legend Text Size */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-muted-foreground">
                                Text Size
                            </Label>
                            <span className="text-xs text-muted-foreground">
                                {legendTextSize}px
                            </span>
                        </div>
                        <Slider
                            value={[legendTextSize]}
                            min={8}
                            max={24}
                            step={1}
                            onValueChange={(values) =>
                                setLegendTextSize(values[0])
                            }
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Stacked */}
                {stacked !== undefined && toggleStacked && (
                    <div className="flex items-center justify-between rounded-md bg-muted/10 p-3">
                        <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-muted-foreground" />
                            <Label className="text-sm">Stacked</Label>
                        </div>
                        <ToggleSwitch
                            defaultChecked={stacked}
                            toggleFunction={toggleStacked}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
