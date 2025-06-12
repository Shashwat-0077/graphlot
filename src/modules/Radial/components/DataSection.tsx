"use client";

import { Plus, Trash2, Database, BarChart } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import ClearAll from "@/modules/Chart/components/ClearAll";
import { SORT_OPTIONS, type ChartFilter, type SortType } from "@/constants";

export function DataSection({
    xAxis,
    setXAxis,
    sortBy,
    setSortBy,
    omitZeroValuesEnabled,
    setOmitZeroValuesEnabled,
    filters,
    addFilter,
    removeFilter,
    setFilterColumn,
    setFilterOperation,
    setFilterValue,
    clearFilters,
    onApply,
    columns,
}: {
    xAxis: string;
    setXAxis: (value: string) => void;
    sortBy: SortType;
    setSortBy: (value: SortType) => void;
    omitZeroValuesEnabled: boolean;
    setOmitZeroValuesEnabled: (value: boolean) => void;
    filters: ChartFilter[];
    addFilter: (filter: ChartFilter) => void;
    removeFilter: (index: number) => void;
    setFilterColumn: (value: string, index: number) => void;
    setFilterOperation: (value: string, index: number) => void;
    setFilterValue: (value: string, index: number) => void;
    clearFilters: () => void;
    onApply: () => void;
    columns: Record<string, string[]>;
}) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg font-medium">
                        <BarChart className="h-5 w-5" />
                        Data Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border bg-muted/5 p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <Label className="text-sm font-medium">
                                Segment Configuration
                            </Label>
                            {xAxis && (
                                <Badge variant="outline" className="text-xs">
                                    {xAxis}
                                </Badge>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-[80px_1fr] items-center gap-x-3">
                                <Label className="text-xs text-muted-foreground">
                                    Column
                                </Label>
                                <Select onValueChange={setXAxis} value={xAxis}>
                                    <SelectTrigger className="h-10 min-w-1 rounded-md border border-input py-7 text-sm transition-colors hover:bg-muted/30 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&>span]:w-[70%] [&>span]:text-left">
                                        <SelectValue placeholder="Select a Column" />
                                    </SelectTrigger>
                                    <SelectContent
                                        className="rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                                        position="popper"
                                        sideOffset={4}
                                    >
                                        {Object.keys(columns).map((key) => (
                                            <div
                                                className="mt-1 space-y-0.5"
                                                key={key}
                                            >
                                                {columns[key].map(
                                                    (col, index) => (
                                                        <SelectItem
                                                            key={index}
                                                            value={col}
                                                            className="relative flex w-full cursor-default select-none rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                        >
                                                            <span className="block truncate text-left">
                                                                {col}
                                                            </span>
                                                            <span className="block truncate text-left text-xs text-muted-foreground">
                                                                {key}
                                                            </span>
                                                        </SelectItem>
                                                    )
                                                )}
                                            </div>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-[80px_1fr] items-center gap-x-3">
                                <Label className="text-xs text-muted-foreground">
                                    Sort By
                                </Label>
                                <Select
                                    onValueChange={setSortBy}
                                    value={sortBy}
                                >
                                    <SelectTrigger className="h-8 w-full rounded-md border border-input px-3 py-1 text-xs shadow-sm transition-colors hover:bg-muted/30 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                                        <div className="relative flex items-start [&>span]:flex [&>span]:flex-col [&>span]:items-start [&>span]:justify-start">
                                            <SelectValue
                                                placeholder="Select a Sort Order"
                                                className="relative flex items-start justify-start text-xs"
                                            />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent
                                        className="rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                                        position="popper"
                                        sideOffset={4}
                                    >
                                        {SORT_OPTIONS.map((option, index) => (
                                            <SelectItem
                                                key={index}
                                                value={option}
                                                className="relative flex w-full cursor-default select-none rounded-sm py-1.5 pl-2 pr-8 text-xs outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                            >
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between rounded-md bg-muted/10 p-2">
                                <Label className="text-xs">
                                    Omit Zero Values
                                </Label>
                                <ToggleSwitch
                                    defaultChecked={omitZeroValuesEnabled}
                                    toggleFunction={() => {
                                        setOmitZeroValuesEnabled(
                                            !omitZeroValuesEnabled
                                        );
                                    }}
                                />
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
                        <ClearAll clearFn={clearFilters} />
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea
                        className="rounded-md border"
                        style={{ height: "450px" }}
                    >
                        <div className="flex flex-col gap-3 p-3">
                            {filters.length === 0 ? (
                                <div className="flex h-20 flex-col items-center justify-center text-center text-sm text-muted-foreground">
                                    <p>No filters added yet</p>
                                    <p className="text-xs">
                                        Add a filter to refine your chart data
                                    </p>
                                </div>
                            ) : (
                                filters.map((filter, index) => (
                                    <div
                                        className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 rounded-md border bg-muted/5 p-3"
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
                                className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border bg-muted/5 py-2 text-xs hover:bg-muted/20"
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
                        </div>
                    </ScrollArea>

                    <Button
                        type="button"
                        onClick={onApply}
                        className="mt-4 w-full"
                    >
                        Apply Changes
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
