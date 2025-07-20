"use client";

import { Save, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

interface HeatmapHeaderProps {
    onSave: () => void;
    onShare: () => void;
    isLoading: boolean;
}

export function HeatmapHeader({
    onSave,
    onShare,
    isLoading,
}: HeatmapHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Heatmap Configuration
                </h1>
                <p className="text-sm text-muted-foreground">
                    Customize your heatmap chart appearance and behavior
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onShare} className="gap-2">
                    <Copy className="h-4 w-4" />
                    Share
                </Button>
                <Button onClick={onSave} disabled={isLoading} className="gap-2">
                    <Save className="h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Chart"}
                </Button>
            </div>
        </div>
    );
}
