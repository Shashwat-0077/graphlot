"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Save } from "lucide-react";
import { useWindowSize } from "react-use";
import { Palette, Layout, Sliders } from "lucide-react"; // Importing undeclared variables

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { ChartConfigComponent, ChartFilter } from "@/constants";
import { useBarChartStore } from "@/modules/Bar/store";
import { toast } from "@/hooks/use-toast";
import { useUpdateBarChart } from "@/modules/Bar/api/client/use-update-bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/CopyButton";
import { envClient } from "@/lib/env/clientEnv";
import {
    useChartBoxModelStore,
    useChartColorStore,
    useChartTypographyStore,
    useChartVisualStore,
} from "@/modules/Chart/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChartColumns } from "@/modules/Chart/api/client/use-chart";
import { DataSection } from "@/modules/Bar/components/DataSection";
import { ColorsConfig } from "@/modules/Chart/components/ColorConfig";
import { UIConfig } from "@/modules/Chart/components/UIConfig";
import { BarChartStyleConfig } from "@/modules/Bar/components/BarChartStyle";
import { GridAndBoxModelConfig } from "@/modules/Chart/components/GridConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const BarChartConfig: ChartConfigComponent = ({ chartId, userId }) => {
    const path = usePathname();
    const { mutate: updateChart } = useUpdateBarChart({
        onSuccess: () => {
            toast({
                title: "Chart updated successfully",
                description: "Your changes have been saved",
            });
        },
    });

    // Store selectors
    // Visual configuration
    const gridOrientation = useChartVisualStore(
        (state) => state.gridOrientation
    );
    const gridStyle = useChartVisualStore((state) => state.gridStyle);
    const gridWidth = useChartVisualStore((state) => state.gridWidth);
    const tooltipEnabled = useChartVisualStore((state) => state.tooltipEnabled);
    const tooltipStyle = useChartVisualStore((state) => state.tooltipStyle);
    const tooltipBorderWidth = useChartVisualStore(
        (state) => state.tooltipBorderWidth
    );
    const tooltipBorderRadius = useChartVisualStore(
        (state) => state.tooltipBorderRadius
    );
    const tooltipTotalEnabled = useChartVisualStore(
        (state) => state.tooltipTotalEnabled
    );
    const tooltipSeparatorEnabled = useChartVisualStore(
        (state) => state.tooltipSeparatorEnabled
    );

    // Box model configuration
    const borderWidth = useChartBoxModelStore((state) => state.borderWidth);
    const marginBottom = useChartBoxModelStore((state) => state.marginBottom);
    const marginLeft = useChartBoxModelStore((state) => state.marginLeft);
    const marginRight = useChartBoxModelStore((state) => state.marginRight);
    const marginTop = useChartBoxModelStore((state) => state.marginTop);

    // Color configuration
    const backgroundColor = useChartColorStore(
        (state) => state.backgroundColor
    );
    const borderColor = useChartColorStore((state) => state.borderColor);
    const colorPalette = useChartColorStore((state) => state.colorPalette);
    const gridColor = useChartColorStore((state) => state.gridColor);
    const labelColor = useChartColorStore((state) => state.labelColor);
    const legendTextColor = useChartColorStore(
        (state) => state.legendTextColor
    );
    const tooltipBackgroundColor = useChartColorStore(
        (state) => state.tooltipBackgroundColor
    );
    const tooltipTextColor = useChartColorStore(
        (state) => state.tooltipTextColor
    );
    const tooltipSeparatorColor = useChartColorStore(
        (state) => state.tooltipSeparatorColor
    );
    const tooltipBorderColor = useChartColorStore(
        (state) => state.tooltipBorderColor
    );

    // Typography configuration
    const label = useChartTypographyStore((state) => state.label);
    const labelAnchor = useChartTypographyStore((state) => state.labelAnchor);
    const labelEnabled = useChartTypographyStore((state) => state.labelEnabled);
    const labelFontFamily = useChartTypographyStore(
        (state) => state.labelFontFamily
    );
    const labelFontStyle = useChartTypographyStore(
        (state) => state.labelFontStyle
    );
    const labelSize = useChartTypographyStore((state) => state.labelSize);
    const legendEnabled = useChartTypographyStore(
        (state) => state.legendEnabled
    );

    // Bar chart store selectors
    const xAxisField = useBarChartStore((state) => state.xAxisField);
    const yAxisField = useBarChartStore((state) => state.yAxisField);
    const filters = useBarChartStore((state) => state.filters);
    const xAxisSortOrder = useBarChartStore((state) => state.xAxisSortOrder);
    const yAxisSortOrder = useBarChartStore((state) => state.yAxisSortOrder);
    const omitZeroValuesEnabled = useBarChartStore(
        (state) => state.omitZeroValuesEnabled
    );
    const cumulativeEnabled = useBarChartStore(
        (state) => state.cumulativeEnabled
    );
    const yAxisEnabled = useBarChartStore((state) => state.yAxisEnabled);
    const xAxisEnabled = useBarChartStore((state) => state.xAxisEnabled);
    const barBorderRadius = useBarChartStore((state) => state.barBorderRadius);
    const barWidth = useBarChartStore((state) => state.barWidth);
    const barGap = useBarChartStore((state) => state.barGap);
    const fillOpacity = useBarChartStore((state) => state.fillOpacity);
    const strokeWidth = useBarChartStore((state) => state.strokeWidth);
    const stacked = useBarChartStore((state) => state.stacked);
    const borderRadiusBetweenBars = useBarChartStore(
        (state) => state.borderRadiusBetweenBars
    );

    // Store actions
    const setXAxisField = useBarChartStore((state) => state.setXAxisField);
    const setYAxisField = useBarChartStore((state) => state.setYAxisField);
    const setFilters = useBarChartStore((state) => state.setFilters);
    const setXAxisSortOrder = useBarChartStore(
        (state) => state.setXAxisSortOrder
    );
    const setYAxisSortOrder = useBarChartStore(
        (state) => state.setYAxisSortOrder
    );
    const setOmitZeroValuesEnabled = useBarChartStore(
        (state) => state.setOmitZeroValuesEnabled
    );
    const setCumulativeEnabled = useBarChartStore(
        (state) => state.setCumulativeEnabled
    );

    // Create config objects for API call
    const handleUpdate = () => {
        toast({
            title: "Saving chart...",
            description: "Please wait while we update your chart",
        });

        const chartVisualConfig = {
            gridOrientation,
            gridStyle,
            gridWidth,
            tooltipEnabled,
            tooltipStyle,
            tooltipBorderWidth,
            tooltipBorderRadius,
            tooltipTotalEnabled,
            tooltipSeparatorEnabled,
        };

        const chartBoxModelConfig = {
            borderWidth,
            marginBottom,
            marginLeft,
            marginRight,
            marginTop,
        };

        const chartColorConfig = {
            backgroundColor,
            borderColor,
            colorPalette,
            gridColor,
            labelColor,
            legendTextColor,
            tooltipBackgroundColor,
            tooltipTextColor,
            tooltipSeparatorColor,
            tooltipBorderColor,
        };

        const chartTypographyConfig = {
            label,
            labelAnchor,
            labelEnabled,
            labelFontFamily,
            labelFontStyle,
            labelSize,
            legendEnabled,
        };

        updateChart({
            param: {
                id: chartId,
            },
            json: {
                bar_chart: {
                    xAxisField: xAxisField,
                    yAxisField: yAxisField,
                    xAxisSortOrder: xAxisSortOrder,
                    yAxisSortOrder: yAxisSortOrder,
                    omitZeroValuesEnabled: omitZeroValuesEnabled,
                    cumulativeEnabled: cumulativeEnabled,
                    filters: filters,
                    specificConfig: {
                        yAxisEnabled,
                        xAxisEnabled,
                        barBorderRadius,
                        barWidth,
                        barGap,
                        fillOpacity,
                        strokeWidth,
                        stacked,
                        borderRadiusBetweenBars,
                    },
                },
                chart_box_model: chartBoxModelConfig,
                chart_visual: chartVisualConfig,
                chart_colors: chartColorConfig,
                chart_typography: chartTypographyConfig,
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

    const { width } = useWindowSize();
    const isBigScreen = width >= 1280;

    // Local states
    const [xAxis, setXAxis] = useState(xAxisField);
    const [yAxis, setYAxis] = useState(yAxisField);
    const [sortX, setSortX] = useState(xAxisSortOrder);
    const [sortY, setSortY] = useState(yAxisSortOrder);
    const [omitZeroValues, setOmitZeroValues] = useState(omitZeroValuesEnabled);
    const [cumulative, setCumulative] = useState(cumulativeEnabled);
    const [localFilters, setLocalFilters] = useState<ChartFilter[]>(filters);

    const addFilter = (filter: ChartFilter) => {
        setLocalFilters((prevFilters) => [...prevFilters, filter]);
    };

    const removeFilter = (index: number) => {
        setLocalFilters((prevFilters) =>
            prevFilters.filter((_, filterIndex) => filterIndex !== index)
        );
    };

    const clearFilters = () => {
        setLocalFilters([]);
    };

    const setFilterColumn = (value: string, index: number) => {
        setLocalFilters((prevFilters) => {
            const newFilters = [...prevFilters];
            newFilters[index].column = value;
            return newFilters;
        });
    };

    const setFilterOperation = (value: string, index: number) => {
        setLocalFilters((prevFilters) => {
            const newFilters = [...prevFilters];
            newFilters[index].operation = value;
            return newFilters;
        });
    };

    const setFilterValue = (value: string, index: number) => {
        setLocalFilters((prevFilters) => {
            const newFilters = [...prevFilters];
            newFilters[index].value = value;
            return newFilters;
        });
    };

    const onApply = () => {
        setXAxisField(xAxis);
        setYAxisField(yAxis);
        setXAxisSortOrder(sortX);
        setYAxisSortOrder(sortY);
        setFilters(localFilters);
        setCumulativeEnabled(cumulative);
        setOmitZeroValuesEnabled(omitZeroValues);
    };

    const {
        columns,
        isLoading: columnsLoading,
        error,
    } = useChartColumns({
        chartId: chartId,
        userId: userId || "",
    });

    if (columnsLoading) {
        return (
            <div className="mx-auto py-8">
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

    if (!columns || error) {
        return (
            <div className="mx-auto py-8">
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

    return (
        <div className="py-8">
            <div className="mb-6 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
                <h1 className="text-2xl font-bold">Bar Chart Configuration</h1>
                <div className="flex items-center gap-2">
                    <CopyButton
                        textToCopy={
                            envClient.NEXT_PUBLIC_APP_URL +
                            path +
                            "/view?user_id=" +
                            userId
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

            <div className="grid gap-6 xl:grid-cols-[450px_1fr]">
                {/* Appearance Section */}
                <Card className="border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-medium">
                            Appearance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isBigScreen ? (
                            <ScrollArea className="h-[850px]">
                                <BarConfigTabs />
                            </ScrollArea>
                        ) : (
                            <BarConfigTabs />
                        )}
                    </CardContent>
                </Card>

                {/* Data Section */}
                <DataSection
                    xAxis={xAxis}
                    setXAxis={setXAxis}
                    yAxis={yAxis}
                    setYAxis={setYAxis}
                    sortX={sortX}
                    setSortX={setSortX}
                    sortY={sortY}
                    setSortY={setSortY}
                    omitZeroValuesEnabled={omitZeroValues}
                    setOmitZeroValuesEnabled={setOmitZeroValues}
                    cumulativeEnabled={cumulative}
                    setCumulativeEnabled={setCumulative}
                    filters={localFilters}
                    setFilterColumn={setFilterColumn}
                    setFilterOperation={setFilterOperation}
                    setFilterValue={setFilterValue}
                    removeFilter={removeFilter}
                    clearFilters={clearFilters}
                    onApply={onApply}
                    XAxisColumns={columns}
                    YAxisColumns={columns}
                    addFilter={addFilter}
                />
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

function BarConfigTabs() {
    return (
        <Tabs defaultValue="colors" className="w-full">
            <TabsList className="sticky top-0 z-10 grid w-full grid-cols-3 rounded-none bg-background">
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
            <div className="p-4">
                <TabsContent className="mt-0" value="colors">
                    <ColorsConfig />
                </TabsContent>
                <TabsContent className="mt-0" value="ui-features">
                    <UIConfig>
                        <BarChartStyleConfig />
                    </UIConfig>
                </TabsContent>
                <TabsContent value="grid-layout" className="mt-0">
                    <GridAndBoxModelConfig />
                </TabsContent>
            </div>
        </Tabs>
    );
}
