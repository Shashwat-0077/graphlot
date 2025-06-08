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
import { usePathname } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import ColorPickerPopover from "@/components/ui/ColorPickerPopover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotionDatabaseSchema } from "@/modules/notion/api/client/use-notion-database-schema";
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
    SortType,
    SortType,
    type ChartConfigComponentType,
    type ChartFilter,
} from "@/constants";
import { useDonutChartStore } from "@/modules/Radial/store";
import ClearAll from "@/modules/Chart/components/ClearAll";
import { toast } from "@/hooks/use-toast";
import type { DonutSelect } from "@/modules/Radial/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRGBAString } from "@/utils/colors";
import { useUpdateDonutChart } from "@/modules/Radial/api/client/use-update-radial-chart";
import {
    SelectFieldsForDonut,
    XAxisType,
} from "@/modules/Radial/utils/selectFieldsForDonut";
import { useAuthSession } from "@/hooks/use-auth-session";
import { envClient } from "@/lib/env/clientEnv";
import { CopyButton } from "@/components/ui/CopyButton";

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
    sortBy: SortType;
    setSortBy: (value: SortType) => void;
    omitZeroValues: boolean;
    setOmitZeroValues: (value: boolean) => void;
    filters: ChartFilter[];
    addFilter: (filter: ChartFilter) => void;
    removeFilter: (index: number) => void;
    setFilterColumn: (value: string, index: number) => void;
    setFilterOperation: (value: string, index: number) => void;
    setFilterValue: (value: string, index: number) => void;
    clearFilters: () => void;
    onApply: () => void;
    XAxisColumns: XAxisType;
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
                                        {Object.keys(XAxisColumns).map(
                                            (key) => {
                                                return (
                                                    <div
                                                        className="mt-1 space-y-0.5"
                                                        key={key}
                                                    >
                                                        {XAxisColumns[
                                                            key as keyof XAxisType
                                                        ].map((col, index) => (
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
                                                        ))}
                                                    </div>
                                                );
                                            }
                                        )}
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
                                        {SortOption.map((col, index) => (
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
    const path = usePathname();

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
        x_axis,
        sort_by,
        omit_zero_values: globalOmitZeroValues,
        filters: globalFilters,
        setXAxis: setGlobalXAxis,
        setSortBy: setGlobalSortBy,
        setFilters: setGlobalFilters,
        setOmitZeroValues: setGlobalOmitZeroValues,
    } = useDonutChartStore((state) => state);

    // local states
    const [xAxis, setXAxis] = useState(x_axis);
    const [sortBy, setSortBy] = useState(sort_by);
    const [omitZeroValues, setOmitZeroValues] = useState(globalOmitZeroValues);
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
        setGlobalSortBy(sortBy);
        setGlobalFilters(filters);
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
    } = useNotionDatabaseSchema({
        notion_table_id,
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

    const { XAxisColumns } = SelectFieldsForDonut(schema);

    return (
        <div className="px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    Donut Chart Configuration
                </h1>
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
