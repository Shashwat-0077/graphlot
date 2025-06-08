"use client";
import { Activity, AreaChart, BarChart, Grid, PieChart } from "lucide-react";
import { motion } from "framer-motion";

import { useChartFormStore } from "@/components/forms/new-chart-form/store";
import { Card, CardContent } from "@/components/ui/card";
import { CHART_TYPES } from "@/constants";
import { cn } from "@/lib/utils";

const chartIcons = {
    Bar: <BarChart className="h-12 w-12" />,
    Area: <AreaChart className="h-12 w-12" />,
    Radial: <PieChart className="h-12 w-12" />,
    Radar: <Activity className="h-12 w-12" />,
    Heatmap: <Grid className="h-12 w-12" />,
};

const chartDescriptions = {
    Bar: "Perfect for comparing categories or showing changes over time",
    Area: "Great for showing trends and cumulative data over time",
    Radial: "Ideal for showing parts of a whole or proportional data",
    Radar: "Excellent for comparing multiple variables across categories",
    Heatmap: "Best for showing patterns in large datasets with color intensity",
};

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export function ChartTypeStep() {
    const { chartType, setChartType } = useChartFormStore();

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="mb-3 text-3xl font-bold tracking-tight">
                    Select Chart Type
                </h2>
                <p className="text-lg text-muted-foreground">
                    Choose the visualization that best fits your data
                </p>
            </div>

            <motion.div
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {CHART_TYPES.map((type) => (
                    <motion.div key={type} variants={item}>
                        <Card
                            className={cn(
                                "overflow-hidden transition-all duration-300 hover:shadow-lg",
                                "cursor-pointer hover:scale-[1.02]",
                                chartType === type
                                    ? "bg-primary/5 ring-2 ring-primary"
                                    : "hover:bg-accent/50"
                            )}
                            onClick={() => setChartType(type)}
                        >
                            <CardContent className="p-0">
                                <div className="flex flex-col p-6">
                                    <div
                                        className={cn(
                                            "mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors",
                                            chartType === type
                                                ? "text-primary"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {chartIcons[type]}
                                    </div>
                                    <div>
                                        <h3 className="mb-2 text-lg font-semibold">
                                            {type} Chart
                                        </h3>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {chartDescriptions[type]}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
