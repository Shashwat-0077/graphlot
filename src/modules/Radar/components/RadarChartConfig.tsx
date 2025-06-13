"use client";

import { useEffect, useState } from "react";
import { Save, Sliders, Palette, Layout } from "lucide-react";
import { usePathname } from "next/navigation";
import { useWindowSize } from "react-use";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { ChartConfigComponent, ChartFilter } from "@/constants";
import { useRadarChartStore } from "@/modules/Radar/store";
import { toast } from "@/hooks/use-toast";
import { useUpdateRadarChart } from "@/modules/Radar/api/client/use-update-radar-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/CopyButton";
import { envClient } from "@/lib/env/clientEnv";
import {
    useChartBoxModelStore,
    useChartColorStore,
    useChartTypographyStore,
    useChartVisualStore,
} from "@/modules/Chart/store";
import { ColorsConfig } from "@/modules/Chart/components/ColorConfig";
import { UIConfig } from "@/modules/Chart/components/UIConfig";
import { RadarChartStyleConfig } from "@/modules/Radar/components/RadarChartStyleConfig";
import { GridAndBoxModelConfig } from "@/modules/Chart/components/GridConfig";
import { DataSection } from "@/modules/Radar/components/DataSection";
import { useChartColumns } from "@/modules/Chart/api/client/use-chart";
import { ScrollArea } from "@/components/ui/scroll-area";

export const RadarChartConfig: ChartConfigComponent = ({ chartId, userId }) => {
    const path = usePathname();
    const { mutate: updateChart } = useUpdateRadarChart({
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

    // Radar chart store selectors
    const xAxisField = useRadarChartStore((state) => state.xAxisField);
    const yAxisField = useRadarChartStore((state) => state.yAxisField);
    const filters = useRadarChartStore((state) => state.filters);
    const xAxisSortOrder = useRadarChartStore((state) => state.xAxisSortOrder);
    const yAxisSortOrder = useRadarChartStore((state) => state.yAxisSortOrder);
    const omitZeroValuesEnabled = useRadarChartStore(
        (state) => state.omitZeroValuesEnabled
    );
    const cumulativeEnabled = useRadarChartStore(
        (state) => state.cumulativeEnabled
    );
    const strokeWidth = useRadarChartStore((state) => state.strokeWidth);
    const xAxisEnabled = useRadarChartStore((state) => state.xAxisEnabled);

    // Radar chart store actions
    const setXAxisField = useRadarChartStore((state) => state.setXAxisField);
    const setYAxisField = useRadarChartStore((state) => state.setYAxisField);
    const setFilters = useRadarChartStore((state) => state.setFilters);
    const setXAxisSortOrder = useRadarChartStore(
        (state) => state.setXAxisSortOrder
    );
    const setYAxisSortOrder = useRadarChartStore(
        (state) => state.setYAxisSortOrder
    );
    const setOmitZeroValuesEnabled = useRadarChartStore(
        (state) => state.setOmitZeroValuesEnabled
    );
    const setCumulativeEnabled = useRadarChartStore(
        (state) => state.setCumulativeEnabled
    );

    // Create config objects for the API call
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
                radar_chart: {
                    xAxisField: xAxis,
                    yAxisField: yAxis,
                    xAxisSortOrder: sortX,
                    yAxisSortOrder: sortY,
                    omitZeroValuesEnabled: omitZeroValues,
                    cumulativeEnabled: cumulative,
                    filters: localFilters,
                    specificConfig: {
                        xAxisEnabled,
                        strokeWidth,
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

    // Local states for form management
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
                <h1 className="text-2xl font-bold">
                    Radar Chart Configuration
                </h1>
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
                                <RadarConfigTabs />
                            </ScrollArea>
                        ) : (
                            <RadarConfigTabs />
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

function RadarConfigTabs() {
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
                <TabsContent value="colors" className="mt-0">
                    <ColorsConfig />
                </TabsContent>
                <TabsContent value="ui-features" className="mt-0">
                    <UIConfig>
                        <RadarChartStyleConfig />
                    </UIConfig>
                </TabsContent>
                <TabsContent value="grid-layout" className="mt-0">
                    <GridAndBoxModelConfig showGridOrientationRadar />
                </TabsContent>
            </div>
        </Tabs>
    );
}
