"use client";

import { cn, getRGBAString } from "@/utils";

interface ChartViewWrapperProps {
    children: React.ReactNode;
    bgColor: { r: number; g: number; b: number; a: number };
    borderColor: { r: number; g: number; b: number; a: number };
    borderWidth: number;
    className?: string;
}

export function ChartViewWrapper({
    children,
    bgColor,
    className,
    borderColor,
    borderWidth,
}: ChartViewWrapperProps) {
    return (
        <div
            style={{
                backgroundColor: getRGBAString(bgColor, true),
                borderColor: getRGBAString(borderColor, true),
                borderWidth: `${borderWidth}px`,
            }}
            className={cn(
                "relative flex h-full min-h-75 w-full flex-col items-center justify-center p-4",
                className
            )}
        >
            {children}
        </div>
    );
}
