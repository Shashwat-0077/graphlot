"use client";

import Link from "next/link";
import {
    BarChart2,
    DonutIcon,
    LineChart,
    Activity,
    Grid3X3,
    MoreHorizontal,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AreaChartCardHeader } from "@/modules/Area/components/AreaChartCardHeader";
import { BarChartCardHeader } from "@/modules/Bar/components/BarChartCardHeader";
import { ChartType } from "@/constants";
import { RadialChartCardHeader } from "@/modules/Radial/components/RadialHeaderChart";
import { RadarChartCardHeader } from "@/modules/Radar/components/RadarHeaderChart";
import { HeatmapChartCardHeader } from "@/modules/Heatmap/components/HeatmapHeaderChart";
import { getSlug } from "@/utils/pathSlugsOps";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const chartTypeIcons = {
    Area: <LineChart className="h-4 w-4" />,
    Bar: <BarChart2 className="h-4 w-4" />,
    Radial: <DonutIcon className="h-4 w-4" />,
    Radar: <Activity className="h-4 w-4" />,
    Heatmap: <Grid3X3 className="h-4 w-4" />,
};

export function ChartCard({
    type,
    collection_slug,
    name,
    chartId,
    userId,
    databaseName,
    databaseProvider,
}: {
    type: ChartType;
    collection_slug: string;
    name: string;
    chartId: string;
    databaseName: string;
    userId: string;
    databaseProvider: string;
}) {
    const ChartTypeComponent = {
        Area: AreaChartCardHeader,
        Bar: BarChartCardHeader,
        Radial: RadialChartCardHeader,
        Radar: RadarChartCardHeader,
        Heatmap: HeatmapChartCardHeader,
    }[type];

    const chartUrl = `/dashboard/collections/${collection_slug}/${getSlug({
        id: chartId,
        name: name,
    })}`;

    return (
        <Card className="group overflow-hidden transition-all hover:shadow-md">
            <div className="relative">
                <CardHeader className="overflow-hidden p-0">
                    <div className={`transition-transform duration-300`}>
                        <ChartTypeComponent />
                    </div>
                    <div className="absolute right-3 top-3 z-10">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={
                                            chartUrl + `/view?user_id=${userId}`
                                        }
                                    >
                                        View Chart
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={chartUrl}>Edit Chart</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Add to Group
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                    Delete Chart
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <Link href={chartUrl} className="absolute inset-0 z-0" />
            </div>
            <CardContent className="p-5">
                <h3 className="mb-1 truncate text-xl font-semibold">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge
                        variant="outline"
                        className="flex items-center gap-1.5 font-normal"
                    >
                        {chartTypeIcons[type] || (
                            <BarChart2 className="h-4 w-4" />
                        )}
                        {type}
                    </Badge>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="truncate">{databaseName}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="truncate">{databaseProvider}</span>
                </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/30 px-5 py-3">
                <div className="flex w-full items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                        Last updated: Today
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 text-xs"
                        asChild
                    >
                        <Link href={chartUrl + "/view?user_id=" + userId}>
                            View
                            <span className="sr-only">View {name}</span>
                        </Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
