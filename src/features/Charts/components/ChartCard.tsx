"use client";

import {
    Area,
    AreaChart,
    Bar,
    Radar,
    BarChart,
    CartesianGrid,
    PolarGrid,
    RadarChart,
    RadialBarChart,
    RadialBar,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";

import {
    AreaChartConfig,
    AreaChartData,
    BarChartConfig,
    BarChartData,
    DonutChartConfig,
    DonutChartData,
    RadarChartConfig,
    RadarChartData,
} from "./data";

const AreaChartCardHeader = () => {
    return (
        <ChartContainer config={AreaChartConfig} className="min-h-[270px]">
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
                />
                <Area
                    dataKey="desktop"
                    type="natural"
                    fill="url(#fillDesktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    );
};

const BarChartCardHeader = () => {
    return (
        <ChartContainer config={BarChartConfig} className="min-h-[270px]">
            <BarChart accessibilityLayer data={BarChartData}>
                <CartesianGrid vertical={false} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
            </BarChart>
        </ChartContainer>
    );
};

const RadarChartCardHeader = () => {
    return (
        <ChartContainer
            config={RadarChartConfig}
            className="mx-auto aspect-square min-h-[270px]"
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

const DonutChartCardHeader = () => {
    return (
        <ChartContainer
            config={DonutChartConfig}
            className="mx-auto aspect-square min-h-[270px]"
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

export function ChartCard({
    type,
}: {
    type: "Area" | "Bar" | "Donut" | "Radar" | "Heatmap";
}) {
    const ChartType = {
        Area: AreaChartCardHeader,
        Bar: BarChartCardHeader,
        Donut: DonutChartCardHeader,
        Radar: RadarChartCardHeader,
        Heatmap: AreaChartCardHeader,
    }[type];

    return (
        <Card>
            <CardHeader className="p-0">
                <ChartType />
            </CardHeader>
            <CardContent className="pt-10">
                <h1 className="text-2xl text-primary">Database Name</h1>
                <span className="text-[#686868]">{type} chart</span>
            </CardContent>
        </Card>
    );
}
