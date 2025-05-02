"use client";

import { useEffect, useState } from "react";
import {
    Plus,
    Trash2,
    Save,
    Database,
    Palette,
    Layout,
    BarChart,
} from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ChartConfigComponentType, FilterType } from "@/constants";
import { useDonutChartStore } from "@/modules/Donut/store";
import ClearAll from "@/modules/BasicChart/components/ClearAll";
import { toast } from "@/hooks/use-toast";
import type { DonutSelect } from "@/modules/Donut/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRGBAString } from "@/utils/colors";
import { useUpdateDonutChart } from "@/modules/Donut/api/client/useUpdateDonutChart";

function Colors({
    text_color,
    background_color,
    color_palette,
    setTextColor,
    setBackgroundColor,
    addColor,
    removeColor,
    clearColorPalette,
    updateColor,
}: {
    text_color: DonutSelect["text_color"];
    background_color: DonutSelect["background_color"];
    color_palette: DonutSelect["color_palette"];
    setTextColor: (color: DonutSelect["text_color"]) => void;
    setBackgroundColor: (color: DonutSelect["background_color"]) => void;
    addColor: () => void;
    removeColor: (index: number) => void;
    clearColorPalette: () => void;
    updateColor: (
        color: DonutSelect["color_palette"][0],
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
                </div>
            </div>

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

function DataSection({
    xAxis,
    setXAxis,
    sortBy,
    setSortBy,
    omitZeroValues,
    setOmitZeroValues,
    filters,
    addFilter,
    removeFilter,
    setFilterColumn,
    setFilterOperation,
    setFilterValue,
    clearFilters,
    onApply,
    XAxisColumns,
}: {
    xAxis: string;
    setXAxis: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    omitZeroValues: boolean;
    setOmitZeroValues: (value: boolean) => void;
    filters: FilterType[];
    addFilter: (filter: FilterType) => void;
    removeFilter: (index: number) => void;
    setFilterColumn: (value: string, index: number) => void;
    setFilterOperation: (value: string, index: number) => void;
    setFilterValue: (value: string, index: number) => void;
    clearFilters: () => void;
    onApply: () => void;
    XAxisColumns: string[];
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
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select a Column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {XAxisColumns.map((col, index) => (
                                            <SelectItem key={index} value={col}>
                                                {col}
                                            </SelectItem>
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
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select a Column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem key={0} value="None">
                                            None
                                        </SelectItem>
                                        <Separator className="my-1" />
                                        {XAxisColumns.map((col, index) => (
                                            <SelectItem
                                                key={index + 1}
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

export const DonutConfig: ChartConfigComponentType = ({
    notion_table_id,
    chart_id,
}) => {
    const { mutate: updateChart } = useUpdateDonutChart({
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
                chart_id: chart_id,
            },
            json: {
                x_axis: xAxis,
                sort_by: sortBy,
                omit_zero_values: omitZeroValues,
                filters: filters,
                background_color: background_color,
                text_color: text_color,
                color_palette: color_palette,
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

    const { data, isLoading } = useGetDatabaseSchema(notion_table_id);

    // local states
    const [xAxis, setXAxis] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [omitZeroValues, setOmitZeroValues] = useState(false);
    const [filters, setFilters] = useState<FilterType[]>([]);

    const addFilter = (filter: FilterType) => {
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

    const {
        addColor,
        removeColor,
        background_color,
        clearColorPalette,
        color_palette,
        label_enabled,
        legend_enabled,
        setBackgroundColor,
        setTextColor,
        text_color,
        toggleLegend,
        toggleTooltip,
        tooltip_enabled,
        updateColor,
        toggleLabel,
        setXAxis: setGlobalXAxis,
        setSortBy: setGlobalSortBy,
        setFilters: setGlobalFilters,
        setOmitZeroValues: setGlobalOmitZeroValues,
    } = useDonutChartStore((state) => state);

    const onApply = () => {
        setGlobalXAxis(xAxis);
        setGlobalSortBy(sortBy);
        setGlobalFilters(filters);
        setGlobalOmitZeroValues(omitZeroValues);
    };

    if (isLoading) {
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

    if (!data) {
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

    const XAxisColumns: string[] = [];

    Object.keys(data).forEach((col) => {
        if (["status", "select", "multi_select"].includes(data[col].type)) {
            XAxisColumns.push(col);
        }
    });

    return (
        <div className="px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    Donut Chart Configuration
                </h1>
                <Button
                    type="button"
                    onClick={handleUpdate}
                    className="flex items-center gap-2"
                >
                    <Save className="h-4 w-4" />
                    Save Chart
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
                {/* Appearance Section */}
                <Card className="">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-medium">
                            Appearance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Tabs defaultValue="colors" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 rounded-none">
                                <TabsTrigger value="colors" className="">
                                    <div className="flex items-center gap-1">
                                        <Palette className="h-3 w-3" />
                                        <span>Colors</span>
                                    </div>
                                </TabsTrigger>
                                <TabsTrigger value="ui-features" className="">
                                    <div className="flex items-center gap-1">
                                        <Layout className="h-3 w-3" />
                                        <span>UI Features</span>
                                    </div>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="colors">
                                <Colors
                                    text_color={text_color}
                                    background_color={background_color}
                                    color_palette={color_palette}
                                    setTextColor={setTextColor}
                                    setBackgroundColor={setBackgroundColor}
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
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Data Section */}
                <div className="space-y-6">
                    <DataSection
                        xAxis={xAxis}
                        setXAxis={setXAxis}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        omitZeroValues={omitZeroValues}
                        setOmitZeroValues={setOmitZeroValues}
                        filters={filters}
                        addFilter={addFilter}
                        removeFilter={removeFilter}
                        setFilterColumn={setFilterColumn}
                        setFilterOperation={setFilterOperation}
                        setFilterValue={setFilterValue}
                        clearFilters={clearFilters}
                        onApply={onApply}
                        XAxisColumns={XAxisColumns}
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
