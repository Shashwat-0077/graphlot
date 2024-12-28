"use client";

import { Bar, BarChart, CartesianGrid } from "recharts";

import { ChartContainer } from "@/components/ui/chart";

import { BarChartConfig } from "./config/chartConfig";
import { BarChartData } from "./config/data";

export const BarChartCardHeader = () => {
    return (
        <ChartContainer config={BarChartConfig} className="min-h-[270px]">
            <BarChart accessibilityLayer data={BarChartData}>
                <CartesianGrid vertical={false} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
            </BarChart>
        </ChartContainer>
    );
};
