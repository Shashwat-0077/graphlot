"use client";

import { PolarGrid, Radar, RadarChart } from "recharts";

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

import { RadarChartConfig } from "./config/chartConfig";
import { RadarChartData } from "./config/data";

export const RadarChartCardHeader = ({ className }: { className?: string }) => {
    return (
        <ChartContainer
            config={RadarChartConfig}
            className={cn("mx-auto aspect-square min-h-[270px]", className)}
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
