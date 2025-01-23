import React from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { ChartCard } from "@/features/charts/components/ChartCard";
import { decodeFromUrl } from "@/utils/pathSerialization";

export default async function CollectionPage({
    params,
}: {
    params: { id: string };
}) {
    const { id: encodedId } = params;
    const pathObj = decodeFromUrl(encodedId);

    if (!pathObj) {
        return <div>Invalid Collection ID</div>;
    }

    const { path: collectionId, name: _collectionName } = pathObj;

    return (
        // TODO : Add a navbar with all charts types as nav-items (also add All option in the nav-items list)
        <div className="grid grid-cols-1 gap-x-5 gap-y-5 pb-7 break900:grid-cols-2 break1200:grid-cols-3">
            <ChartCard type="Donut" collectionId={collectionId} />
            <ChartCard type="Bar" collectionId={collectionId} />
            <ChartCard type="Radar" collectionId={collectionId} />
            <ChartCard type="Area" collectionId={collectionId} />
            <ChartCard type="Heatmap" collectionId={collectionId} />
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
