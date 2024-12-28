import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ProjectLoader({ size = 150 }: { size?: number }) {
    const circleSize = size;

    return (
        // HACK : The loader animation is rigid right now, make it smooth
        <Skeleton className="relative">
            <div
                className={cn(
                    "absolute right-0 top-0 aspect-square rounded-full bg-background"
                )}
                style={{
                    width: circleSize,
                    transform: `translate(${circleSize / 4}px, -${circleSize / 4}px)`,
                }}
            >
                <Skeleton className="absolute left-1/2 top-1/2 grid h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 place-content-center rounded-full"></Skeleton>
            </div>
        </Skeleton>
    );
}
