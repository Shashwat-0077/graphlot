"use client";

import { PolarGrid, Radar, RadarChart } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/utils";

const RadarChartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-2)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig;

const RadarChartData = [
    { month: "January", desktop: 140, mobile: 190 },
    { month: "February", desktop: 260, mobile: 185 },
    { month: "March", desktop: 220, mobile: 160 },
    { month: "April", desktop: 180, mobile: 230 },
    { month: "May", desktop: 260, mobile: 200 },
    { month: "June", desktop: 290, mobile: 200 },
];

export const RadarChartCardHeader = ({ className }: { className?: string }) => {
    return (
        <ChartContainer
            config={RadarChartConfig}
            className={cn("mx-auto aspect-square h-[270px]", className)}
        >
            <RadarChart
                data={RadarChartData}
                margin={{
                    top: -40,
                    bottom: -10,
                }}
            >
                <PolarGrid />
                <Radar
                    dataKey="desktop"
                    fill="var(--color-desktop)"
                    fillOpacity={0.5}
                    dot={{
                        r: 4,
                        fillOpacity: 1,
                        strokeWidth: 2,
                        stroke: "var(--color-desktop)",
                    }}
                />
                <Radar
                    dataKey="mobile"
                    fill="var(--color-mobile)"
                    fillOpacity={0.5}
                    dot={{
                        r: 4,
                        fillOpacity: 1,
                        strokeWidth: 2,
                        stroke: "var(--color-mobile)",
                    }}
                />
            </RadarChart>
        </ChartContainer>
    );
};
