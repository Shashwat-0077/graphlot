"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useChartConfigStore } from "@/components/providers/ChartConfigStoreProvider";
import { getRadarChartData } from "@/utils/chartDataConversion/Radar";

import { useGetDatabaseSchema } from "../../../notion/api/useGetDatabaseSchema";

export const RadarChartView = () => {
    // TODO : make that the data in the config View stays for 30 mins (stale time) but the data in the chart view should be live

    const {
        colors,
        showLegends,
        showGrid,
        showToolTip,
        gridColor,
        XAxis,
        YAxis,
    } = useChartConfigStore((state) => state);

    const { data: schema, isLoading } = useGetDatabaseSchema(""); // TODO : pass the id of the database

    if (isLoading) {
        return <div>Loading...</div>; // TODO : improve Text and design
    }

    if (!schema) {
        return <div>No Data</div>; // TODO : improve Text and design
    }

    if (!XAxis || !YAxis) {
        return <div>Select X and Y Axis</div>; // TODO : improve Text and design
    }
    const data = {}; // TODO : get data from the database
    const { configData, RadarChartData } = getRadarChartData(
        data,
        schema,
        XAxis,
        YAxis
    );

    // TODO : Show disclaimer message to user if the data is more than 8 and say that only 8 data will be shown for bigger datasets to avoid clutter, and provider link to the full dataset chart their, it will be on different page
    if (RadarChartData.length > 8) {
        RadarChartData.splice(8);
    }

    let colorIndex = 0;
    const RadarChartConfig: {
        [key: string]: { label: string; color: string; alpha: number };
    } = {};

    for (const data_label of configData) {
        RadarChartConfig[data_label] = {
            label: data_label,
            color: colors[colorIndex]
                ? `rgb(${colors[colorIndex].r}, ${colors[colorIndex].g}, ${colors[colorIndex].b}`
                : "rgb(255, 255, 255)",
            alpha: colors[colorIndex]
                ? colors[colorIndex].a
                : Math.min(1 / configData.length, 0.5),
        };
        colorIndex++;
    }

    return (
        <ChartContainer
            config={RadarChartConfig}
            // TODO : make size responsive
            className="mx-auto min-h-[270px]"
        >
            <RadarChart
                data={RadarChartData}
                margin={{
                    top: -40,
                    bottom: -10,
                }}
            >
                {showToolTip && (
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                )}
                <PolarAngleAxis dataKey="class" />
                {showGrid && (
                    <PolarGrid
                        stroke={`rgba(${gridColor.r}, ${gridColor.g}, ${gridColor.b}, ${gridColor.a})`}
                        fill={`rgba(${gridColor.r}, ${gridColor.g}, ${gridColor.b}, ${gridColor.a})`}
                    />
                )}

                {configData.map((data_label) => (
                    <Radar
                        key={data_label}
                        dataKey={data_label}
                        fill={RadarChartConfig[data_label].color}
                        fillOpacity={RadarChartConfig[data_label].alpha}
                        dot={{
                            r: 4,
                            fillOpacity: 1,
                        }}
                    />
                ))}

                {showLegends ? (
                    <ChartLegend
                        className="mt-8"
                        content={<ChartLegendContent />}
                    />
                ) : (
                    ""
                )}
            </RadarChart>
        </ChartContainer>
    );
};
