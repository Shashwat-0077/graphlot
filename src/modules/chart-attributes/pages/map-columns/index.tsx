import React from "react";

import { FileInfo } from "@/modules/chart-attributes/pages/map-columns/file-info";
import { ConfigureSection } from "@/modules/chart-attributes/pages/map-columns/configure-section";

export const MapColumnsPage = () => {
    return (
        <div className="space-y-7">
            <div className="mb-8">
                <h1 className="text-foreground mb-2 text-3xl font-bold">
                    Data Column Mapping
                </h1>
                <p className="text-muted-foreground">
                    Configure column types and validation rules for your CSV
                    import
                </p>
            </div>
            <FileInfo />
            <ConfigureSection />
        </div>
    );
};
