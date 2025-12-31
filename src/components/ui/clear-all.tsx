"use client";
import { X } from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ClearAll({ clearFn }: { clearFn: () => void }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        className="text-muted-foreground hover:bg-muted/20 flex h-8 w-8 items-center justify-center rounded-md transition-colors"
                        onClick={clearFn}
                        type="button"
                        aria-label="Reset to default"
                    >
                        <X size={16} />
                    </button>
                </TooltipTrigger>
                <TooltipContent className="border-black bg-black text-white">
                    <p>Reset to default</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
