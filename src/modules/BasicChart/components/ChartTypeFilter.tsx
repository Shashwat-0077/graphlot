"use client";

import type React from "react";
import {
    BarChart2,
    DonutIcon,
    LineChart,
    Activity,
    Grid3X3,
    PieChart,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const chartTypeIcons: Record<string, React.ReactNode> = {
    AREA: <LineChart className="h-4 w-4" />,
    BAR: <BarChart2 className="h-4 w-4" />,
    LINE: <LineChart className="h-4 w-4" />,
    PIE: <PieChart className="h-4 w-4" />,
    DONUT: <DonutIcon className="h-4 w-4" />,
    RADAR: <Activity className="h-4 w-4" />,
    HEATMAP: <Grid3X3 className="h-4 w-4" />,
};

export function ChartTypeFilter({
    chartTypes,
    selectedType,
    onSelectType,
}: {
    chartTypes: string[];
    selectedType: string | null;
    onSelectType: (type: string | null) => void;
}) {
    return (
        <div className="flex items-center gap-2">
            {selectedType && (
                <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5"
                >
                    {chartTypeIcons[selectedType] || (
                        <BarChart2 className="h-3 w-3" />
                    )}
                    {selectedType}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full p-0 hover:bg-muted"
                        onClick={() => onSelectType(null)}
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Clear filter</span>
                    </Button>
                </Badge>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Chart Type
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {chartTypes.map((type) => (
                        <DropdownMenuItem
                            key={type}
                            onClick={() => onSelectType(type)}
                            className={selectedType === type ? "bg-muted" : ""}
                        >
                            <div className="flex items-center gap-2">
                                {chartTypeIcons[type] || (
                                    <BarChart2 className="h-4 w-4" />
                                )}
                                <span>{type}</span>
                            </div>
                        </DropdownMenuItem>
                    ))}
                    {chartTypes.length === 0 && (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No chart types available
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
