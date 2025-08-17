"use client";

import { BarChart, Database } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { SORT_OPTIONS, ColumnType, SortType } from "@/constants";
import { useAreaChartStore } from "@/modules/chart-types/area/store";
import { useChartColumns } from "@/modules/chart-attributes/api/client";

export function DataSettings({
    chartId,
    userId,
}: {
    chartId: string;
    userId: string;
}) {
    const xAxis = useAreaChartStore((state) => state.xAxisField);
    const yAxis = useAreaChartStore((state) => state.yAxisField);
    const sortX = useAreaChartStore((state) => state.xAxisSortOrder);
    const omitZeroValuesEnabled = useAreaChartStore(
        (state) => state.omitZeroValuesEnabled
    );
    const sortY = useAreaChartStore((state) => state.yAxisSortOrder);
    const cumulativeEnabled = useAreaChartStore(
        (state) => state.cumulativeEnabled
    );
    const setDataConfig = useAreaChartStore((state) => state.setAreaConfig);

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
        <div className="space-y-6">
            <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg font-medium">
                        <BarChart className="h-5 w-5" />
                        Axis Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* X Axis */}
                        <div className="p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <Label className="text-sm font-medium">
                                    X Axis
                                </Label>
                                {xAxis && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {xAxis}
                                    </Badge>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-[80px_1fr] items-center gap-x-3">
                                    <Label className="text-muted-foreground">
                                        Column
                                    </Label>

                                    {columnsLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="bg-muted/20 h-10 w-full animate-pulse rounded-md" />
                                        </div>
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
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    className="flex items-center justify-center"
                                                    placeholder="Select a Column"
                                                />
                                            </SelectTrigger>
                                            <SelectContent
                                                className="bg-popover text-popover-foreground rounded-md border p-1 shadow-md"
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
                                                                            <div className="flex items-baseline gap-2">
                                                                                <p className="block truncate text-left">
                                                                                    {
                                                                                        col
                                                                                    }
                                                                                </p>
                                                                                <p className="text-muted-foreground block truncate text-left text-xs">
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
                                <div className="grid grid-cols-[80px_1fr] items-center gap-x-3">
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
                                <div className="bg-muted/10 flex items-center justify-between rounded-md p-2">
                                    <Label className="text-xs">
                                        Omit Zero Values
                                    </Label>
                                    <ToggleSwitch
                                        defaultChecked={omitZeroValuesEnabled}
                                        toggleFunction={() => {
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
                        <div className="p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <Label className="text-sm font-medium">
                                    Y Axis
                                </Label>
                                {yAxis && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {yAxis}
                                    </Badge>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-[80px_1fr] items-center gap-x-3">
                                    <Label className="text-muted-foreground text-xs">
                                        Column
                                    </Label>
                                    {columnsLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="bg-muted/20 h-10 w-full animate-pulse rounded-md" />
                                        </div>
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
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    className="flex items-center justify-center"
                                                    placeholder="Select a Column"
                                                />
                                            </SelectTrigger>
                                            <SelectContent
                                                className="bg-popover text-popover-foreground rounded-md border p-1 shadow-md"
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
                                                                            <div className="flex items-baseline gap-2">
                                                                                <p className="block truncate text-left">
                                                                                    {
                                                                                        col
                                                                                    }
                                                                                </p>
                                                                                <p className="text-muted-foreground block truncate text-left text-xs">
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
                                <div className="grid grid-cols-[80px_1fr] items-center gap-x-3">
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
                                <div className="bg-muted/10 flex items-center justify-between rounded-md p-2">
                                    <Label className="text-xs">
                                        Cumulative
                                    </Label>
                                    <ToggleSwitch
                                        defaultChecked={cumulativeEnabled}
                                        toggleFunction={() => {
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
                </CardContent>
            </Card>

            {/* Filters */}
            <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg font-medium">
                            <Database className="h-5 w-5" />
                            Filters
                        </CardTitle>
                        <ClearAll clearFn={() => {}} />
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea
                        className="rounded-md border"
                        style={{ height: "450px" }}
                    >
                        {/* <div className="flex flex-col gap-3 p-3">
                            {filters.length === 0 ? (
                                <div className="text-muted-foreground flex h-20 flex-col items-center justify-center text-center text-sm">
                                    <p>No filters added yet</p>
                                    <p className="text-xs">
                                        Add a filter to refine your chart data
                                    </p>
                                </div>
                            ) : (
                                filters.map((filter, index) => (
                                    <div
                                        className="bg-muted/5 grid grid-cols-[1fr_1fr_1fr_auto] gap-2 rounded-md border p-3"
                                        key={index}
                                    >
                                        <Input
                                            placeholder="Column"
                                            value={filter.column}
                                            onChange={(e) =>
                                                setFilterColumn(
                                                    e.target.value,
                                                    index
                                                )
                                            }
                                            className="h-8 text-xs"
                                        />
                                        <Input
                                            placeholder="Operation"
                                            value={filter.operation}
                                            onChange={(e) =>
                                                setFilterOperation(
                                                    e.target.value,
                                                    index
                                                )
                                            }
                                            className="h-8 text-xs"
                                        />
                                        <Input
                                            placeholder="Value"
                                            value={filter.value}
                                            onChange={(e) =>
                                                setFilterValue(
                                                    e.target.value,
                                                    index
                                                )
                                            }
                                            className="h-8 text-xs"
                                        />
                                        <Button
                                            onClick={() => removeFilter(index)}
                                            variant="destructive"
                                            size="icon"
                                            className="h-8 w-8"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))
                            )}
                            <Button
                                className="bg-muted/5 hover:bg-muted/20 mt-2 flex w-full items-center justify-center gap-2 rounded-md border py-2 text-xs"
                                onClick={() => {
                                    addFilter({
                                        column: "",
                                        operation: "",
                                        value: "",
                                    });
                                }}
                                variant="ghost"
                            >
                                <Plus className="h-3 w-3" /> Add Filter
                            </Button>
                        </div> */}
                    </ScrollArea>

                    <Button
                        type="button"
                        onClick={() => {}}
                        className="mt-4 w-full"
                    >
                        Apply Changes
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
