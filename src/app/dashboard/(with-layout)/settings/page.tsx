import React from "react";

import Heatmap from "@/components/ui/Heatmap";
import { heatMapData } from "@/features/charts/components/HeaderCharts/config/data";

export default function Settings() {
    return (
        <div>
            <Heatmap row={10} column={20} data={heatMapData.data} />
        </div>
    );
}
