"use client";

import { useMemo } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

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
import { getRGBAString } from "@/utils/colors";
import type { ChartViewComponentType } from "@/constants";
import { ChartViewWrapper } from "@/modules/BasicChart/components/ChartViewWrapperComponent";
import { WavyLoader } from "@/components/ui/Loader";

export const RadarChartView: ChartViewComponentType = ({
    chartName,
    notion_table_id,
}) => {
    const LIMIT = 8;

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

    const limitedRadarChartData = useMemo(() => {
        return radarChartData.length > LIMIT
            ? radarChartData.slice(0, LIMIT)
            : radarChartData;
    }, [radarChartData]);

    // Loading state
    if (schemaLoading || dataLoading) {
        return (
            <ChartViewWrapper
                bgColor={background_color}
                className="flex items-center justify-center"
            >
                <div className="flex flex-col items-center gap-4">
                    <WavyLoader />
                    <p className="text-sm text-muted-foreground">
                        Loading chart data...
                    </p>
                </div>
            </ChartViewWrapper>
        );
    }

    // No schema state
    if (!schema) {
        return (
            <ChartViewWrapper
                bgColor={background_color}
                className="flex items-center justify-center"
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="rounded-full bg-muted p-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6 text-muted-foreground"
                        >
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M3 9h18" />
                            <path d="M9 21V9" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold">No Data Available</h3>
                    <p className="max-w-[250px] text-sm text-muted-foreground">
                        No schema data found. Please connect a valid database.
                    </p>
                </div>
            </ChartViewWrapper>
        );
    }

    // Error state
    if (error || !schema || !tableData) {
        return (
            <ChartViewWrapper
                bgColor={background_color}
                className="flex items-center justify-center"
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="rounded-full bg-destructive/10 p-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6 text-destructive"
                        >
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold">
                        Failed to load chart data
                    </h3>
                    <p className="max-w-[250px] text-sm text-muted-foreground">
                        There was an error loading the chart data. Please try
                        again later.
                    </p>
                </div>
            </ChartViewWrapper>
        );
    }

    // No axis selected state
    if (!x_axis || !y_axis) {
        return (
            <ChartViewWrapper
                bgColor={background_color}
                className="flex items-center justify-center"
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="rounded-full bg-muted p-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6 text-muted-foreground"
                        >
                            <path d="M3 3v18h18" />
                            <path d="m19 9-5 5-4-4-3 3" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold">
                        Chart Configuration Required
                    </h3>
                    <p className="max-w-[250px] text-sm text-muted-foreground">
                        Please select both X and Y axis values to display the
                        chart.
                    </p>
                </div>
            </ChartViewWrapper>
        );
    }

    // Prepare chart configuration data
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
        <ChartViewWrapper bgColor={background_color}>
            <ChartContainer
                config={configData}
                className="mx-auto h-full w-full min-w-0"
            >
                <RadarChart
                    data={limitedRadarChartData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                    {label_enabled && (
                        <text
                            x="50%"
                            y={30}
                            style={{
                                fontSize: "1.25rem",
                                fontWeight: "bold",
                                fill: getRGBAString(text_color),
                                textAnchor: "middle",
                            }}
                        >
                            {chartName}
                        </text>
                    )}

                    {tooltip_enabled && (
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                    )}

                    <PolarAngleAxis
                        dataKey="class"
                        stroke={getRGBAString(text_color)}
                    />

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
                            strokeWidth={2}
                            stroke={configData[data_label].color}
                        />
                    ))}

                    {legend_enabled && (
                        <ChartLegend content={<ChartLegendContent />} />
                    )}
                </RadarChart>
            </ChartContainer>
        </ChartViewWrapper>
    );
};
