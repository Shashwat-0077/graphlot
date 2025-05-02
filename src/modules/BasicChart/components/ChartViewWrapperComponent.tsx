"use client";

import { cn } from "@/lib/utils";
import { getRGBAString } from "@/utils/colors";

interface ChartViewWrapperProps {
    children: React.ReactNode;
    bgColor: { r: number; g: number; b: number; a: number };
    className?: string;
}

export function ChartViewWrapper({
    children,
    bgColor,
    className,
}: ChartViewWrapperProps) {
    return (
        <div
            className={cn(
                "relative flex min-h-[300px] w-full flex-col items-center justify-center rounded-xl border p-4",
                className
            )}
            style={{
                backgroundColor: getRGBAString(bgColor, true),
            }}
        >
            {children}
        </div>
    );
}
