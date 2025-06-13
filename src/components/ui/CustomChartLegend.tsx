"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { RGBAColor } from "@/constants";
import { getRGBAString } from "@/utils/colors";

interface ChartLegendProps {
    className?: string;
    orientation?: "horizontal" | "vertical";
    children: React.ReactNode;
}

export const CustomChartLegend = React.forwardRef<
    HTMLDivElement,
    ChartLegendProps
>(({ className, orientation = "horizontal", children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "recharts-default-legend",
                "flex justify-center",
                orientation === "horizontal"
                    ? "flex-row flex-wrap"
                    : "flex-col",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

CustomChartLegend.displayName = "ChartScrollableLegend";

interface ChartLegendContentProps {
    className?: string;
    payload?: Array<{
        value: string;
        color: string;
        payload: {
            fill: string;
            stroke: string;
            [key: string]: any; // eslint-disable-line
        };
        [key: string]: any; // eslint-disable-line
    }>;
    textColor?: RGBAColor;
    nameKey?: string;
    valueKey?: string;
    iconType?: "circle" | "rect" | "line";
    iconSize?: number;
    // onClick?: (entry: any, index: number) => void;
    // onMouseEnter?: (entry: any, index: number) => void;
    // onMouseLeave?: (entry: any, index: number) => void;
}

export function CustomChartLegendContent({
    className,
    payload,
    nameKey = "value",
    valueKey,
    iconType = "rect",
    iconSize = 14,
    textColor = { r: 255, g: 255, b: 255, a: 1 },
    // onClick,
    // onMouseEnter,
    // onMouseLeave,
}: ChartLegendContentProps) {
    if (!payload || !payload.length) {
        return null;
    }

    return (
        <ul className={cn("flex flex-wrap justify-center gap-4", className)}>
            {payload.map((entry, index) => {
                const { color, value } = entry;
                const valueText = valueKey ? entry[valueKey] : undefined;
                const name = nameKey ? entry[nameKey] || value : value;

                return (
                    <li
                        key={`item-${index}`}
                        className="flex items-center gap-1.5 text-sm"
                        // onClick={
                        //     onClick ? () => onClick(entry, index) : undefined
                        // }
                        // onMouseEnter={
                        //     onMouseEnter
                        //         ? () => onMouseEnter(entry, index)
                        //         : undefined
                        // }
                        // onMouseLeave={
                        //     onMouseLeave
                        //         ? () => onMouseLeave(entry, index)
                        //         : undefined
                        // }
                    >
                        {iconType === "circle" ? (
                            <span
                                className="inline-block rounded-full"
                                style={{
                                    backgroundColor: color,
                                    width: iconSize,
                                    height: iconSize,
                                }}
                            />
                        ) : iconType === "rect" ? (
                            <span
                                className="inline-block rounded-sm"
                                style={{
                                    backgroundColor: color,
                                    width: iconSize,
                                    height: iconSize,
                                }}
                            />
                        ) : (
                            <span
                                className="inline-block"
                                style={{
                                    backgroundColor: color,
                                    width: iconSize * 2,
                                    height: 2,
                                }}
                            />
                        )}
                        <div
                            style={{
                                color: getRGBAString(textColor, true),
                            }}
                        >
                            <span className="text-xs">{name}</span>
                            {valueText && (
                                <span className="text-xs font-medium">
                                    {valueText}
                                </span>
                            )}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
