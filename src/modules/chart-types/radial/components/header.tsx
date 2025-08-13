"use client";

import { RadialBar, RadialBarChart } from "recharts";

import { cn } from "@/utils";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const DonutChartConfig = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "var(--chart-4)",
    },
    safari: {
        label: "Safari",
        color: "var(--chart-2)",
    },
    firefox: {
        label: "Firefox",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig;

const DonutChartData = [
    { browser: "chrome", visitors: 320, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 280, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 150, fill: "var(--color-firefox)" },
];

export const RadialChartCardHeader = ({
    className,
}: {
    className?: string;
}) => {
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
