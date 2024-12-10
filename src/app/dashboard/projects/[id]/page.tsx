import React from "react";

import { ChartCard } from "@/features/Charts/components/ChartCard";

export default function page({ _params }: { _params: { id: string } }) {
    return (
        <div className="grid grid-cols-3 gap-x-5 gap-y-5">
            <ChartCard type="Donut" />
            <ChartCard type="Bar" />
            <ChartCard type="Radar" />
            <ChartCard type="Area" />
            <ChartCard type="Heatmap" />
        </div>
    );
}
