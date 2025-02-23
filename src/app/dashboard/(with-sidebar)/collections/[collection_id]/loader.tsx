import React from "react";

import ChartCardLoader from "@/modules/charts/components/ChartCardLoader";

export default function Loader() {
    return (
        <div className="grid grid-cols-1 gap-x-5 gap-y-5 pb-7 break900:grid-cols-2 break1200:grid-cols-3">
            <ChartCardLoader />
            <ChartCardLoader />
            <ChartCardLoader />
        </div>
    );
}
