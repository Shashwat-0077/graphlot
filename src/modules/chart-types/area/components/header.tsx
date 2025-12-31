"use client";

import { Area, AreaChart, CartesianGrid } from "recharts";

import { cn } from "@/utils";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const AreaChartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

const AreaChartData = [
    { month: "January", desktop: 220, mobile: 95 },
    { month: "February", desktop: 180, mobile: 160 },
    { month: "March", desktop: 290, mobile: 140 },
    { month: "April", desktop: 150, mobile: 210 },
    { month: "May", desktop: 140, mobile: 180 },
    { month: "June", desktop: 280, mobile: 190 },
];

export const AreaChartCardHeader = ({ className }: { className?: string }) => {
    return (
        <ChartContainer
            config={AreaChartConfig}
            className={cn("h-67.5", className)}
        >
            <AreaChart
                accessibilityLayer
                data={AreaChartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />

                <defs>
                    <linearGradient
                        id="fillDesktop"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="5%"
                            stopColor="var(--color-desktop)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--color-desktop)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                    <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="var(--color-mobile)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--color-mobile)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="mobile"
                    type="natural"
                    fill="url(#fillMobile)"
                    fillOpacity={0.4}
                    stroke="var(--color-mobile)"
                    stackId="a"
                    dot={{
                        r: 4,
                        strokeWidth: 2,
                        stroke: "var(--color-mobile)",
                    }}
                />
                <Area
                    dataKey="desktop"
                    type="natural"
                    fill="url(#fillDesktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                    dot={{
                        r: 4,
                        strokeWidth: 2,
                        stroke: "var(--color-desktop)",
                    }}
                />
            </AreaChart>
        </ChartContainer>
    );
};
