import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { encodeForUrl } from "@/utils/pathSerialization";
import { AreaChartCardHeader } from "@/modules/charts/specificCharts/Area/components/AreaHeaderChart";
import { BarChartCardHeader } from "@/modules/charts/specificCharts/Bar/components/BarHeaderChart";
import { DonutChartCardHeader } from "@/modules/charts/specificCharts/Donut/components/DonutHeaderChart";
import { RadarChartCardHeader } from "@/modules/charts/specificCharts/Radar/components/RadarHeaderChart";
import { HeatmapChartCardHeader } from "@/modules/charts/specificCharts/Heatmap/components/HeatmapHeaderChart";
import { ChartType } from "@/modules/charts/constants";

export function ChartCard({
    type,
    encodedCollectionId,
    name,
    chartId,
    notionDatabaseName,
}: {
    type: ChartType;
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
                    <h1 className="truncate text-2xl text-primary">
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
