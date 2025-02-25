import React from "react";

import { HeatmapChartView } from "@/modules/charts/Heatmap/components/HeatmapChartView";

export default function HeatPage() {
    return (
        <div>
            <HeatmapChartView chartName="sample" notion_table_id="2" />
        </div>
    );
}
