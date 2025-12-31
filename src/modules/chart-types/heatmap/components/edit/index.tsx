"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useHeatmapStore } from "@/modules/chart-types/heatmap/store";
import { ColorTile } from "@/components/ui/color-tile";
import { DayOfWeek } from "@/constants";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { NumberInput } from "@/components/ui/number-input";

function MetricSetting() {
    const metric = useHeatmapStore((state) => state.metric);
    const setHeatmapConfig = useHeatmapStore((state) => state.setHeatmapConfig);

    return (
        <div>
            <Label htmlFor="metric">Metric</Label>
            <Input
                id="metric"
                value={metric}
                onChange={(e) => setHeatmapConfig("metric", e.target.value)}
                placeholder="e.g., commits, sales"
                className="mt-1"
            />
        </div>
    );
}

function TooltipEnabled() {
    const tooltip = useHeatmapStore((state) => state.tooltipEnabled);
    const setHeatmapConfig = useHeatmapStore((state) => state.setHeatmapConfig);

    return (
        <div className="flex items-center justify-between">
            <Label>Tooltip</Label>
            <Checkbox
                checked={tooltip}
                onCheckedChange={() =>
                    setHeatmapConfig("tooltipEnabled", !tooltip)
                }
            />
        </div>
    );
}

function LabelEnabled() {
    const labelEnabled = useHeatmapStore((state) => state.labelEnabled);
    const setHeatmapConfig = useHeatmapStore((state) => state.setHeatmapConfig);

    return (
        <div className="flex items-center justify-between">
            <Label>Labels</Label>
            <Checkbox
                checked={labelEnabled}
                onCheckedChange={() =>
                    setHeatmapConfig("labelEnabled", !labelEnabled)
                }
            />
        </div>
    );
}

function BorderEnabled() {
    const borderEnabled = useHeatmapStore((state) => state.borderEnabled);
    const setHeatmapConfig = useHeatmapStore((state) => state.setHeatmapConfig);

    return (
        <div className="flex items-center justify-between">
            <Label>Border</Label>
            <Checkbox
                checked={borderEnabled}
                onCheckedChange={() =>
                    setHeatmapConfig("borderEnabled", !borderEnabled)
                }
            />
        </div>
    );
}

function LegendEnabled() {
    const legendEnabled = useHeatmapStore((state) => state.legendEnabled);
    const setHeatmapConfig = useHeatmapStore((state) => state.setHeatmapConfig);

    return (
        <div className="flex items-center justify-between">
            <Label>Legend</Label>
            <Checkbox
                checked={legendEnabled}
                onCheckedChange={() =>
                    setHeatmapConfig("legendEnabled", !legendEnabled)
                }
            />
        </div>
    );
}

function ButtonHoverEnabled() {
    const buttonHoverEnabled = useHeatmapStore(
        (state) => state.buttonHoverEnabled
    );
    const setHeatmapConfig = useHeatmapStore((state) => state.setHeatmapConfig);

    return (
        <div className="flex items-center justify-between">
            <Label>Button Hover</Label>
            <Checkbox
                checked={buttonHoverEnabled}
                onCheckedChange={() =>
                    setHeatmapConfig("buttonHoverEnabled", !buttonHoverEnabled)
                }
            />
        </div>
    );
}

function BackgroundColor() {
    const backgroundColor = useHeatmapStore((state) => state.backgroundColor);
    const setHeatmapConfig = useHeatmapStore((state) => state.setHeatmapConfig);

    return (
        <ColorTile
            color={backgroundColor}
            setColor={(color) => setHeatmapConfig("backgroundColor", color)}
            label="Background Color"
        />
    );
}

function TextColor() {
    const textColor = useHeatmapStore((state) => state.textColor);
    const setHeatmapConfig = useHeatmapStore((state) => state.setHeatmapConfig);

    return (
        <ColorTile
            color={textColor}
            setColor={(color) => setHeatmapConfig("textColor", color)}
            label="Text Color"
        />
    );
}

function AccentColor() {
    const accent = useHeatmapStore((state) => state.accent);
    const setHeatmapConfig = useHeatmapStore((state) => state.setHeatmapConfig);

    return (
        <ColorTile
            color={accent}
            setColor={(color) => setHeatmapConfig("accent", color)}
            label="Accent Color"
        />
    );
}

function DefaultBoxColor() {
    const defaultBoxColor = useHeatmapStore((state) => state.defaultBoxColor);
    const setHeatmapConfig = useHeatmapStore((state) => state.setHeatmapConfig);

    return (
        <ColorTile
            color={defaultBoxColor}
            setColor={(color) => setHeatmapConfig("defaultBoxColor", color)}
            label="Default Box Color"
        />
    );
}

function LongestStreak() {
    const longestStreak = useHeatmapStore((state) => state.longestStreak);
    const setHeatmapConfig = useHeatmapStore((state) => state.setHeatmapConfig);

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Longest Streak</CardTitle>
                    <Checkbox
                        checked={longestStreak.enabled}
                        onCheckedChange={() =>
                            setHeatmapConfig("longestStreak", {
                                ...longestStreak,
                                enabled: !longestStreak.enabled,
                            })
                        }
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ColorTile
                    color={longestStreak.color}
                    setColor={(color) =>
                        setHeatmapConfig("longestStreak", {
                            ...longestStreak,
                            color,
                        })
                    }
                    label="Color"
                />
            </CardContent>
        </Card>
    );
}

