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
import { useMemo } from "react";
import { useRouter } from "next/navigation";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChartType } from "@/constants";
import { getSlug } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AreaChartCardHeader } from "@/modules/chart-types/area/components/header";
import { BarChartCardHeader } from "@/modules/chart-types/bar/components/header";
import { RadialChartCardHeader } from "@/modules/chart-types/radial/components/header";
import { RadarChartCardHeader } from "@/modules/chart-types/radar/components/header";
import { HeatmapChartCardHeader } from "@/modules/chart-types/heatmap/components/header";
import { authClient } from "@/modules/auth/client";

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
    databaseName,
    databaseProvider,
}: {
    type: ChartType;
    collection_slug: string;
    name: string;
    chartId: string;
    databaseName: string;
    databaseProvider: string;
}) {
    const { data: session, isPending } = authClient.useSession();

    const userId = useMemo(() => {
        return (session && session.user.id) || "";
        // eslint-disable-next-line
    }, [session, isPending]);

    // TODO : maybe we can fetch charts 2 main colors and use them to show colors in header charts
    const ChartHeaderComponent = {
        Area: AreaChartCardHeader,
        Bar: BarChartCardHeader,
        Radial: RadialChartCardHeader,
        Radar: RadarChartCardHeader,
        Heatmap: HeatmapChartCardHeader,
    }[type];

    const router = useRouter();

    const chartUrl = `/collections/${collection_slug}/${getSlug({
        id: chartId,
        name: name,
    })}`;

    return (
        <Card className="group relative overflow-hidden py-0 transition-all hover:shadow-md">
            <Link href={chartUrl} className="absolute inset-0 z-40" />

            <div className="relative">
                <CardHeader className="overflow-hidden p-0">
                    <div className={`transition-transform duration-300`}>
                        <ChartHeaderComponent />
                    </div>
                    <div className="absolute top-3 right-3 z-50">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="bg-background/80 h-8 w-8 rounded-full backdrop-blur-sm"
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
            </div>
            <CardContent className="p-5">
                <h3 className="mb-1 truncate text-xl font-semibold">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                </h3>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
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
            <CardFooter className="bg-muted/30 border-t px-5 py-3">
                <div className="flex w-full items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                        Last updated: Today
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="z-50 h-7 cursor-pointer gap-1 text-xs"
                        onClick={() =>
                            router.push(chartUrl + `/view?user_id=${userId}`)
                        }
                    >
                        View
                        <span className="sr-only">View {name}</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
