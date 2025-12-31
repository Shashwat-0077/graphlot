"use client";

import { Bar, BarChart, CartesianGrid } from "recharts";

import { cn } from "@/utils";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const BarChartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-5)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

const BarChartData = [
    { month: "January", desktop: 245, mobile: 120 },
    { month: "May", desktop: 290, mobile: 350 },
    { month: "February", desktop: 180, mobile: 90 },
    { month: "June", desktop: 500, mobile: 300 },
    { month: "March", desktop: 320, mobile: 200 },
    { month: "April", desktop: 165, mobile: 80 },
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
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={8} />
            </BarChart>
        </ChartContainer>
    );
};
