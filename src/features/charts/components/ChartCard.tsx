import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { AreaChartCardHeader } from "./HeaderCharts/AreaChart";
import { BarChartCardHeader } from "./HeaderCharts/BarChart";
import { DonutChartCardHeader } from "./HeaderCharts/Donut";
import { RadarChartCardHeader } from "./HeaderCharts/RadarChart";
import { HeatmapChartCardHeader } from "./HeaderCharts/Heatmap";

export function ChartCard({
    type,
    projectID,
}: {
    type: "Area" | "Bar" | "Donut" | "Radar" | "Heatmap";
    projectID: string;
}) {
    const ChartType = {
        Area: AreaChartCardHeader,
        Bar: BarChartCardHeader,
        Donut: DonutChartCardHeader,
        Radar: RadarChartCardHeader,
        Heatmap: HeatmapChartCardHeader,
    }[type];

    return (
        <Link href={`/dashboard/projects/${projectID}/${type.toLowerCase()}`}>
            <Card>
                <CardHeader className="p-0">
                    <ChartType />
                </CardHeader>
                <CardContent className="pt-10">
                    <h1 className="text-2xl text-primary">Database Name</h1>
                    <span className="text-[#686868]">{type} chart</span>
                </CardContent>
            </Card>
        </Link>
    );
}
