"use client";

import { useEffect, useState } from "react";
import { Save, Sliders, Palette, Layout } from "lucide-react";
import { usePathname } from "next/navigation";
import { useWindowSize } from "react-use";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { ChartConfigComponent, ChartFilter } from "@/constants";
import { useRadialChartStore } from "@/modules/Radial/store";
import { toast } from "@/hooks/use-toast";
import { useUpdateRadialChart } from "@/modules/Radial/api/client/use-update-radial-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/CopyButton";
import { envClient } from "@/lib/env/clientEnv";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChartColumns } from "@/modules/Chart/api/client/use-chart";
import { ColorsConfig } from "@/modules/Chart/components/ColorConfig";
import { UIConfig } from "@/modules/Chart/components/UIConfig";
import { GridAndBoxModelConfig } from "@/modules/Chart/components/GridConfig";
import {
    useChartBoxModelStore,
    useChartColorStore,
    useChartTypographyStore,
} from "@/modules/Chart/store";
import { DataSection } from "@/modules/Radial/components/DataSection";
import { RadialChartStyleConfig } from "@/modules/Radial/components/RadialChartStyleConfig";

export const RadialChartConfig: ChartConfigComponent = ({
    chartId,
    userId,
}) => {
    const path = usePathname();
    const { mutate: updateChart } = useUpdateRadialChart({
        onSuccess: () => {
            toast({
                title: "Chart updated successfully",
                description: "Your changes have been saved",
            });
        },
    });

    // Chart box model store selectors
    const borderEnabled = useChartBoxModelStore((state) => state.borderEnabled);
    const borderWidth = useChartBoxModelStore((state) => state.borderWidth);
    const marginBottom = useChartBoxModelStore((state) => state.marginBottom);
    const marginLeft = useChartBoxModelStore((state) => state.marginLeft);
    const marginRight = useChartBoxModelStore((state) => state.marginRight);
    const marginTop = useChartBoxModelStore((state) => state.marginTop);

    // Chart color store selectors
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

    // Chart typography store selectors
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

    // Radial chart store selectors
    const xAxisField = useRadialChartStore((state) => state.xAxisField);
    const filters = useRadialChartStore((state) => state.filters);
    const xAxisSortOrder = useRadialChartStore((state) => state.xAxisSortOrder);
    const omitZeroValuesEnabled = useRadialChartStore(
        (state) => state.omitZeroValuesEnabled
    );
    const innerRadius = useRadialChartStore((state) => state.innerRadius);
    const outerRadius = useRadialChartStore((state) => state.outerRadius);
    const startAngle = useRadialChartStore((state) => state.startAngle);
    const endAngle = useRadialChartStore((state) => state.endAngle);
    const legendPosition = useRadialChartStore((state) => state.legendPosition);
    const legendTextSize = useRadialChartStore((state) => state.legendTextSize);

    // Store actions
    const setXAxisField = useRadialChartStore((state) => state.setXAxisField);
    const setXAxisSortOrder = useRadialChartStore(
        (state) => state.setXAxisSortOrder
    );
    const setFilters = useRadialChartStore((state) => state.setFilters);
    const setOmitZeroValuesEnabled = useRadialChartStore(
        (state) => state.setOmitZeroValuesEnabled
    );

    const handleUpdate = () => {
        toast({
            title: "Saving chart...",
            description: "Please wait while we update your chart",
        });

        const chartBoxModelConfig = {
            borderEnabled,
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
                radial_chart: {
                    xAxisField: xAxis,
                    xAxisSortOrder: sortBy,
                    omitZeroValuesEnabled: omitZeroValues,
                    filters: localFilters,
                    specificConfig: {
                        innerRadius,
                        outerRadius,
                        startAngle,
                        endAngle,
                        legendPosition,
                        legendTextSize,
                    },
                },
                chart_box_model: chartBoxModelConfig,
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
    const [sortBy, setSortBy] = useState(xAxisSortOrder);
    const [omitZeroValues, setOmitZeroValues] = useState(omitZeroValuesEnabled);
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
        setXAxisSortOrder(sortBy);
        setFilters(localFilters);
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
                        Please connect a valid database to configure your chart
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div className="mb-6 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
                <h1 className="text-2xl font-bold">
                    Radial Chart Configuration
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
                                <RadialConfigTabs />
                            </ScrollArea>
                        ) : (
                            <RadialConfigTabs />
                        )}
                    </CardContent>
                </Card>

                {/* Data Section */}
                <DataSection
                    xAxis={xAxis}
                    setXAxis={setXAxis}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    omitZeroValuesEnabled={omitZeroValues}
                    setOmitZeroValuesEnabled={setOmitZeroValues}
                    filters={localFilters}
                    setFilterColumn={setFilterColumn}
                    setFilterOperation={setFilterOperation}
                    setFilterValue={setFilterValue}
                    removeFilter={removeFilter}
                    clearFilters={clearFilters}
                    onApply={onApply}
                    columns={columns}
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

function RadialConfigTabs() {
    // Box model selectors
    const borderEnabled = useChartBoxModelStore((state) => state.borderEnabled);
    const toggleBorder = useChartBoxModelStore((state) => state.toggleBorder);
    const borderWidth = useChartBoxModelStore((state) => state.borderWidth);
    const setBorderWidth = useChartBoxModelStore(
        (state) => state.setBorderWidth
    );
    const marginBottom = useChartBoxModelStore((state) => state.marginBottom);
    const setMarginBottom = useChartBoxModelStore(
        (state) => state.setMarginBottom
    );
    const marginLeft = useChartBoxModelStore((state) => state.marginLeft);
    const setMarginLeft = useChartBoxModelStore((state) => state.setMarginLeft);
    const marginRight = useChartBoxModelStore((state) => state.marginRight);
    const setMarginRight = useChartBoxModelStore(
        (state) => state.setMarginRight
    );
    const marginTop = useChartBoxModelStore((state) => state.marginTop);
    const setMarginTop = useChartBoxModelStore((state) => state.setMarginTop);

    // Color selectors
    const backgroundColor = useChartColorStore(
        (state) => state.backgroundColor
    );
    const setBackgroundColor = useChartColorStore(
        (state) => state.setBackgroundColor
    );
    const borderColor = useChartColorStore((state) => state.borderColor);
    const setBorderColor = useChartColorStore((state) => state.setBorderColor);
    const labelColor = useChartColorStore((state) => state.labelColor);
    const setLabelColor = useChartColorStore((state) => state.setLabelColor);
    const legendTextColor = useChartColorStore(
        (state) => state.legendTextColor
    );
    const setLegendTextColor = useChartColorStore(
        (state) => state.setLegendTextColor
    );
    const colorPalette = useChartColorStore((state) => state.colorPalette);
    const setColorPalette = useChartColorStore(
        (state) => state.setColorPalette
    );
    const addColorPalette = useChartColorStore(
        (state) => state.addColorPalette
    );
    const clearColorPalette = useChartColorStore(
        (state) => state.clearColorPalette
    );
    const removeColorPalette = useChartColorStore(
        (state) => state.removeColorPalette
    );
    const updateColorPalette = useChartColorStore(
        (state) => state.updateColorPalette
    );

    // Typography selectors
    const label = useChartTypographyStore((state) => state.label);
    const setLabel = useChartTypographyStore((state) => state.setLabel);
    const labelAnchor = useChartTypographyStore((state) => state.labelAnchor);
    const setLabelAnchor = useChartTypographyStore(
        (state) => state.setLabelAnchor
    );
    const labelEnabled = useChartTypographyStore((state) => state.labelEnabled);
    const toggleLabel = useChartTypographyStore((state) => state.toggleLabel);
    const labelFontFamily = useChartTypographyStore(
        (state) => state.labelFontFamily
    );
    const setLabelFontFamily = useChartTypographyStore(
        (state) => state.setLabelFontFamily
    );
    const labelFontStyle = useChartTypographyStore(
        (state) => state.labelFontStyle
    );
    const setLabelFontStyle = useChartTypographyStore(
        (state) => state.setLabelFontStyle
    );
    const labelSize = useChartTypographyStore((state) => state.labelSize);
    const setLabelSize = useChartTypographyStore((state) => state.setLabelSize);
    const legendEnabled = useChartTypographyStore(
        (state) => state.legendEnabled
    );
    const toggleLegend = useChartTypographyStore((state) => state.toggleLegend);

    // Radial chart selectors
    const innerRadius = useRadialChartStore((state) => state.innerRadius);
    const setInnerRadius = useRadialChartStore((state) => state.setInnerRadius);
    const outerRadius = useRadialChartStore((state) => state.outerRadius);
    const setOuterRadius = useRadialChartStore((state) => state.setOuterRadius);
    const startAngle = useRadialChartStore((state) => state.startAngle);
    const setStartAngle = useRadialChartStore((state) => state.setStartAngle);
    const endAngle = useRadialChartStore((state) => state.endAngle);
    const setEndAngle = useRadialChartStore((state) => state.setEndAngle);
    const legendPosition = useRadialChartStore((state) => state.legendPosition);
    const setLegendPosition = useRadialChartStore(
        (state) => state.setLegendPosition
    );
    const legendTextSize = useRadialChartStore((state) => state.legendTextSize);
    const setLegendTextSize = useRadialChartStore(
        (state) => state.setLegendTextSize
    );

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
                    <ColorsConfig
                        backgroundColor={backgroundColor}
                        borderColor={borderColor}
                        colorPalette={colorPalette}
                        labelColor={labelColor}
                        legendTextColor={legendTextColor}
                        setBackgroundColor={setBackgroundColor}
                        setBorderColor={setBorderColor}
                        setColorPalette={setColorPalette}
                        setLabelColor={setLabelColor}
                        setLegendTextColor={setLegendTextColor}
                        addColorPalette={addColorPalette}
                        clearColorPalette={clearColorPalette}
                        removeColorPalette={removeColorPalette}
                        updateColorPalette={updateColorPalette}
                    />
                </TabsContent>
                <TabsContent value="ui-features" className="mt-0">
                    <UIConfig
                        label={label}
                        setLabel={setLabel}
                        labelAnchor={labelAnchor}
                        setLabelAnchor={setLabelAnchor}
                        labelEnabled={labelEnabled}
                        labelFontFamily={labelFontFamily}
                        setLabelFontFamily={setLabelFontFamily}
                        labelFontStyle={labelFontStyle}
                        setLabelFontStyle={setLabelFontStyle}
                        labelSize={labelSize}
                        setLabelSize={setLabelSize}
                        legendEnabled={legendEnabled}
                        toggleLabel={toggleLabel}
                        toggleLegend={toggleLegend}
                    >
                        <RadialChartStyleConfig
                            innerRadius={innerRadius}
                            setInnerRadius={setInnerRadius}
                            outerRadius={outerRadius}
                            setOuterRadius={setOuterRadius}
                            startAngle={startAngle}
                            setStartAngle={setStartAngle}
                            endAngle={endAngle}
                            setEndAngle={setEndAngle}
                            legendPosition={legendPosition}
                            setLegendPosition={setLegendPosition}
                            legendTextSize={legendTextSize}
                            setLegendTextSize={setLegendTextSize}
                        />
                    </UIConfig>
                </TabsContent>
                <TabsContent value="grid-layout" className="mt-0">
                    <GridAndBoxModelConfig
                        borderEnabled={borderEnabled}
                        borderWidth={borderWidth}
                        marginBottom={marginBottom}
                        marginLeft={marginLeft}
                        marginRight={marginRight}
                        marginTop={marginTop}
                        setBorderWidth={setBorderWidth}
                        setMarginBottom={setMarginBottom}
                        setMarginLeft={setMarginLeft}
                        setMarginRight={setMarginRight}
                        setMarginTop={setMarginTop}
                        toggleBorder={toggleBorder}
                    />
                </TabsContent>
            </div>
        </Tabs>
    );
}
