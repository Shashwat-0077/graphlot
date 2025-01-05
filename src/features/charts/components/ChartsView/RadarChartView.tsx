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
import { data } from "@/coverage/data";

export const RadarChartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
];
const configData: string[] = ["desktop", "mobile"];

export const RadarChartView = () => {
    // TODO : make that the data in the config View stays for 30 mins (stale time) but the data in the chart view should be live

    const { colors, showLegends, showGrid, showToolTip, gridColor } =
        useChartConfigStore((state) => state);

    let colorIndex = 0;
    const RadarChartConfig: {
        [key: string]: { label: string; color: string };
    } = {};

    for (const data_label of configData) {
        RadarChartConfig[data_label] = {
            label: data_label,
            color: colors[colorIndex]
                ? `rgba(${colors[colorIndex].r}, ${colors[colorIndex].g}, ${colors[colorIndex].b}, ${colors[colorIndex].a})`
                : "rgba(255, 255, 255, 0.5)",
        };
        colorIndex++;
    }

    console.log(data);

    return (
        <ChartContainer
            config={RadarChartConfig}
            className="mx-auto aspect-square min-h-[270px]"
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
                <PolarAngleAxis dataKey="month" />
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
