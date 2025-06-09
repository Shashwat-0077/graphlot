"use client";

import { Bar, BarChart, CartesianGrid } from "recharts";

import { cn } from "@/lib/utils";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const BarChartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const BarChartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
];

export const BarChartCardHeader = ({ className }: { className?: string }) => {
    return (
        <ChartContainer
            config={BarChartConfig}
            className={cn("h-[270px]", className)}
        >
            <BarChart accessibilityLayer data={BarChartData}>
                <CartesianGrid vertical={false} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
            </BarChart>
        </ChartContainer>
    );
};
