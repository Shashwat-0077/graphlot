"use client";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useMemo } from "react";

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetDatabaseSchema } from "@/modules/notion/api/client/useGetDatabaseSchema";
import { useGetTableData } from "@/modules/notion/api/client/useGetTableData";
import { ChartViewComponentType } from "@/modules/charts/types";
import { getRadarChartData } from "@/modules/charts/utils/RadarChartDataConversion";
import { ChartViewWrapperComponent } from "@/modules/charts/components/ChartViewWrapperComponent";
import {
    useAreaChartAppearanceStore,
    useAreaChartConfigStore,
} from "@/modules/charts/specificCharts/Area/state/provider/area-chart-store-provider";

export const AreaChartView: ChartViewComponentType = ({
    chartName,
    notion_table_id,
}) => {
    const LIMIT = 8;

    const {
        colors,
        showLegends,
        showGrid,
        showToolTip,
        gridColor,
        labelColor,
        showLabel,
        bgColor,
    } = useAreaChartAppearanceStore((state) => state);

    const { xAxis, yAxis } = useAreaChartConfigStore((state) => state);

    const { data: schema, isLoading: schemaLoading } =
        useGetDatabaseSchema(notion_table_id);
    const {
        data: tableData,
        error,
        isLoading: dataLoading,
    } = useGetTableData(notion_table_id);

    const { radarChartConfig, radarChartData } = useMemo(() => {
        if (!schema || !tableData?.data || !xAxis || !yAxis) {
            return { radarChartConfig: [], radarChartData: [] };
        }
        return getRadarChartData(tableData.data, schema, xAxis, yAxis);
    }, [schema, tableData, xAxis, yAxis]);

    const limitedRadarChartData = useMemo(() => {
        return radarChartData.length > LIMIT
            ? radarChartData.slice(0, LIMIT)
            : radarChartData;
    }, [radarChartData]);

    if (schemaLoading || dataLoading) {
        return (
            <ChartViewWrapperComponent
                bgColor={bgColor}
                labelColor={labelColor}
                showLabel={showLabel}
                label={chartName}
            >
                Loading...
            </ChartViewWrapperComponent>
        ); // TODO : improve Text and design
    }

    if (error || !schema || !tableData) {
        return (
            <ChartViewWrapperComponent
                bgColor={bgColor}
                labelColor={labelColor}
                showLabel={showLabel}
                label={chartName}
            >
                Error
            </ChartViewWrapperComponent>
        ); // TODO : improve Text and design
    }

    if (!schema) {
        return (
            <ChartViewWrapperComponent
                bgColor={bgColor}
                labelColor={labelColor}
                showLabel={showLabel}
                label={chartName}
            >
                No Data
            </ChartViewWrapperComponent>
        ); // TODO : improve Text and design
    }

    if (!xAxis || !yAxis) {
        return (
            <ChartViewWrapperComponent
                bgColor={bgColor}
                labelColor={labelColor}
                showLabel={showLabel}
                label={chartName}
            >
                Select X and Y Axis
            </ChartViewWrapperComponent>
        ); // TODO : improve Text and design
    }

    const configData: {
        [key: string]: { label: string; color: string; alpha: number };
    } = {};

    for (let idx = 0; idx < radarChartConfig.length; idx++) {
        const data_label = radarChartConfig[idx];
        configData[data_label] = {
            label:
                data_label[0].toUpperCase() + data_label.slice(1).toLowerCase(),
            color: colors[idx]
                ? `rgb(${colors[idx].r}, ${colors[idx].g}, ${colors[idx].b}`
                : "rgb(255, 255, 255)",
            alpha: colors[idx]
                ? colors[idx].a
                : Math.min(1 / radarChartConfig.length, 0.5),
        };
    }

    return (
        <ChartViewWrapperComponent
            bgColor={bgColor}
            labelColor={labelColor}
            showLabel={showLabel}
            label={chartName}
        >
            <ChartContainer
                config={configData}
                className="mx-auto max-h-[500px] min-h-[270px] w-full break1200:min-h-[500px]"
            >
                <AreaChart accessibilityLayer data={limitedRadarChartData}>
                    {showLegends && (
                        <ChartLegend content={<ChartLegendContent />} />
                    )}

                    {showGrid && (
                        <CartesianGrid
                            vertical={false}
                            stroke={`rgba(${gridColor.r}, ${gridColor.g}, ${gridColor.b}, ${gridColor.a})`}
                        />
                    )}

                    <XAxis
                        dataKey="class"
                        axisLine={false}
                        padding={{ left: 20, right: 20 }} // this can be used to adjust the padding of th whole chart
                        tickMargin={10}
                        tickFormatter={(value) => value}
                    />

                    {showToolTip && (
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                    )}

                    <defs>
                        {radarChartConfig.map((data_label, idx) => (
                            <linearGradient
                                key={idx}
                                id={`fill${data_label.replace(" ", "")}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor={configData[data_label].color}
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        ))}
                    </defs>

                    {radarChartConfig.map((data_label) => (
                        <Area
                            key={data_label}
                            dataKey={data_label}
                            type="natural" // natural , step , linear
                            fill={`url(#fill${data_label.replace(" ", "")})`}
                            fillOpacity={0.4}
                            stroke={configData[data_label].color}
                            stackId="a"
                        />
                    ))}
                </AreaChart>
            </ChartContainer>
        </ChartViewWrapperComponent>
    );
};
