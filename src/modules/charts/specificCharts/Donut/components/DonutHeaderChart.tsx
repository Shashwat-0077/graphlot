"use client";

import { RadialBar, RadialBarChart } from "recharts";

import { cn } from "@/lib/utils";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const DonutChartConfig = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "hsl(var(--chart-1))",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
    firefox: {
        label: "Firefox",
        color: "hsl(var(--chart-3))",
    },
    edge: {
        label: "Edge",
        color: "hsl(var(--chart-4))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig;

const DonutChartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

export const DonutChartCardHeader = ({ className }: { className?: string }) => {
    return (
        <ChartContainer
            config={DonutChartConfig}
            className={cn("mx-auto aspect-square h-[270px]", className)}
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
