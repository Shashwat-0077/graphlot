"use client";
import React, { useState } from "react";
import { CheckCheck, SaveAll } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getRGBAString, invertRGBA } from "@/utils/colors";

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
                backgroundColor: getRGBAString(bgColor, true),
            }}
        >
            <h1
                className="text-2xl font-bold"
                style={{
                    color: getRGBAString(labelColor),
                }}
            >
                {showLabel ? (
                    label[0].toUpperCase() + label.slice(1)
                ) : (
                    <>&nbsp;</>
                )}
            </h1>

            {/* TODO : Add a tooltip here */}
            <Button
                className={cn(
                    `bri absolute right-10 top-5 m-0 border bg-transparent py-6 transition-all hover:scale-110 hover:bg-transparent [&_svg]:size-6`
                )}
                style={{
                    border: `1px solid ` + getRGBAString(invertRGBA(bgColor)),
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
                        color={getRGBAString(invertRGBA(bgColor))}
                        size={32}
                    />
                ) : (
                    <SaveAll
                        color={getRGBAString(invertRGBA(bgColor))}
                        className="size-14"
                        size={32}
                    />
                )}
            </Button>

            {children}
        </div>
    );
};
