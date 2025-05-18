"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useAreaChartStore } from "@/modules/Area/store";
import { getRGBAString } from "@/utils/colors";
import {
    ChartViewComponent,
    GRID_ORIENTATION_BOTH,
    GRID_ORIENTATION_HORIZONTAL,
    GRID_ORIENTATION_NONE,
    GRID_ORIENTATION_VERTICAL,
} from "@/constants";
import { ChartViewWrapper } from "@/modules/ChartMetaData/components/ChartViewWrapperComponent";
import { WavyLoader } from "@/components/ui/Loader";
import { useGetProcessData } from "@/modules/notion/api/client/useGetProcessData";

export const AreaChartView: ChartViewComponent = ({
    chartName,
    notionTableId,
    userId,
}) => {
    const LIMIT = 8;

    const {
        x_axis_field,

        y_axis_field,
        color_palette,
        legend_enabled,
        grid_orientation,
        tooltip_enabled,
        grid_color,
        text_color,
        background_color,
        label_enabled,
        x_sort_order,
        y_sort_order,
        cumulative_enabled,
    } = useAreaChartStore((state) => state);

    const { data, config, isLoading, error, schema } = useGetProcessData({
        notionTableId,
        userId,
        x_axis: x_axis_field,
        y_axis: y_axis_field,
        sort_x: x_sort_order,
        sort_y: y_sort_order,
    });

    const limitedRadarChartData = useMemo(() => {
        return data.length > LIMIT ? data.slice(0, LIMIT) : data;
    }, [data]);

    // Loading state
    if (isLoading) {
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

    // Error state
    if (error || !data) {
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

    // No axis selected state
    if (!x_axis_field || !y_axis_field) {
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

    for (let idx = 0; idx < config.length; idx++) {
        const data_label = config[idx];
        configData[data_label] = {
            label:
                data_label[0].toUpperCase() + data_label.slice(1).toLowerCase(),
            color: color_palette[idx]
                ? `rgb(${color_palette[idx].r}, ${color_palette[idx].g}, ${color_palette[idx].b})`
                : "rgb(255, 255, 255)",
            alpha: color_palette[idx]
                ? color_palette[idx].a
                : Math.min(1 / config.length, 0.5),
        };
    }

    return (
        <ChartViewWrapper bgColor={background_color}>
            <ChartContainer
                config={configData}
                className="mx-auto h-full w-full min-w-0"
            >
                <AreaChart
                    accessibilityLayer
                    data={limitedRadarChartData}
                    margin={{ top: 40, right: 0, left: 0, bottom: 100 }}
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

                    {legend_enabled && (
                        <ChartLegend content={<ChartLegendContent />} />
                    )}

                    {grid_orientation !== GRID_ORIENTATION_NONE && (
                        <CartesianGrid
                            vertical={
                                grid_orientation ===
                                    GRID_ORIENTATION_VERTICAL ||
                                grid_orientation === GRID_ORIENTATION_BOTH
                            }
                            horizontal={
                                grid_orientation ===
                                    GRID_ORIENTATION_HORIZONTAL ||
                                grid_orientation === GRID_ORIENTATION_BOTH
                            }
                            stroke={`rgba(${grid_color.r}, ${grid_color.g}, ${grid_color.b}, ${grid_color.a})`}
                            strokeDasharray="3 3"
                        />
                    )}

                    <XAxis
                        dataKey="class"
                        axisLine={false}
                        padding={{ left: 20, right: 20 }}
                        tickMargin={10}
                        tickFormatter={(value) => value}
                        stroke={getRGBAString(text_color)}
                    />
                    <YAxis tickMargin={10} axisLine={false} />

                    {tooltip_enabled && (
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                    )}

                    <defs>
                        {config.map((data_label, idx) => (
                            <linearGradient
                                key={idx}
                                id={`fill${data_label.replace(/\s+/g, "")}`}
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

                    {config.map((data_label) => (
                        <Area
                            key={data_label}
                            dataKey={data_label}
                            type="monotone"
                            fill={`url(#fill${data_label.replace(/\s+/g, "")})`}
                            fillOpacity={0.4}
                            stroke={configData[data_label].color}
                            strokeWidth={2}
                            stackId={cumulative_enabled ? "1" : undefined}
                        />
                    ))}
                </AreaChart>
            </ChartContainer>
        </ChartViewWrapper>
    );
};
