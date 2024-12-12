import React from "react";

import Heatmap from "@/features/Charts/components/Heatmap";
import { heatMapData } from "@/features/Charts/components/HeaderCharts/config/data";

export default function Settings() {
    return (
        <div>
            <Heatmap row={10} column={20} data={heatMapData} />
        </div>
    );
}
