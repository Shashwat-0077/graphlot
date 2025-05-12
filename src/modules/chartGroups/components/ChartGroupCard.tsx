"use client";

import { useState } from "react";
import { LayoutGrid, Grid3X3, MoreHorizontal } from "lucide-react";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ChartGroup = {
    group_id: string;
    name: string;
    layout_type: string;
    chart_count: number;
    created_at: string;
};

export function ChartGroupCard({
    group,
    onEdit,
    onDelete,
}: {
    group: ChartGroup;
    onEdit?: (group: ChartGroup) => void;
    onDelete?: (group: ChartGroup) => void;
}) {
    const [isHovered, setIsHovered] = useState(false);

    const layoutIcon =
        group.layout_type === "grid" ? (
            <Grid3X3 className="h-4 w-4" />
        ) : (
            <LayoutGrid className="h-4 w-4" />
        );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date);
    };

    return (
        <Card
            className="group overflow-hidden transition-all hover:shadow-md"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative">
                <CardHeader className="overflow-hidden p-0">
                    <div
                        className={`transition-transform duration-300 ${isHovered ? "scale-105" : "scale-100"}`}
                    >
                        <div className="flex h-[180px] items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20">
                            <div className="grid grid-cols-2 gap-2 p-4">
                                {Array.from({
                                    length: Math.min(4, group.chart_count),
                                }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-16 w-16 rounded-md bg-background/80 shadow-sm"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-3 top-3 z-10">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => onEdit?.(group)}
                                >
                                    Edit Group
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onEdit?.(group)}
                                >
                                    Manage Charts
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => onDelete?.(group)}
                                >
                                    Delete Group
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
            </div>
            <CardContent className="p-5">
                <h3 className="mb-1 truncate text-xl font-semibold">
                    {group.name}
                </h3>
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className="flex items-center gap-1.5 font-normal"
                    >
                        {layoutIcon}
                        {group.layout_type.charAt(0).toUpperCase() +
                            group.layout_type.slice(1)}{" "}
                        Layout
                    </Badge>
                    <Badge variant="secondary">
                        {group.chart_count} Charts
                    </Badge>
                </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/30 px-5 py-3">
                <div className="flex w-full items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                        Created: {formatDate(group.created_at)}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 text-xs"
                        onClick={() => onEdit?.(group)}
                    >
                        Manage
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
