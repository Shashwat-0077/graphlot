"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    RADIAL_LEGEND_POSITION_OPTIONS,
    type RadialLegendPositionType,
} from "@/constants";

export function RadialChartStyleConfig({
    innerRadius,
    setInnerRadius,
    outerRadius,
    setOuterRadius,
    startAngle,
    setStartAngle,
    endAngle,
    setEndAngle,
    legendPosition,
    setLegendPosition,
    legendTextSize,
    setLegendTextSize,
}: {
    innerRadius: number;
    setInnerRadius: (value: number) => void;
    outerRadius: number;
    setOuterRadius: (value: number) => void;
    startAngle: number;
    setStartAngle: (value: number) => void;
    endAngle: number;
    setEndAngle: (value: number) => void;
    legendPosition: RadialLegendPositionType;
    setLegendPosition: (value: RadialLegendPositionType) => void;
    legendTextSize: number;
    setLegendTextSize: (value: number) => void;
}) {
    return (
        <div className="space-y-6 pt-4">
            <div className="space-y-3">
                <h3 className="text-sm font-medium">Radial Chart Settings</h3>

                {/* Inner Radius */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">
                            Inner Radius
                        </Label>
                        <span className="text-xs font-medium">
                            {innerRadius}
                        </span>
                    </div>
                    <Slider
                        value={[innerRadius]}
                        min={0}
                        max={250}
                        step={1}
                        onValueChange={(values) => setInnerRadius(values[0])}
                        className="py-2"
                    />
                </div>

                {/* Outer Radius */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">
                            Outer Radius
                        </Label>
                        <span className="text-xs font-medium">
                            {outerRadius}
                        </span>
                    </div>
                    <Slider
                        value={[outerRadius]}
                        min={0}
                        max={250}
                        step={1}
                        onValueChange={(values) => setOuterRadius(values[0])}
                        className="py-2"
                    />
                </div>

                {/* Start Angle */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">
                            Start Angle
                        </Label>
                        <span className="text-xs font-medium">
                            {startAngle}°
                        </span>
                    </div>
                    <Slider
                        value={[startAngle]}
                        min={0}
                        max={360}
                        step={1}
                        onValueChange={(values) => setStartAngle(values[0])}
                        className="py-2"
                    />
                </div>

                {/* End Angle */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">
                            End Angle
                        </Label>
                        <span className="text-xs font-medium">{endAngle}°</span>
                    </div>
                    <Slider
                        value={[endAngle]}
                        min={0}
                        max={360}
                        step={1}
                        onValueChange={(values) => setEndAngle(values[0])}
                        className="py-2"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-medium">Legend Settings</h3>

                {/* Legend Position */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-x-3">
                    <Label className="text-xs text-muted-foreground">
                        Position
                    </Label>
                    <Select
                        onValueChange={(value) =>
                            setLegendPosition(value as RadialLegendPositionType)
                        }
                        value={legendPosition}
                    >
                        <SelectTrigger className="h-8 w-full rounded-md border border-input px-3 py-1 text-xs shadow-sm">
                            <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                            {RADIAL_LEGEND_POSITION_OPTIONS.map((position) => (
                                <SelectItem
                                    key={position}
                                    value={position}
                                    className="text-xs"
                                >
                                    {position.charAt(0).toUpperCase() +
                                        position.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Legend Text Size */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">
                            Text Size
                        </Label>
                        <span className="text-xs font-medium">
                            {legendTextSize}px
                        </span>
                    </div>
                    <Slider
                        value={[legendTextSize]}
                        min={8}
                        max={24}
                        step={1}
                        onValueChange={(values) => setLegendTextSize(values[0])}
                        className="py-2"
                    />
                </div>
            </div>
        </div>
    );
}
