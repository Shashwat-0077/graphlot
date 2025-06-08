"use client";

import Link from "next/link";
import { Layers, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyChartGroupsProps {
    collection_slug: string;
    onCreateClick?: () => void;
}

export function EmptyChartGroups({
    collection_slug,
    onCreateClick,
}: EmptyChartGroupsProps) {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Layers className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-medium">No Chart Groups Found</h3>
            <p className="mb-6 max-w-md text-muted-foreground">
                Chart groups help you organize and visualize multiple charts
                together. Create your first group to get started.
            </p>
            {onCreateClick ? (
                <Button onClick={onCreateClick}>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Create Chart Group
                </Button>
            ) : (
                <Button asChild>
                    <Link
                        href={`/dashboard/collections/${collection_slug}/groups/new`}
                    >
                        <Plus className="mr-1.5 h-4 w-4" />
                        Create Chart Group
                    </Link>
                </Button>
            )}
        </div>
    );
}
