"use client";

import { RadialBar, RadialBarChart } from "recharts";

import { cn } from "@/lib/utils";
import { ChartContainer } from "@/components/ui/chart";

import { DonutChartConfig } from "./config/chartConfig";
import { DonutChartData } from "./config/data";

export const DonutChartCardHeader = ({ className }: { className?: string }) => {
    return (
        <ChartContainer
            config={DonutChartConfig}
            className={cn("mx-auto aspect-square min-h-[270px]", className)}
        >
            <RadialBarChart
                data={DonutChartData}
                innerRadius={40}
                outerRadius={120}
            >
                <RadialBar dataKey="visitors" background cornerRadius={10} />
            </RadialBarChart>
        </ChartContainer>
    );
};
