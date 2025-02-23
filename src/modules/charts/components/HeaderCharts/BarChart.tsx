"use client";

import { Bar, BarChart, CartesianGrid } from "recharts";

import { cn } from "@/lib/utils";
import { ChartContainer } from "@/components/ui/chart";

import { BarChartConfig } from "./config/chartConfig";
import { BarChartData } from "./config/data";

export const BarChartCardHeader = ({ className }: { className?: string }) => {
    return (
        <ChartContainer
            config={BarChartConfig}
            className={cn("min-h-[270px]", className)}
        >
            <BarChart accessibilityLayer data={BarChartData}>
                <CartesianGrid vertical={false} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
            </BarChart>
        </ChartContainer>
    );
};
