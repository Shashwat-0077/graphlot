"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
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
import { useRadarChartStore } from "@/modules/Radar/store";
import { processChartData } from "@/utils/processChartData";
import { ChartViewWrapperComponent } from "@/modules/BasicChart/components/ChartViewWrapperComponent";
import { ChartViewComponentType } from "@/constants";

export const RadarChartView: ChartViewComponentType = ({
    chartName,
    notion_table_id,
}) => {
    const LIMIT = 8;

    // TODO : make that the data in the config View stays for 30 mins (stale time) but the data in the chart view should be live

    const {
        color_palette,
        legend_enabled,
        grid_enabled,
        tooltip_enabled,
        grid_color,
        text_color,
        label_enabled,
        background_color,
        x_axis,
        y_axis,
    } = useRadarChartStore((state) => state);

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

    // TODO : Show disclaimer message to user if the data is more than 8 and say that only 8 data will be shown for bigger datasets to avoid clutter, and provider link to the full dataset chart their, it will be on different page
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
                // TODO : make size responsive
                className="mx-auto min-h-[270px] break1200:min-h-[500px]"
            >
                <RadarChart
                    data={limitedRadarChartData}
                    margin={{
                        top: -40,
                        bottom: -10,
                    }}
                >
                    {tooltip_enabled && (
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                    )}
                    <PolarAngleAxis dataKey="class" />
                    {grid_enabled && (
                        <PolarGrid
                            stroke={`rgba(${grid_color.r}, ${grid_color.g}, ${grid_color.b}, ${grid_color.a})`}
                            fill={`rgba(${grid_color.r}, ${grid_color.g}, ${grid_color.b}, ${grid_color.a})`}
                        />
                    )}

                    {radarChartConfig.map((data_label) => (
                        <Radar
                            key={data_label}
                            dataKey={data_label}
                            fill={configData[data_label].color}
                            fillOpacity={configData[data_label].alpha}
                            dot={{
                                r: 4,
                                fillOpacity: 1,
                            }}
                            strokeWidth={0.2}
                            stroke={configData[data_label].color}
                        />
                    ))}

                    {legend_enabled ? (
                        <ChartLegend
                            className="mt-8"
                            content={<ChartLegendContent />}
                        />
                    ) : (
                        ""
                    )}
                </RadarChart>
            </ChartContainer>
        </ChartViewWrapperComponent>
    );
};
