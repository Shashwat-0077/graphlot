"use client";
import React from "react";

import { useChartFormStore } from "@/modules/chart-attributes/pages/new-chart/store";
import { ColumnConfigureCard } from "@/modules/chart-attributes/components/column-configure-card";

export const ConfigureSection = () => {
    const headers = useChartFormStore((state) => state.fileData.headers);

    return (
        <div>
            <h2 className="text-xl">Configure Column Types</h2>
            <p className="text-muted-foreground text-sm">
                Set the data type and validation rules for each column in your
                file
            </p>

            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                {Object.keys(headers).map((header, index) => (
                    <ColumnConfigureCard key={index} header={header} />
                ))}
            </div>
        </div>
    );
};
