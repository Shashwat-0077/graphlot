"use client";

import { useEffect, useState } from "react";
import {
    Plus,
    Trash2,
    Save,
    Sliders,
    Database,
    Palette,
    Layout,
    BarChart,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import ColorPickerPopover from "@/components/ui/ColorPickerPopover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetDatabaseSchema } from "@/modules/notion/api/client/useGetDatabaseSchema";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    SORT_OPTIONS,
    SortType,
    type ChartConfigComponent,
    type ChartFilter,
} from "@/constants";
import { useAreaChartStore } from "@/modules/Area/store";
import { GridSelect } from "@/components/ui/grid-select";
import ClearAll from "@/modules/ChartMetaData/components/ClearAll";
import { toast } from "@/hooks/use-toast";
import { useUpdateAreaChart } from "@/modules/Area/api/client/use-update-area-chart";
import type { AreaChartSelect } from "@/modules/Area/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRGBAString } from "@/utils/colors";
import {
    SelectFieldsForArea,
    XAxisType,
    YAxisType,
} from "@/modules/Area/util/select-feilds-for-area";
import { useAuthSession } from "@/hooks/use-auth-session";
import { CopyButton } from "@/components/ui/CopyButton";
import { envClient } from "@/lib/env/clientEnv";

function Colors({
    text_color,
    background_color,
    grid_color,
    color_palette,
    setTextColor,
    setBackgroundColor,
    setGridColor,
    addColor,
    removeColor,
    clearColorPalette,
    updateColor,
}: {
    text_color: AreaChartSelect["text_color"];
    background_color: AreaChartSelect["background_color"];
    grid_color: AreaChartSelect["grid_color"];
    color_palette: AreaChartSelect["color_palette"];
    setTextColor: (color: AreaChartSelect["text_color"]) => void;
    setBackgroundColor: (color: AreaChartSelect["background_color"]) => void;
    setGridColor: (color: AreaChartSelect["grid_color"]) => void;
    addColor: () => void;
    removeColor: (index: number) => void;
    clearColorPalette: () => void;
    updateColor: (
        color: AreaChartSelect["color_palette"][0],
        index: number
    ) => void;
}) {
    return (
        <div className="space-y-6 p-2">
            {/* Base Colors Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Base Colors</Label>
                </div>

                <div className="grid gap-4">
                    {/* Background Color */}
                    <ColorPickerPopover
                        isSingleColor={true}
                        color={background_color}
                        setColor={setBackgroundColor}
                    >
                        <div className="group relative overflow-hidden rounded-md border shadow-sm transition-all hover:shadow">
                            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                            <div
                                className="flex h-16 items-center justify-between p-3"
                                style={{
                                    backgroundColor:
                                        getRGBAString(background_color),
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white">
                                        <span className="text-xs">Bg</span>
                                    </div>
                                    <span className="text-sm font-medium">
                                        Background
                                    </span>
                                </div>
                                <div
                                    className="h-6 w-6 rounded-md border border-white/20"
                                    style={{
                                        backgroundColor:
                                            getRGBAString(background_color),
                                    }}
                                ></div>
                            </div>
                        </div>
                    </ColorPickerPopover>

                    {/* Text Color */}
                    <ColorPickerPopover
                        isSingleColor={true}
                        color={text_color}
                        setColor={setTextColor}
                    >
                        <div className="group relative overflow-hidden rounded-md border shadow-sm transition-all hover:shadow">
                            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                            <div
                                className="flex h-16 items-center justify-between p-3"
                                style={{
                                    backgroundColor: getRGBAString(text_color),
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white">
                                        <span className="text-xs">Tx</span>
                                    </div>
                                    <span className="text-sm font-medium">
                                        Text
                                    </span>
                                </div>
                                <div
                                    className="h-6 w-6 rounded-md border border-white/20"
                                    style={{
                                        backgroundColor:
                                            getRGBAString(text_color),
                                    }}
                                ></div>
                            </div>
                        </div>
                    </ColorPickerPopover>

                    {/* Grid Color */}
                    <ColorPickerPopover
                        isSingleColor={true}
                        color={grid_color}
                        setColor={setGridColor}
                    >
                        <div className="group relative overflow-hidden rounded-md border shadow-sm transition-all hover:shadow">
                            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                            <div
                                className="flex h-16 items-center justify-between p-3"
                                style={{
                                    backgroundColor: getRGBAString(grid_color),
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white">
                                        <span className="text-xs">Gr</span>
                                    </div>
                                    <span className="text-sm font-medium">
                                        Grid
                                    </span>
                                </div>
                                <div
                                    className="h-6 w-6 rounded-md border border-white/20"
                                    style={{
                                        backgroundColor:
                                            getRGBAString(grid_color),
                                    }}
                                ></div>
                            </div>
                        </div>
                    </ColorPickerPopover>
                </div>
            </div>

            {/* TODO : Add function for drag and drop */}
            {/* Chart Colors */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                        <Palette className="h-4 w-4" />
                        <span>Chart Colors</span>
                    </Label>
                    <ClearAll clearFn={clearColorPalette} />
                </div>

                <Card className="overflow-hidden border">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between border-b p-3">
                            <span className="text-xs font-medium text-muted-foreground">
                                Color Palette
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {color_palette.length} colors
                            </span>
                        </div>

                        <ScrollArea className="h-[240px]">
                            <div className="p-3">
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {color_palette.map((color, index) => (
                                        <ColorPickerPopover
                                            key={index}
                                            isSingleColor={false}
                                            color={color}
                                            colorIndex={index}
                                            setColor={updateColor}
                                            removeColor={removeColor}
                                        >
                                            <div className="group relative overflow-hidden rounded-md border shadow-sm transition-all hover:shadow-md">
                                                <div
                                                    className="h-16 w-full"
                                                    style={{
                                                        backgroundColor:
                                                            getRGBAString(
                                                                color
                                                            ),
                                                    }}
                                                />
                                                <div className="flex items-center justify-between bg-background p-2">
                                                    <span className="text-xs font-medium">
                                                        Color {index + 1}
                                                    </span>
                                                    <div
                                                        className="h-4 w-4 rounded-full border"
                                                        style={{
                                                            backgroundColor:
                                                                getRGBAString(
                                                                    color
                                                                ),
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </ColorPickerPopover>
                                    ))}

                                    <button
                                        className="flex h-[72px] flex-col items-center justify-center rounded-md border bg-background shadow-sm transition-all hover:bg-muted/20 hover:shadow"
                                        onClick={() => {
                                            addColor();
                                        }}
                                        type="button"
                                        aria-label="Add color"
                                    >
                                        <Plus className="mb-1 h-5 w-5" />
                                        <span className="text-xs">
                                            Add Color
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const UIFeatures = ({
    label_enabled,
    legend_enabled,
    tooltip_enabled,
    toggleLabel,
    toggleLegend,
    toggleTooltip,
}: {
    label_enabled: boolean;
    legend_enabled: boolean;
    tooltip_enabled: boolean;
    toggleLabel: () => void;
    toggleLegend: () => void;
    toggleTooltip: () => void;
}) => {
    return (
        <div className="space-y-5 p-2">
            <div className="mb-3 flex items-center gap-2">
                <Layout className="h-4 w-4" />
                <span className="text-sm font-medium">Display Options</span>
            </div>

            {/* Label*/}
            <div className="flex w-full items-center justify-between rounded-md bg-muted/10 p-3 transition-colors hover:bg-muted/20">
                <Label className="text-sm font-medium">Labels</Label>
                <ToggleSwitch
                    defaultChecked={label_enabled}
                    toggleFunction={toggleLabel}
                />
            </div>

            {/* Legends */}
            <div className="flex w-full items-center justify-between rounded-md bg-muted/10 p-3 transition-colors hover:bg-muted/20">
                <Label className="text-sm font-medium">Legends</Label>
                <ToggleSwitch
                    defaultChecked={legend_enabled}
                    toggleFunction={toggleLegend}
                />
            </div>

            {/* ToolTip */}
            <div className="flex w-full items-center justify-between rounded-md bg-muted/10 p-3 transition-colors hover:bg-muted/20">
                <Label className="text-sm font-medium">Tooltips</Label>
                <ToggleSwitch
                    defaultChecked={tooltip_enabled}
                    toggleFunction={toggleTooltip}
                />
            </div>
        </div>
    );
};

const GridAndLayout = ({
    grid_type,
    setGridType,
}: {
    grid_type: AreaChartSelect["grid_type"];
    setGridType: (grid_type: AreaChartSelect["grid_type"]) => void;
}) => {
    return (
        <div className="space-y-5 p-2">
            <div className="mb-3 flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                <span className="text-sm font-medium">Grid Configuration</span>
            </div>

            <div className="flex w-full items-center justify-between rounded-md bg-muted/10 p-3 transition-colors hover:bg-muted/20">
                <Label className="text-sm font-medium">Grid Type</Label>
                <GridSelect grid_type={grid_type} setGridType={setGridType} />
            </div>
        </div>
    );
};

function DataSection({
    xAxis,
    setXAxis,
    yAxis,
    setYAxis,
    sortX,
    setSortX,
    sortY,
    setSortY,
    omitZeroValues,
    setOmitZeroValues,
    cumulative,
    setCumulative,
    filters,
    addFilter,
    removeFilter,
    setFilterColumn,
    setFilterOperation,
    setFilterValue,
    clearFilters,
    onApply,
    XAxisColumns,
    YAxisColumns,
}: {
    xAxis: string;
    setXAxis: (value: string) => void;
    yAxis: string;
    setYAxis: (value: string) => void;
    sortX: SortType;
    setSortX: (value: SortType) => void;
    sortY: SortType;
    setSortY: (value: SortType) => void;
    omitZeroValues: boolean;
    setOmitZeroValues: (value: boolean) => void;
    cumulative: boolean;
    setCumulative: (value: boolean) => void;
    filters: ChartFilter[];
    setFilters: (filters: ChartFilter[]) => void;
    addFilter: (filter: ChartFilter) => void;
    removeFilter: (index: number) => void;
    setFilterColumn: (value: string, index: number) => void;
    setFilterOperation: (value: string, index: number) => void;
    setFilterValue: (value: string, index: number) => void;
    clearFilters: () => void;
    onApply: () => void;
    XAxisColumns: XAxisType;
    YAxisColumns: YAxisType;
}) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg font-medium">
                        <BarChart className="h-5 w-5" />
                        Axis Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid-col-1 grid gap-6 xl:grid-cols-2">
                        {/* X Axis */}
                        <div className="rounded-lg border bg-muted/5 p-4">
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
                                    <Label className="text-xs text-muted-foreground">
                                        Column
                                    </Label>

                                    <Select
                                        onValueChange={setXAxis}
                                        value={xAxis}
                                    >
                                        <SelectTrigger className="h-10 min-w-1 rounded-md border border-input py-7 text-sm transition-colors hover:bg-muted/30 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&>span]:w-[70%] [&>span]:text-left">
                                            <SelectValue placeholder="Select a Column" />
                                        </SelectTrigger>
                                        <SelectContent
                                            className="rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                                            position="popper"
                                            sideOffset={4}
                                        >
                                            {Object.keys(XAxisColumns).map(
                                                (key) => {
                                                    return (
                                                        <div
                                                            className="mt-1 space-y-0.5"
                                                            key={key}
                                                        >
                                                            {XAxisColumns[
                                                                key as keyof XAxisType
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
                                                                        className="relative flex w-full cursor-default select-none rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                                    >
                                                                        <span className="block truncate text-left">
                                                                            {
                                                                                col
                                                                            }
                                                                        </span>
                                                                        <span className="block truncate text-left text-xs text-muted-foreground">
                                                                            {
                                                                                key
                                                                            }
                                                                        </span>
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-[80px_1fr] items-center gap-x-3">
                                    <Label className="text-xs text-muted-foreground">
                                        Sort
                                    </Label>
                                    <Select
                                        onValueChange={setSortX}
                                        value={sortX}
                                    >
                                        <SelectTrigger className="h-8 w-full rounded-md border border-input px-3 py-1 text-xs shadow-sm transition-colors hover:bg-muted/30 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                                            <div className="relative flex items-start [&>span]:flex [&>span]:flex-col [&>span]:items-start [&>span]:justify-start">
                                                <SelectValue
                                                    placeholder="Select a Column"
                                                    className="relative flex items-start justify-start text-xs"
                                                />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent
                                            className="rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                                            position="popper"
                                            sideOffset={4}
                                        >
                                            {SORT_OPTIONS.map((col, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={col}
                                                    className="relative flex w-full cursor-default select-none rounded-sm py-1.5 pl-2 pr-8 text-xs outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                >
                                                    {col}
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
                                        defaultChecked={omitZeroValues}
                                        toggleFunction={() => {
                                            setOmitZeroValues(!omitZeroValues);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Y Axis */}
                        <div className="rounded-lg border bg-muted/5 p-4">
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
                                    <Label className="text-xs text-muted-foreground">
                                        Column
                                    </Label>
                                    <Select
                                        onValueChange={setYAxis}
                                        value={yAxis}
                                    >
                                        <SelectTrigger className="h-10 min-w-1 rounded-md border border-input py-7 text-sm transition-colors hover:bg-muted/30 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&>span]:w-[70%] [&>span]:text-left">
                                            <SelectValue placeholder="Select a Column" />
                                        </SelectTrigger>
                                        <SelectContent
                                            className="rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                                            position="popper"
                                            sideOffset={4}
                                        >
                                            {Object.keys(YAxisColumns).map(
                                                (key) => {
                                                    return (
                                                        <div
                                                            className="mt-1 space-y-0.5"
                                                            key={key}
                                                        >
                                                            {YAxisColumns[
                                                                key as keyof YAxisType
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
                                                                        className="relative flex w-full cursor-default select-none rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                                    >
                                                                        <span className="block truncate text-left">
                                                                            {
                                                                                col
                                                                            }
                                                                        </span>
                                                                        <span className="block truncate text-left text-xs text-muted-foreground">
                                                                            {
                                                                                key
                                                                            }
                                                                        </span>
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-[80px_1fr] items-center gap-x-3">
                                    <Label className="text-xs text-muted-foreground">
                                        Sort
                                    </Label>
                                    <Select
                                        onValueChange={setSortY}
                                        value={sortY}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
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
                                <div className="flex items-center justify-between rounded-md bg-muted/10 p-2">
                                    <Label className="text-xs">
                                        Cumulative
                                    </Label>
                                    <ToggleSwitch
                                        defaultChecked={cumulative}
                                        toggleFunction={() => {
                                            setCumulative(!cumulative);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
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
                        style={{ height: "300px" }}
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

export const AreaChartConfig: ChartConfigComponent = ({
    notionTableId,
    chartId,
}) => {
    const path = usePathname();
    const { mutate: updateChart } = useUpdateAreaChart({
        onSuccess: () => {
            toast({
                title: "Chart updated successfully",
                description: "Your changes have been saved",
            });
        },
    });

    const handleUpdate = () => {
        toast({
            title: "Saving chart...",
            description: "Please wait while we update your chart",
        });

        updateChart({
            param: {
                id: chartId,
            },
            json: {
                x_axis_field: xAxis,
                y_axis_field: yAxis,
                x_sort_order: sortX,
                y_sort_order: sortY,
                omit_zero_values_enabled: omitZeroValues,
                cumulative_enabled: cumulative,
                filters: filters,
                background_color: background_color,
                grid_color: grid_color,
                text_color: text_color,
                grid_type: grid_type,
                color_palette: color_palette,
                label_enabled: label_enabled,
                legend_enabled: legend_enabled,
                tooltip_enabled: tooltip_enabled,
            },
        });
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                handleUpdate();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    });

    const {
        addColor,
        removeColor,
        background_color,
        clearColorPalette,
        color_palette,
        grid_color,
        grid_type,
        label_enabled,
        legend_enabled,
        setBackgroundColor,
        setGridColor,
        setGridType,
        setTextColor,
        text_color,
        toggleLegend,
        toggleTooltip,
        tooltip_enabled,
        updateColor,
        toggleLabel,
        x_sort_order,
        y_sort_order,
        x_axis_field,
        y_axis_field,
        omit_zero_values_enabled: globalOmitZeroValuesEnabled,
        cumulative_enabled: globalCumulativeEnabled,
        filters: globalFilters,
        setXAxis: setGlobalXAxis,
        setYAxis: setGlobalYAxis,
        setSortX: setGlobalSortX,
        setSortY: setGlobalSortY,
        setFilters: setGlobalFilters,
        setCumulative: setGlobalCumulative,
        setOmitZeroValues: setGlobalOmitZeroValues,
    } = useAreaChartStore((state) => state);

    // Local states
    const [xAxis, setXAxis] = useState(x_axis_field);
    const [yAxis, setYAxis] = useState(y_axis_field);
    const [sortX, setSortX] = useState(x_sort_order);
    const [sortY, setSortY] = useState(y_sort_order);
    const [omitZeroValues, setOmitZeroValues] = useState(
        globalOmitZeroValuesEnabled
    );
    const [cumulative, setCumulative] = useState(globalCumulativeEnabled);
    const [filters, setFilters] = useState<ChartFilter[]>(globalFilters);

    const addFilter = (filter: ChartFilter) => {
        setFilters((prevFilters) => [...prevFilters, filter]);
    };

    const removeFilter = (index: number) => {
        setFilters((prevFilters) =>
            prevFilters.filter((_, filterIndex) => filterIndex !== index)
        );
    };

    const clearFilters = () => {
        setFilters([]);
    };

    const setFilterColumn = (value: string, index: number) => {
        setFilters((prevFilters) => {
            const newFilters = [...prevFilters];
            newFilters[index].column = value;
            return newFilters;
        });
    };

    const setFilterOperation = (value: string, index: number) => {
        setFilters((prevFilters) => {
            const newFilters = [...prevFilters];
            newFilters[index].operation = value;
            return newFilters;
        });
    };

    const setFilterValue = (value: string, index: number) => {
        setFilters((prevFilters) => {
            const newFilters = [...prevFilters];
            newFilters[index].value = value;
            return newFilters;
        });
    };

    const onApply = () => {
        setGlobalXAxis(xAxis);
        setGlobalYAxis(yAxis);
        setGlobalSortX(sortX);
        setGlobalSortY(sortY);
        setGlobalFilters(filters);
        setGlobalCumulative(cumulative);
        setGlobalOmitZeroValues(omitZeroValues);
    };

    const {
        session,
        isLoading: isAuthLoading,
        isAuthenticated,
    } = useAuthSession();

    const user_id = session ? session.user?.id : undefined;

    const {
        data: schema,
        isLoading,
        error,
    } = useGetDatabaseSchema({
        notion_table_id: notionTableId,
        user_id,
    });

    if (isLoading || isAuthLoading || !isAuthenticated) {
        return (
            <div className="mx-auto px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Chart Configuration</h1>
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="grid gap-6 md:grid-cols-[350px_1fr]">
                    <Skeleton className="h-[624px] w-full" />
                    <div className="space-y-6">
                        <Skeleton className="h-[300px] w-full" />
                        <Skeleton className="h-[300px] w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!schema || error) {
        return (
            <div className="mx-auto px-4 py-8">
                <div className="flex h-60 flex-col items-center justify-center rounded-lg border bg-muted/5 text-center">
                    <h2 className="text-xl font-semibold">No Data Available</h2>
                    <p className="mt-2 text-muted-foreground">
                        Please connect a valid Notion database to configure your
                        chart
                    </p>
                </div>
            </div>
        );
    }

    const { XAxisColumns, YAxisColumns } = SelectFieldsForArea(schema);

    return (
        <div className="px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Area Chart Configuration</h1>
                <div className="flex items-center gap-2">
                    <CopyButton
                        textToCopy={
                            envClient.NEXT_PUBLIC_APP_URL +
                            path +
                            "/view?user_id=" +
                            user_id
                        }
                    />
                    <Button
                        type="button"
                        onClick={handleUpdate}
                        className="flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        Save Chart
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
                {/* Appearance Section */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-medium">
                            Appearance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Tabs defaultValue="colors" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 rounded-none">
                                <TabsTrigger value="colors">
                                    <div className="flex items-center gap-1">
                                        <Palette className="h-3 w-3" />
                                        <span>Colors</span>
                                    </div>
                                </TabsTrigger>
                                <TabsTrigger value="ui-features">
                                    <div className="flex items-center gap-1">
                                        <Layout className="h-3 w-3" />
                                        <span>UI Features</span>
                                    </div>
                                </TabsTrigger>
                                <TabsTrigger value="grid-layout">
                                    <div className="flex items-center gap-1">
                                        <Sliders className="h-3 w-3" />
                                        <span>Grid</span>
                                    </div>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="colors">
                                <Colors
                                    text_color={text_color}
                                    background_color={background_color}
                                    grid_color={grid_color}
                                    color_palette={color_palette}
                                    setTextColor={setTextColor}
                                    setBackgroundColor={setBackgroundColor}
                                    setGridColor={setGridColor}
                                    addColor={addColor}
                                    removeColor={removeColor}
                                    clearColorPalette={clearColorPalette}
                                    updateColor={updateColor}
                                />
                            </TabsContent>
                            <TabsContent value="ui-features">
                                <UIFeatures
                                    label_enabled={label_enabled}
                                    legend_enabled={legend_enabled}
                                    tooltip_enabled={tooltip_enabled}
                                    toggleLabel={toggleLabel}
                                    toggleLegend={toggleLegend}
                                    toggleTooltip={toggleTooltip}
                                />
                            </TabsContent>
                            <TabsContent value="grid-layout">
                                <GridAndLayout
                                    grid_type={grid_type}
                                    setGridType={setGridType}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Data Section */}
                <div className="space-y-6">
                    <DataSection
                        xAxis={xAxis}
                        setXAxis={setXAxis}
                        yAxis={yAxis}
                        setYAxis={setYAxis}
                        sortX={sortX}
                        setSortX={setSortX}
                        sortY={sortY}
                        setSortY={setSortY}
                        omitZeroValues={omitZeroValues}
                        setOmitZeroValues={setOmitZeroValues}
                        cumulative={cumulative}
                        setCumulative={setCumulative}
                        filters={filters}
                        setFilters={setFilters}
                        addFilter={addFilter}
                        removeFilter={removeFilter}
                        setFilterColumn={setFilterColumn}
                        setFilterOperation={setFilterOperation}
                        setFilterValue={setFilterValue}
                        clearFilters={clearFilters}
                        onApply={onApply}
                        XAxisColumns={XAxisColumns}
                        YAxisColumns={YAxisColumns}
                    />
                </div>
            </div>

            {/* Keyboard shortcut info */}
            <div className="mt-8 rounded-md border bg-muted/5 p-3 text-center text-sm text-muted-foreground">
                <p>
                    Press{" "}
                    <kbd className="rounded border px-1 py-0.5 text-xs font-semibold">
                        Ctrl
                    </kbd>{" "}
                    +{" "}
                    <kbd className="rounded border px-1 py-0.5 text-xs font-semibold">
                        S
                    </kbd>{" "}
                    to save your chart configuration
                </p>
            </div>
        </div>
    );
};
