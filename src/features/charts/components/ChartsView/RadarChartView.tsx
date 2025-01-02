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

export const RadarChartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
];
// const configData: string[] = ["desktop", "mobile"];

export const RadarChartView = () => {
    const { colors, showLegends, YAxis } = useChartConfigStore(
        (state) => state
    );

    const selectedData = YAxis.filter((data) => data.active);

    const configData =
        selectedData.length > 0
            ? selectedData.map((data) => data.name)
            : // HACK : This is a hack to make the radar chart work
              ["desktop", "mobile"];

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
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                />
                <PolarAngleAxis dataKey="month" />
                <PolarGrid />

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
