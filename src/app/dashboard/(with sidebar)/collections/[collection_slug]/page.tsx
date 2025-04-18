import React, { Suspense } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { getAllChartsWithCollectionId } from "@/modules/BasicChart/api/getCharts";
import { ChartCard } from "@/modules/BasicChart/components/ChartCard";
import { parseSlug } from "@/utils/pathSlugsOps";
import ChartCardLoader from "@/modules/BasicChart/components/ChartCardLoader";

export default async function CollectionPage({
    params,
}: {
    params: Promise<{ collection_slug: string }>;
}) {
    const { collection_slug } = await params;
    const { id: collection_id } = parseSlug(collection_slug);

    if (!collection_slug) {
        return <div>Invalid Collection ID</div>;
    }

    const response = await getAllChartsWithCollectionId(collection_id);

    if (!response.ok) {
        return <div>Failed to fetch charts</div>;
    }

    const { charts } = response;

    return (
        // TODO : Add a navbar with all charts types as nav-items (also add All option in the nav-items list)
        <div className="grid grid-cols-1 gap-x-5 gap-y-5 pb-7 break900:grid-cols-2 break1200:grid-cols-3">
            <Suspense
                fallback={
                    <>
                        <ChartCardLoader />
                        <ChartCardLoader />
                        <ChartCardLoader />
                    </>
                }
            >
                {charts.map((chart) => (
                    <ChartCard
                        key={chart.chart_id}
                        type={chart.type}
                        collection_slug={collection_slug}
                        name={chart.name}
                        chartId={chart.chart_id}
                        notionDatabaseName={chart.notion_database_name}
                    />
                ))}

                <Link
                    href={`/dashboard/collections/${collection_slug}/new-chart`}
                    className="h-full w-full"
                    style={{
                        minHeight: "270px",
                    }}
                >
                    <div className="grid h-full w-full place-content-center rounded-xl border border-sidebar-accent">
                        <Plus size={32} />
                    </div>
                </Link>
            </Suspense>
        </div>
    );
}
