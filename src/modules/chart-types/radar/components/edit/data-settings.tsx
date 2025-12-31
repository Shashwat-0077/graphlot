"use client";

import { Radar, Database } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ToggleSwitch from "@/components/ui/toggle-switch";
import ClearAll from "@/components/ui/clear-all";
import { useRadarChartStore } from "@/modules/chart-types/radar/store";
import { useChartColumns } from "@/modules/chart-attributes/api/client";
import { ColumnType, SORT_OPTIONS, SortType } from "@/constants";

export function RadarDataSettings({
    chartId,
    userId,
}: {
    chartId: string;
    userId: string;
}) {
    const xAxis = useRadarChartStore((state) => state.xAxisField);
    const yAxis = useRadarChartStore((state) => state.yAxisField);
    const sortX = useRadarChartStore((state) => state.xAxisSortOrder);
    const omitZeroValuesEnabled = useRadarChartStore(
        (state) => state.omitZeroValuesEnabled
    );
    const sortY = useRadarChartStore((state) => state.yAxisSortOrder);
    const cumulativeEnabled = useRadarChartStore(
        (state) => state.cumulativeEnabled
    );
    const setDataConfig = useRadarChartStore((state) => state.setRadarConfig);

    // Fetch chart columns
    const {
        columns,
        isLoading: columnsLoading,
        error,
    } = useChartColumns({
        chartId: chartId,
        userId: userId || "",
    });

    if (error) {
        return <div>Error loading columns</div>;
    }

    return (
        <div className="@container flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 @[600px]:grid-cols-2">
                {/* Axis Configuration Section */}
                <div className="min-w-0 space-y-4">
                    <div className="flex items-center gap-2">
                        <Radar className="h-4 w-4 flex-shrink-0" />
                        <h3 className="truncate text-sm font-medium">
                            Axis Configuration
                        </h3>
                    </div>

                    <div className="space-y-6">
                        {/* X Axis */}
                        <div className="space-y-3">
                            <div className="flex flex-col gap-2 @[400px]:flex-row @[400px]:items-center @[400px]:justify-between">
                                <Label className="text-xs font-medium">
                                    X Axis
                                </Label>
                                {xAxis && (
                                    <Badge
                                        variant="outline"
                                        className="w-fit max-w-full truncate text-xs"
                                    >
                                        {xAxis}
                                    </Badge>
                                )}
                            </div>

                            <div className="border-muted space-y-3 border-l-2 pl-3">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs">
                                        Column
                                    </Label>

                                    {columnsLoading ? (
                                        <div className="bg-muted/20 h-9 w-full animate-pulse rounded-md" />
                                    ) : (
                                        <Select
                                            value={xAxis}
                                            onValueChange={(value) => {
                                                setDataConfig(
                                                    "xAxisField",
                                                    value
                                                );
                                            }}
                                        >
                                            <SelectTrigger className="h-9 w-full">
                                                <SelectValue
                                                    className="flex items-center justify-center"
                                                    placeholder="Select a Column"
                                                />
                                            </SelectTrigger>
                                            <SelectContent
                                                className="bg-popover text-popover-foreground w-full rounded-md border p-1 shadow-md"
                                                position="popper"
                                                sideOffset={4}
                                            >
                                                {Object.keys(columns).map(
                                                    (key) => {
                                                        return (
                                                            <div
                                                                className="mt-1 space-y-0.5"
                                                                key={key}
                                                            >
                                                                {columns[
                                                                    key as keyof ColumnType
                                                                ].map(
                                                                    (
                                                                        col,
                                                                        index
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                index
                                                                            }
                                                                            value={
                                                                                col
                                                                            }
                                                                        >
                                                                            <div className="flex min-w-0 items-baseline gap-2">
                                                                                <p className="block truncate text-left text-xs">
                                                                                    {
                                                                                        col
                                                                                    }
                                                                                </p>
                                                                                <p className="text-muted-foreground block flex-shrink-0 truncate text-left text-xs">
                                                                                    {
                                                                                        key
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs">
                                        Sort
                                    </Label>
                                    <Select
                                        value={sortX}
                                        onValueChange={(value: SortType) => {
                                            setDataConfig(
                                                "xAxisSortOrder",
                                                value
                                            );
                                        }}
                                    >
                                        <SelectTrigger className="h-8 w-full">
                                            <SelectValue placeholder="Select a Column" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SORT_OPTIONS.map((col, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={col}
                                                >
                                                    {col}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="bg-muted/10 flex items-center justify-between gap-2 rounded-md p-3">
                                    <Label className="min-w-0 flex-1 text-xs">
                                        Omit Zero Values
                                    </Label>
                                    <ToggleSwitch
                                        checked={omitZeroValuesEnabled}
                                        onCheckedChange={() => {
                                            setDataConfig(
                                                "omitZeroValuesEnabled",
                                                !omitZeroValuesEnabled
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Y Axis */}
                        <div className="space-y-3">
                            <div className="flex flex-col gap-2 @[400px]:flex-row @[400px]:items-center @[400px]:justify-between">
                                <Label className="text-xs font-medium">
                                    Y Axis
                                </Label>
                                {yAxis && (
                                    <Badge
                                        variant="outline"
                                        className="w-fit max-w-full truncate text-xs"
                                    >
                                        {yAxis}
                                    </Badge>
                                )}
                            </div>

                            <div className="border-muted space-y-3 border-l-2 pl-3">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs">
                                        Column
                                    </Label>
                                    {columnsLoading ? (
                                        <div className="bg-muted/20 h-9 w-full animate-pulse rounded-md" />
                                    ) : (
                                        <Select
                                            value={yAxis}
                                            onValueChange={(value) => {
                                                setDataConfig(
                                                    "yAxisField",
                                                    value
                                                );
                                            }}
                                        >
                                            <SelectTrigger className="h-9 w-full">
                                                <SelectValue
                                                    className="flex items-center justify-center"
                                                    placeholder="Select a Column"
                                                />
                                            </SelectTrigger>
                                            <SelectContent
                                                className="bg-popover text-popover-foreground w-full rounded-md border p-1 shadow-md"
                                                position="popper"
                                                sideOffset={4}
                                            >
                                                {Object.keys(columns).map(
                                                    (key) => {
                                                        return (
                                                            <div
                                                                className="mt-1 space-y-0.5"
                                                                key={key}
                                                            >
                                                                {columns[
                                                                    key as keyof ColumnType
                                                                ].map(
                                                                    (
                                                                        col,
                                                                        index
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                index
                                                                            }
                                                                            value={
                                                                                col
                                                                            }
                                                                        >
                                                                            <div className="flex min-w-0 items-baseline gap-2">
                                                                                <p className="block truncate text-left text-xs">
                                                                                    {
                                                                                        col
                                                                                    }
                                                                                </p>
                                                                                <p className="text-muted-foreground block flex-shrink-0 truncate text-left text-xs">
                                                                                    {
                                                                                        key
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs">
                                        Sort
                                    </Label>
                                    <Select
                                        value={sortY}
                                        onValueChange={(value: SortType) => {
                                            setDataConfig(
                                                "yAxisSortOrder",
                                                value
                                            );
                                        }}
                                    >
                                        <SelectTrigger className="h-8 w-full">
                                            <SelectValue placeholder="Select a Column" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SORT_OPTIONS.map((col, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={col}
                                                >
                                                    {col}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="bg-muted/10 flex items-center justify-between gap-2 rounded-md p-3">
                                    <Label className="min-w-0 flex-1 text-xs">
                                        Cumulative
                                    </Label>
                                    <ToggleSwitch
                                        checked={cumulativeEnabled}
                                        onCheckedChange={() => {
                                            setDataConfig(
                                                "cumulativeEnabled",
                                                !cumulativeEnabled
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="h-full min-w-0 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                            <Database className="h-4 w-4 flex-shrink-0" />
                            <h3 className="truncate text-sm font-medium">
                                Filters
                            </h3>
                        </div>
                        <ClearAll clearFn={() => {}} />
                    </div>

                    <div className="space-y-3">
                        <ScrollArea className="bg-muted/5 h-[455px] min-h-[400px] rounded-md border">
                            <div className="p-3">
                                <div className="text-muted-foreground flex h-20 flex-col items-center justify-center text-center text-xs">
                                    <p>No filters added yet</p>
                                    <p className="text-xs">
                                        Add a filter to refine your chart data
                                    </p>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
}
