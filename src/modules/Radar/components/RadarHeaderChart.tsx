"use client";

import { PolarGrid, Radar, RadarChart } from "recharts";

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const RadarChartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

const RadarChartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
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
                    fillOpacity={0.6}
                />
                <Radar dataKey="mobile" fill="var(--color-mobile)" />
                <ChartLegend
                    className="mt-8"
                    content={<ChartLegendContent />}
                />
            </RadarChart>
        </ChartContainer>
    );
};
