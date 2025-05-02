"use client";
import {
    Info,
    Layers,
    LineChart,
    Maximize2,
    MousePointer,
    Square,
    SquareStack,
    Zap,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useHeatmapChartStore } from "@/modules/Heatmap/store";
import { DAY_OF_WEEK } from "@/constants";
import { getFullDayFromAbbr } from "@/utils/date";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ColorPickerPopover from "@/components/ui/ColorPickerPopover";

export const HeatmapConfig = () => {
    const {
        label_enabled,
        has_border,
        button_hover_enabled,
        tooltip_enabled,
        accent,
        background_color,
        default_box_color,
        text_color,
        toggleBorder,
        toggleButtonHover,
        toggleTooltip,
        toggleAverageOfAllEntries,
        setAccent,
        setBackgroundColor,
        setDefaultBoxColor,
        setTextColor,
        toggleLongestStreak,
        toggleStreak,
        toggleSumOfAllEntries,
        setMetric,
        toggleNumberOfEntries,
        setLongestStreakColor,
        setNumberOfEntriesColor,
        setStreakColor,
        setSumOfAllEntriesColor,
        setAverageOfAllEntriesColor,
        streak_enabled,
        longest_streak_enabled,
        average_of_all_entries_color,
        average_of_all_entries_enabled,
        number_of_entries_enabled,
        longest_streak_color,
        number_of_entries_color,
        streak_color,
        sum_of_all_entries_color,
        sum_of_all_entries_enabled,
        toggleLabel,
        isDayIncludedInStreak,
        toggleDaysToIncludeInStreak,
    } = useHeatmapChartStore((state) => state);

    return (
        <div className="mx-auto space-y-8 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5" />
                        Heatmap Configuration
                    </CardTitle>
                    <CardDescription>
                        Customize your heatmap chart appearance and behavior
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="metrics" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="metrics">Metrics</TabsTrigger>
                            <TabsTrigger value="appearance">
                                Appearance
                            </TabsTrigger>
                            <TabsTrigger value="colors">Colors</TabsTrigger>
                        </TabsList>

                        <TabsContent value="metrics" className="space-y-6 pt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="metric-name">
                                        Metric Name
                                    </Label>
                                    <Input
                                        id="metric-name"
                                        onChange={(e) => {
                                            setMetric(e.target.value);
                                        }}
                                        placeholder="Enter your metric (e.g., Commits, Workouts)"
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <Card className="overflow-hidden">
                                        <CardHeader
                                            className="cursor-pointer bg-muted/30 p-4"
                                            onClick={() => toggleStreak()}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={streak_enabled}
                                                    />
                                                    <CardTitle className="text-base">
                                                        Streak
                                                    </CardTitle>
                                                </div>
                                                <Zap className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <CardDescription>
                                                Number of consecutive entries.
                                                Resets to 0 if a day is missed.
                                            </CardDescription>
                                        </CardHeader>
                                        {streak_enabled && (
                                            <CardContent className="p-4">
                                                <p className="mb-2 text-sm text-muted-foreground">
                                                    Calculate streak only on the
                                                    following days:
                                                </p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {DAY_OF_WEEK.map((abbr) => (
                                                        <div
                                                            key={abbr}
                                                            className="flex items-center space-x-2"
                                                        >
                                                            <Checkbox
                                                                id={`day-${abbr}`}
                                                                defaultChecked={isDayIncludedInStreak(
                                                                    abbr
                                                                )}
                                                                onCheckedChange={() => {
                                                                    toggleDaysToIncludeInStreak(
                                                                        abbr
                                                                    );
                                                                }}
                                                            />
                                                            <Label
                                                                htmlFor={`day-${abbr}`}
                                                                className="text-sm"
                                                            >
                                                                {getFullDayFromAbbr(
                                                                    abbr
                                                                )}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>

                                    <Card className="overflow-hidden">
                                        <CardHeader
                                            className="cursor-pointer bg-muted/30 p-4"
                                            onClick={toggleLongestStreak}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={
                                                            longest_streak_enabled
                                                        }
                                                    />
                                                    <CardTitle className="text-base">
                                                        Longest Streak
                                                    </CardTitle>
                                                </div>
                                                <Maximize2 className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <CardDescription>
                                                Longest streak of consecutive
                                                entries.
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>

                                    <Card className="overflow-hidden">
                                        <CardHeader
                                            className="cursor-pointer bg-muted/30 p-4"
                                            onClick={toggleSumOfAllEntries}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={
                                                            sum_of_all_entries_enabled
                                                        }
                                                    />
                                                    <CardTitle className="text-base">
                                                        Total
                                                    </CardTitle>
                                                </div>
                                                <Layers className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <CardDescription>
                                                Sum of all your entries.
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>

                                    <Card className="overflow-hidden">
                                        <CardHeader
                                            className="cursor-pointer bg-muted/30 p-4"
                                            onClick={toggleAverageOfAllEntries}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={
                                                            average_of_all_entries_enabled
                                                        }
                                                    />
                                                    <CardTitle className="text-base">
                                                        Average
                                                    </CardTitle>
                                                </div>
                                                <LineChart className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <CardDescription>
                                                Statistical average of all your
                                                entries.
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>

                                    <Card className="overflow-hidden">
                                        <CardHeader
                                            className="cursor-pointer bg-muted/30 p-4"
                                            onClick={toggleNumberOfEntries}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={
                                                            number_of_entries_enabled
                                                        }
                                                    />
                                                    <CardTitle className="text-base">
                                                        Number of Entries
                                                    </CardTitle>
                                                </div>
                                                <SquareStack className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <CardDescription>
                                                Number of entries recorded.
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent
                            value="appearance"
                            className="space-y-6 pt-4"
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <Card className="overflow-hidden">
                                    <CardHeader
                                        className="cursor-pointer bg-muted/30 p-4"
                                        onClick={toggleLabel}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={label_enabled}
                                                />
                                                <CardTitle className="text-base">
                                                    Labels
                                                </CardTitle>
                                            </div>
                                            <Info className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <CardDescription>
                                            Show labels on the heatmap.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>

                                <Card className="overflow-hidden">
                                    <CardHeader
                                        className="cursor-pointer bg-muted/30 p-4"
                                        onClick={toggleTooltip}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={tooltip_enabled}
                                                />
                                                <CardTitle className="text-base">
                                                    Tooltips
                                                </CardTitle>
                                            </div>
                                            <Info className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <CardDescription>
                                            Show tooltips when hovering over
                                            cells.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>

                                <Card className="overflow-hidden">
                                    <CardHeader
                                        className="cursor-pointer bg-muted/30 p-4"
                                        onClick={toggleBorder}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={has_border}
                                                />
                                                <CardTitle className="text-base">
                                                    Borders
                                                </CardTitle>
                                            </div>
                                            <Square className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <CardDescription>
                                            Show borders around heatmap cells.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>

                                <Card className="overflow-hidden">
                                    <CardHeader
                                        className="cursor-pointer bg-muted/30 p-4"
                                        onClick={toggleButtonHover}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={
                                                        button_hover_enabled
                                                    }
                                                />
                                                <CardTitle className="text-base">
                                                    Hover Effects
                                                </CardTitle>
                                            </div>
                                            <MousePointer className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <CardDescription>
                                            Enable hover effects on interactive
                                            elements.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="colors" className="space-y-6 pt-4">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">
                                        Theme Colors
                                    </h3>
                                    <Separator />
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <ColorPickerPopover
                                            color={background_color}
                                            setColor={setBackgroundColor}
                                            isSingleColor
                                            label="Background Color"
                                        />
                                        <ColorPickerPopover
                                            color={text_color}
                                            setColor={setTextColor}
                                            isSingleColor
                                            label="Text Color"
                                        />
                                        <ColorPickerPopover
                                            isSingleColor
                                            color={default_box_color}
                                            setColor={setDefaultBoxColor}
                                            enableAlpha={false}
                                            label="Default Cell Color"
                                        />
                                        <ColorPickerPopover
                                            isSingleColor
                                            color={accent}
                                            setColor={setAccent}
                                            enableAlpha={false}
                                            label="Accent Color"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">
                                        Metric Colors
                                    </h3>
                                    <Separator />
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <ColorPickerPopover
                                            color={longest_streak_color}
                                            setColor={setLongestStreakColor}
                                            isSingleColor
                                            label="Longest Streak"
                                        />
                                        <ColorPickerPopover
                                            color={streak_color}
                                            setColor={setStreakColor}
                                            isSingleColor
                                            label="Streak"
                                        />
                                        <ColorPickerPopover
                                            isSingleColor
                                            color={sum_of_all_entries_color}
                                            setColor={setSumOfAllEntriesColor}
                                            label="Total"
                                        />
                                        <ColorPickerPopover
                                            isSingleColor
                                            color={number_of_entries_color}
                                            setColor={setNumberOfEntriesColor}
                                            label="Number of Entries"
                                        />
                                        <ColorPickerPopover
                                            isSingleColor
                                            color={average_of_all_entries_color}
                                            setColor={
                                                setAverageOfAllEntriesColor
                                            }
                                            label="Average"
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};
