"use client";
import { X } from "lucide-react";
import React from "react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChartConfigStore } from "@/components/providers/ChartConfigStoreProvider";

export default function ClearAll({ clearFn }: { clearFn: () => void }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div
                        className="cursor-pointer text-muted-foreground"
                        onClick={clearFn}
                    >
                        <X />
                    </div>
                </TooltipTrigger>
                <TooltipContent className="border-black bg-black text-white">
                    <p>Reset To default</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
