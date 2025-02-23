import React from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { ChartCard } from "@/modules/charts/components/ChartCard";
import { decodeFromUrl } from "@/utils/pathSerialization";
import { getAllChartsWithCollectionId } from "@/modules/charts/api/getCharts";

export default async function CollectionPage({
    params,
}: {
    params: Promise<{ collection_id: string }>;
}) {
    const { collection_id: encodedId } = await params;
    const pathObj = decodeFromUrl(encodedId);

    if (!pathObj) {
        return <div>Invalid Collection ID</div>;
    }

    const { path: collectionId } = pathObj;

    const response = await getAllChartsWithCollectionId(collectionId);

    if (!response.ok) {
        return <div>Failed to fetch charts</div>;
    }

    const { charts } = response;

    return (
        // TODO : Add a navbar with all charts types as nav-items (also add All option in the nav-items list)
        <div className="grid grid-cols-1 gap-x-5 gap-y-5 pb-7 break900:grid-cols-2 break1200:grid-cols-3">
            {charts.map((chart) => (
                <ChartCard
                    key={chart.chart_id}
                    type={
                        chart.type as
                            | "Donut"
                            | "Bar"
                            | "Radar"
                            | "Area"
                            | "Heatmap"
                    }
                    encodedCollectionId={encodedId}
                    name={chart.name}
                    chartId={chart.chart_id}
                    notionDatabaseName={chart.notion_database_name}
                />
            ))}

            <Link
                href={`/dashboard/collections/${encodedId}/new-chart`}
                className="h-full w-full"
                style={{
                    minHeight: "270px",
                }}
            >
                <div className="grid h-full w-full place-content-center rounded-xl border border-sidebar-accent">
                    <Plus size={32} />
                </div>
            </Link>
        </div>
    );
}
