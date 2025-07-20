"use client";

import { Info, Square, Layers, MousePointer } from "lucide-react";

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useHeatmapChartStore } from "@/modules/Heatmap/store";

type FeatureType = "label" | "tooltip" | "border" | "legend" | "buttonHover";

interface FeatureCardProps {
    type: FeatureType;
}

const featureConfig = {
    label: {
        title: "Cell Labels",
        description: "Show values inside cells",
        icon: Info,
    },
    tooltip: {
        title: "Tooltips",
        description: "Show hover information",
        icon: Info,
    },
    border: {
        title: "Cell Borders",
        description: "Add borders around cells",
        icon: Square,
    },
    legend: {
        title: "Legend",
        description: "Show color scale legend",
        icon: Layers,
    },
    buttonHover: {
        title: "Hover Effects",
        description: "Enable interactive hover states",
        icon: MousePointer,
    },
};

export function FeatureCard({ type }: FeatureCardProps) {
    const config = featureConfig[type];
    const Icon = config.icon;

    const enabled = useHeatmapChartStore((state) => {
        switch (type) {
            case "label":
                return state.labelEnabled;
            case "tooltip":
                return state.tooltipEnabled;
            case "border":
                return state.borderEnabled;
            case "legend":
                return state.legendEnabled;
            case "buttonHover":
                return state.buttonHoverEnabled;
        }
    });

    const toggle = useHeatmapChartStore((state) => {
        switch (type) {
            case "label":
                return state.toggleLabel;
            case "tooltip":
                return state.toggleTooltip;
            case "border":
                return state.toggleBorder;
            case "legend":
                return state.toggleLegend;
            case "buttonHover":
                return state.toggleButtonHover;
        }
    });

    return (
        <Card
            className={`transition-all ${enabled ? "ring-2 ring-primary" : ""}`}
        >
            <CardHeader className="cursor-pointer" onClick={toggle}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Checkbox checked={enabled} />
                        <div>
                            <CardTitle className="text-base">
                                {config.title}
                            </CardTitle>
                            <CardDescription>
                                {config.description}
                            </CardDescription>
                        </div>
                    </div>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
        </Card>
    );
}
