import React from "react";

import { ChartCard } from "@/features/Charts/components/ChartCard";

export default function page({ _params }: { _params: { id: string } }) {
    return (
        <div className="grid grid-cols-1 gap-x-5 gap-y-5 break900:grid-cols-2 break1200:grid-cols-3">
            <ChartCard type="Donut" />
            <ChartCard type="Bar" />
            <ChartCard type="Radar" />
            <ChartCard type="Area" />
            <ChartCard type="Heatmap" />
        </div>
    );
}
