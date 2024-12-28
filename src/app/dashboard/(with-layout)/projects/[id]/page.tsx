import React from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { ChartCard } from "@/features/charts/components/ChartCard";

export default function ProjectPage({ params }: { params: { id: string } }) {
    const { id } = params;

    return (
        // TODO : Add a navbar with all charts types as nav-items (also add All option in the nav-items list)
        <div className="grid grid-cols-1 gap-x-5 gap-y-5 pb-7 break900:grid-cols-2 break1200:grid-cols-3">
            <ChartCard type="Donut" projectID={id} />
            <ChartCard type="Bar" projectID={id} />
            <ChartCard type="Radar" projectID={id} />
            <ChartCard type="Area" projectID={id} />
            <ChartCard type="Heatmap" projectID={id} />
            <Link
                href={`/dashboard/projects/${id}/new-chart`}
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
