import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

export default function NewChartFormLoader() {
    return (
        <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-32 bg-sidebar-accent" />
            <Skeleton className="h-10 w-2/3 bg-sidebar-accent" />
            <Skeleton className="h-5 w-2/4 bg-sidebar-accent" />
            <Skeleton className="mt-7 h-5 w-32 bg-sidebar-accent" />
            <Skeleton className="h-10 w-2/3 bg-sidebar-accent" />
            <Skeleton className="h-5 w-2/4 bg-sidebar-accent" />
            <Skeleton className="mt-6 h-10 w-20 bg-sidebar-accent" />
        </div>
    );
}
