"use client";
import React from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export const RadarChartConfig = {
    desktop: {
        label: "Desktop",
        color: "rgba(0, 123, 255 , 0.5)",
    },
    mobile: {
        label: "Mobile",
        color: "rgba(40, 167, 69, 0.5)",
    },
} satisfies ChartConfig;

export const RadarChartData = [
    { month: "January", desktop: 1, mobile: 2 },
    { month: "February", desktop: 1, mobile: 2 },
    { month: "March", desktop: 1, mobile: 2 },
    { month: "April", desktop: 1, mobile: 3 },
    { month: "May", desktop: 1, mobile: 2 },
    { month: "June", desktop: 1, mobile: 2 },
];

export default function ChartView({
    _params,
}: {
    _params: {
        id: string;
        chartID: string;
    };
}) {
    return (
        <div className="grid h-svh w-svw place-content-center overflow-hidden">
            <ChartContainer
                config={RadarChartConfig}
                className="mx-auto aspect-square max-h-[350px] min-w-[350px]"
            >
                <RadarChart data={RadarChartData}>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    <PolarAngleAxis dataKey="month" />
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
        </div>
    );
}
