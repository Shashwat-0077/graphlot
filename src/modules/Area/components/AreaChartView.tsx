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
import { ChartViewWrapperComponent } from "@/modules/BasicChart/components/ChartViewWrapperComponent";
import { useAreaChartStore } from "@/modules/Area/store";
import { processChartData } from "@/utils/processChartData";
import { ChartViewComponentType } from "@/constants";

export const AreaChartView: ChartViewComponentType = ({
    chartName,
    notion_table_id,
}) => {
    const LIMIT = 8;

    const {
        x_axis,
        y_axis,
        color_palette,
        legend_enabled,
        grid_type,
        tooltip_enabled,
        grid_color,
        text_color,
        background_color,
        label_enabled,
    } = useAreaChartStore((state) => state);

    const { data: schema, isLoading: schemaLoading } =
        useGetDatabaseSchema(notion_table_id);
    const {
        data: tableData,
        error,
        isLoading: dataLoading,
    } = useGetTableData(notion_table_id);

    const { radarChartConfig, radarChartData } = useMemo(() => {
        if (!schema || !tableData?.data || !x_axis || !y_axis) {
            return { radarChartConfig: [], radarChartData: [] };
        }
        return processChartData(tableData.data, schema, x_axis, y_axis);
    }, [schema, tableData, x_axis, y_axis]);

    const limitedRadarChartData = useMemo(() => {
        return radarChartData.length > LIMIT
            ? radarChartData.slice(0, LIMIT)
            : radarChartData;
    }, [radarChartData]);

    if (schemaLoading || dataLoading) {
        return (
            <ChartViewWrapperComponent
                bgColor={background_color}
                labelColor={text_color}
                showLabel={label_enabled}
                label={chartName}
            >
                Loading...
            </ChartViewWrapperComponent>
        ); // TODO : improve Text and design
    }

    if (error || !schema || !tableData) {
        return (
            <ChartViewWrapperComponent
                bgColor={background_color}
                labelColor={text_color}
                showLabel={label_enabled}
                label={chartName}
            >
                Error
            </ChartViewWrapperComponent>
        ); // TODO : improve Text and design
    }

    if (!schema) {
        return (
            <ChartViewWrapperComponent
                bgColor={background_color}
                labelColor={text_color}
                showLabel={label_enabled}
                label={chartName}
            >
                No Data
            </ChartViewWrapperComponent>
        ); // TODO : improve Text and design
    }

    if (!x_axis || !y_axis) {
        return (
            <ChartViewWrapperComponent
                bgColor={background_color}
                labelColor={text_color}
                showLabel={label_enabled}
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
            color: color_palette[idx]
                ? `rgb(${color_palette[idx].r}, ${color_palette[idx].g}, ${color_palette[idx].b})`
                : "rgb(255, 255, 255)",
            alpha: color_palette[idx]
                ? color_palette[idx].a
                : Math.min(1 / radarChartConfig.length, 0.5),
        };
    }

    return (
        <ChartViewWrapperComponent
            bgColor={background_color}
            labelColor={text_color}
            showLabel={label_enabled}
            label={chartName}
        >
            <ChartContainer
                config={configData}
                className="mx-auto max-h-[500px] min-h-[270px] w-full break1200:min-h-[500px]"
            >
                <AreaChart accessibilityLayer data={limitedRadarChartData}>
                    {legend_enabled && (
                        <ChartLegend content={<ChartLegendContent />} />
                    )}

                    {grid_type !== "NONE" && (
                        <CartesianGrid
                            vertical={
                                grid_type === "VERTICAL" || grid_type === "BOTH"
                            }
                            horizontal={
                                grid_type === "HORIZONTAL" ||
                                grid_type === "BOTH"
                            }
                            stroke={`rgba(${grid_color.r}, ${grid_color.g}, ${grid_color.b}, ${grid_color.a})`}
                        />
                    )}

                    <XAxis
                        dataKey="class"
                        axisLine={false}
                        padding={{ left: 20, right: 20 }}
                        tickMargin={10}
                        tickFormatter={(value) => value}
                    />

                    {tooltip_enabled && (
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
                            type="natural"
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
