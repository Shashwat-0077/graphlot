"use client";
import React, { useState } from "react";
import { CheckCheck, SaveAll } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const ChartViewWrapperComponent = ({
    children,
    bgColor,
    labelColor,
    showLabel,
    label,
    className,
}: {
    children: React.ReactNode;
    bgColor: { r: number; g: number; b: number; a: number };
    labelColor: { r: number; g: number; b: number; a: number };
    showLabel: boolean;
    label: string;
    className?: string;
}) => {
    const [saved, setSaved] = useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    return (
        <div
            className={cn(
                `relative flex flex-col items-center justify-center rounded-xl border pb-14 pt-7`,
                className
            )}
            style={{
                backgroundColor: `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})`,
            }}
        >
            <h1
                className="text-2xl font-bold"
                style={{
                    color: `rgba(${labelColor.r}, ${labelColor.g}, ${labelColor.b}, ${labelColor.a})`,
                }}
            >
                {showLabel ? (
                    label[0].toUpperCase() + label.slice(1)
                ) : (
                    <>&nbsp;</>
                )}
            </h1>
            <Button
                className={cn(
                    `absolute right-10 top-5 m-0 border py-6 transition-transform hover:scale-110 [&_svg]:size-6`
                )}
                style={{
                    backgroundColor: `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})`,
                    border: `1px solid rgba(${labelColor.r}, ${labelColor.g}, ${labelColor.b}, ${labelColor.a})`,
                }}
                onClick={() => {
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }

                    setSaved(true);
                    timeoutRef.current = setTimeout(() => {
                        setSaved(false);
                    }, 2000);
                }}
            >
                {saved ? (
                    <CheckCheck
                        color={`rgba(${labelColor.r} , ${labelColor.g} , ${labelColor.b})`}
                        size={32}
                    />
                ) : (
                    <SaveAll
                        color={`rgba(${labelColor.r} , ${labelColor.g} , ${labelColor.b})`}
                        className="size-14"
                        size={32}
                    />
                )}
            </Button>

            {children}
        </div>
    );
};
