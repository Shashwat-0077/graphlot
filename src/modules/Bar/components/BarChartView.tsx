"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetDatabaseSchema } from "@/modules/notion/api/client/useGetDatabaseSchema";
import { useGetTableData } from "@/modules/notion/api/client/useGetTableData";
import { useBarChartStore } from "@/modules/Bar/store";
import { ChartViewWrapperComponent } from "@/modules/BasicChart/components/ChartViewWrapperComponent";
import { processChartData } from "@/utils/processChartData";
import { ChartViewComponentType } from "@/constants";
import { WavyLoader } from "@/components/ui/Loader";

export const BarChartView: ChartViewComponentType = ({
    chartName,
    notion_table_id,
}) => {
    // NOTE : Their are some problems with names, we need to fix it
    // TODO : fix names

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
        bar_size,
        bar_gap,
    } = useBarChartStore((state) => state);

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
                <WavyLoader />
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
                ? `rgb(${color_palette[idx].r}, ${color_palette[idx].g}, ${color_palette[idx].b}`
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
                <BarChart
                    accessibilityLayer
                    data={limitedRadarChartData}
                    width={100}
                    maxBarSize={70}
                    barSize={bar_size}
                    barGap={bar_gap}
                >
                    {grid_type !== "NONE" && (
                        <CartesianGrid
                            vertical={
                                grid_type === "BOTH" || grid_type === "VERTICAL"
                            }
                            horizontal={
                                grid_type === "BOTH" ||
                                grid_type === "HORIZONTAL"
                            }
                            stroke={`rgba(${grid_color.r}, ${grid_color.g}, ${grid_color.b}, ${grid_color.a})`}
                        />
                    )}
                    {legend_enabled && (
                        <ChartLegend content={<ChartLegendContent />} />
                    )}
                    <XAxis dataKey="class" tickMargin={10} axisLine={false} />
                    {tooltip_enabled && (
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                    )}

                    {radarChartConfig.map((data_label) => (
                        <Bar
                            key={data_label}
                            dataKey={data_label}
                            fill={configData[data_label].color}
                            fillOpacity={configData[data_label].alpha}
                            stroke={configData[data_label].color}
                            strokeWidth={0.2}
                            radius={10}
                        />
                    ))}
                </BarChart>
            </ChartContainer>
        </ChartViewWrapperComponent>
    );
};