function SumOfAllEntries() {
    const sumOfAllEntries = useHeatmapStore((state) => state.sumOfAllEntries);
    const setHeatmapConfig = useHeatmapStore((state) => state.setHeatmapConfig);

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                        Sum of All Entries
                    </CardTitle>
                    <Checkbox
                        checked={sumOfAllEntries.enabled}
                        onCheckedChange={() =>
                            setHeatmapConfig("sumOfAllEntries", {
                                ...sumOfAllEntries,
                                enabled: !sumOfAllEntries.enabled,
                            })
                        }
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ColorTile
                    color={sumOfAllEntries.color}
                    setColor={(color) =>
                        setHeatmapConfig("sumOfAllEntries", {
                            ...sumOfAllEntries,
                            color,
                        })
                    }
                    label="Color"
                />
            </CardContent>
        </Card>
    );
}

function AverageOfAllEntries() {
    const averageOfAllEntries = useHeatmapStore(
        (state) => state.averageOfAllEntries
    );
    const setHeatmapConfig = useHeatmapStore((state) => state.setHeatmapConfig);

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                        Average of All Entries
                    </CardTitle>
                    <Checkbox
                        checked={averageOfAllEntries.enabled}
                        onCheckedChange={() =>
                            setHeatmapConfig("averageOfAllEntries", {
                                ...averageOfAllEntries,
                                enabled: !averageOfAllEntries.enabled,
                            })
                        }
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ColorTile
                    color={averageOfAllEntries.color}
                    setColor={(color) =>
                        setHeatmapConfig("averageOfAllEntries", {
                            ...averageOfAllEntries,
                            color,
                        })
                    }
                    label="Color"
                />
            </CardContent>
        </Card>
    );
}

function NumberOfEntries() {
    const numberOfEntries = useHeatmapStore((state) => state.numberOfEntries);
    const setHeatmapConfig = useHeatmapStore((state) => state.setHeatmapConfig);

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                        Number of Entries
                    </CardTitle>
                    <Checkbox
                        checked={numberOfEntries.enabled}
                        onCheckedChange={() =>
                            setHeatmapConfig("numberOfEntries", {
                                ...numberOfEntries,
                                enabled: !numberOfEntries.enabled,
                            })
                        }
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ColorTile
                    color={numberOfEntries.color}
                    setColor={(color) =>
                        setHeatmapConfig("numberOfEntries", {
                            ...numberOfEntries,
                            color,
                        })
                    }
                    label="Color"
                />
            </CardContent>
        </Card>
    );
}

function CurrentStreak() {
    const streak = useHeatmapStore((state) => state.streak);
    const setHeatmapConfig = useHeatmapStore((state) => state.setHeatmapConfig);
    const allDays: DayOfWeek[] = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Current Streak</CardTitle>
                        <CardDescription>
                            Configure streak tracking and included days
                        </CardDescription>
                    </div>
                    <Checkbox
                        checked={streak.enabled}
                        onCheckedChange={() =>
                            setHeatmapConfig("streak", {
                                ...streak,
                                enabled: !streak.enabled,
                            })
                        }
                    />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <ColorTile
                    label="Color"
                    color={streak.color}
                    setColor={(color) =>
                        setHeatmapConfig("streak", {
                            ...streak,
                            color,
                        })
                    }
                />

                <div>
                    <Label className="text-sm font-medium">
                        Days to Include
                    </Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {allDays.map((day) => (
                            <Badge
                                key={day}
                                variant={
                                    streak.daysToInclude.includes(day)
                                        ? "default"
                                        : "outline"
                                }
                                className="cursor-pointer"
                                onClick={() => {
                                    const newDays =
                                        streak.daysToInclude.includes(day)
                                            ? streak.daysToInclude.filter(
                                                  (d) => d !== day
                                              )
                                            : [...streak.daysToInclude, day];
                                    setHeatmapConfig("streak", {
                                        ...streak,
                                        daysToInclude: newDays,
                                    });
                                }}
                            >
                                {day}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function BoxBorderRadius() {
    const boxBorderRadius = useHeatmapStore((state) => state.boxBorderRadius);
    const setHeatmapConfig = useHeatmapStore((state) => state.setHeatmapConfig);

    return (
        <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">
                Box Border Radius
            </Label>
            <NumberInput
                min={0}
                max={20}
                step={1}
                value={boxBorderRadius}
                onValueChange={(value) =>
                    setHeatmapConfig("boxBorderRadius", value)
                }
                suffix="px"
            />
        </div>
    );
}

export function HeatmapConfigPanel() {
    return (
        <div className="@container space-y-6">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>
                            Configure basic heatmap settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <MetricSetting />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Display Options</CardTitle>
                        <CardDescription>
                            Control elements visible on your heatmap
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="mb-10 grid gap-4 @sm:grid-cols-2">
                            <TooltipEnabled />
                            <LabelEnabled />
                            <BorderEnabled />
                            <LegendEnabled />
                            <ButtonHoverEnabled />
                        </div>

                        <BoxBorderRadius />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Color Scheme</CardTitle>
                        <CardDescription>
                            Customize the colors used in your heatmap
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 @sm:grid-cols-2">
                            <BackgroundColor />
                            <TextColor />
                            <AccentColor />
                            <DefaultBoxColor />
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <LongestStreak />
                    <SumOfAllEntries />
                    <AverageOfAllEntries />
                    <NumberOfEntries />
                </div>

                <CurrentStreak />
            </div>
        </div>
    );
}
