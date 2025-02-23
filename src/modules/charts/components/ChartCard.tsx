import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { encodeForUrl } from "@/utils/pathSerialization";

import { AreaChartCardHeader } from "./HeaderCharts/AreaChart";
import { BarChartCardHeader } from "./HeaderCharts/BarChart";
import { DonutChartCardHeader } from "./HeaderCharts/Donut";
import { RadarChartCardHeader } from "./HeaderCharts/RadarChart";
import { HeatmapChartCardHeader } from "./HeaderCharts/Heatmap";


export function ChartCard({
    type,
    encodedCollectionId,
    name,
    chartId,
    notionDatabaseName,
}: {
    type: "Area" | "Bar" | "Donut" | "Radar" | "Heatmap";
    encodedCollectionId: string;
    name: string;
    chartId: string;
    notionDatabaseName: string;
}) {
    const ChartType = {
        Area: AreaChartCardHeader,
        Bar: BarChartCardHeader,
        Donut: DonutChartCardHeader,
        Radar: RadarChartCardHeader,
        Heatmap: HeatmapChartCardHeader,
    }[type];

    return (
        <Link
            href={`/dashboard/collections/${encodedCollectionId}/${encodeForUrl({ path: chartId, name: name })}`}
        >
            <Card className="overflow-hidden">
                <CardHeader className="p-0">
                    <ChartType />
                </CardHeader>
                <CardContent className="pt-10">
                    <h1 className="text-2xl text-primary">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                    </h1>
                    <span className="flex items-center text-[#686868]">
                        {type} chart
                        <Separator
                            orientation="vertical"
                            className="mx-2 h-5 bg-[#686868]"
                        />
                        {notionDatabaseName}
                    </span>
                </CardContent>
            </Card>
        </Link>
    );
}
