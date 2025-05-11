"use client";

import { Layers, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyChartGroups({
    collection_slug,
    onCreateClick,
}: {
    collection_slug: string;
    onCreateClick?: () => void;
}) {
    return (
        <div className="flex h-[50vh] flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/25 bg-card/50 p-8 text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Layers className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold">No Chart Groups Yet</h2>
            <p className="mb-6 max-w-md text-muted-foreground">
                Create your first chart group to organize multiple charts
                together for better visualization and analysis.
            </p>
            <Button onClick={onCreateClick}>
                <Plus className="mr-1.5 h-4 w-4" />
                Create Chart Group
            </Button>
        </div>
    );
}
