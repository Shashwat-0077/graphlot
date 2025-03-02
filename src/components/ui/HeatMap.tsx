"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Calendar, FileText, Flame, Hash, MoveRight, Zap } from "lucide-react";

import { ColorType } from "@/modules/charts/Area/state/store/appearance-store";
import { getShortMonth } from "@/modules/charts/Heatmap/utils/getDayOfWeek";

import { ScrollArea, ScrollBar } from "./scroll-area";
import { Button } from "./button";
import { Separator } from "./separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./tooltip";

type Props = {
    weeks: {
        date: Date;
        count: number;
    }[][];
    maxCount: number;
};

export const HeatMap = ({ weeks, maxCount }: Props) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            // Get the scroll container and set it to the rightmost position
            const scrollContainer = scrollAreaRef.current.querySelector(
                "[data-radix-scroll-area-viewport]"
            );
            if (scrollContainer) {
                scrollContainer.scrollLeft = scrollContainer.scrollWidth;
            }
        }
    }, []);

    const GAP = 5;
    const CELL_WIDTH = 20;
    const ACCENT_COLOR: ColorType = {
        r: 242,
        g: 84,
        b: 92,
        a: 1,
    };
    const DEFAULT_BG_COLOR: ColorType = {
        r: 30,
        g: 30,
        b: 30,
        a: 1,
    };
    const LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
    const LABELS_WIDTH = 50;
    const TOOLTIP_WIDTH = 200;
    const TOOLTIP_HEIGHT = 50;

    const monthStarts = weeks.map((week) => {
        const hasFirstOfMonth = week.some((day) => day.date.getDate() === 1);

        if (hasFirstOfMonth) {
            return getShortMonth(
                week.find((day) => day.date.getDate() === 1)?.date
            );
        }

        return null;
    });

    return (
        <div className="container mx-auto max-w-[1450px]">
            <div className="my-5 ml-10 flex justify-between">
                <h1 className="text-4xl">Label</h1>
                <div className="flex items-center justify-center gap-2 pr-5">
                    {2024}
                    <div>
                        <Calendar className="cursor-pointer" />
                    </div>
                </div>
            </div>

            <div
                className="flex"
                style={{
                    gap: `${GAP}px`,
                }}
            >
                <div
                    className="flex shrink-0 grow-0 flex-col"
                    style={{
                        gap: `${GAP}px`,
                    }}
                >
                    {" "}
                    <div
                        className="flex shrink-0 grow-0"
                        style={{
                            width: `${CELL_WIDTH}px`,
                            height: `${CELL_WIDTH}px`,
                        }}
                    >
                        &nbsp;
                    </div>
                    {LABELS.map((label, index) => (
                        <div
                            key={index}
                            className="mr-5 shrink-0 grow-0 text-right"
                            style={{
                                width: `${LABELS_WIDTH}px`,
                                height: `${CELL_WIDTH}px`,
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                {/* 
                    // BUG : The scroll is very janky when the component loads 
                */}

                <ScrollArea ref={scrollAreaRef} className="scroll-smooth">
                    <div
                        className="flex shrink-0 grow-0"
                        style={{
                            gap: `${GAP}px`,
                            marginBottom: `${GAP}px`,
                        }}
                    >
                        {monthStarts.map((month, col_index) => (
                            <div
                                key={col_index}
                                className="shrink-0 grow-0 text-center"
                                style={{
                                    width: `${CELL_WIDTH}px`,
                                    height: `${CELL_WIDTH}px`,
                                }}
                            >
                                {month || ""}
                            </div>
                        ))}
                    </div>
                    <div
                        className="flex pb-5 pr-5"
                        style={{
                            gap: `${GAP}px`,
                        }}
                    >
                        {weeks.map((week, col_index) => (
                            <motion.div
                                key={col_index}
                                className="flex shrink-0 grow-0 flex-col"
                                style={{
                                    gap: `${GAP}px`,
                                }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: col_index * 0.02 }}
                            >
                                {week.map((data, row_index) => {
                                    const boxColor =
                                        data.count === 0
                                            ? DEFAULT_BG_COLOR
                                            : ACCENT_COLOR;

                                    const boxOpacity =
                                        data.count === 0
                                            ? 1
                                            : data.count / maxCount;

                                    // HACK : This shit right here is hacky af, we are not even calculating, we are just assigning values based on columns and rows
                                    let tooltipTop = "0%";
                                    let tooltipLeft = "0%";
                                    let isReversed = false;

                                    if (row_index > 4) {
                                        if (col_index > weeks.length - 11) {
                                            isReversed = true;
                                            tooltipTop = `-${TOOLTIP_HEIGHT + 5}px`;
                                            tooltipLeft = `-${TOOLTIP_WIDTH - CELL_WIDTH}px`;
                                        } else {
                                            tooltipTop = `-${TOOLTIP_HEIGHT + 5}px`;
                                            tooltipLeft = "0%";
                                        }
                                    } else {
                                        if (col_index > weeks.length - 11) {
                                            isReversed = true;
                                            tooltipTop = "0%";
                                            tooltipLeft = `-${TOOLTIP_WIDTH + 5}px`;
                                        } else {
                                            tooltipTop = "0%";
                                            tooltipLeft = "120%";
                                        }
                                    }

                                    return (
                                        <div
                                            key={row_index}
                                            className="group relative shrink-0 grow-0 select-none rounded-sm"
                                            style={{
                                                width: `${CELL_WIDTH}px`,
                                                height: `${CELL_WIDTH}px`,
                                            }}
                                        >
                                            <div
                                                className="h-full w-full rounded-[inherit]"
                                                style={{
                                                    backgroundColor: `rgb(${boxColor.r}, ${boxColor.g}, ${boxColor.b})`,
                                                    opacity: boxOpacity,
                                                }}
                                            />
                                            {/* Below are the tooltips */}
                                            <div
                                                className="absolute z-50 hidden gap-2 overflow-hidden rounded border bg-background text-sm group-hover:flex"
                                                style={{
                                                    width: `${TOOLTIP_WIDTH}px`,
                                                    height: `${TOOLTIP_HEIGHT}px`,
                                                    top: tooltipTop,
                                                    left: tooltipLeft,
                                                    flexDirection: isReversed
                                                        ? "row-reverse"
                                                        : "row",
                                                    textAlign: isReversed
                                                        ? "right"
                                                        : "left",
                                                }}
                                            >
                                                <div
                                                    className="w-1"
                                                    style={{
                                                        backgroundColor: `rgb(${boxColor.r}, ${boxColor.g}, ${boxColor.b})`,
                                                        opacity: boxOpacity,
                                                    }}
                                                />
                                                <div className="m-0 flex flex-col py-1.5 pr-3">
                                                    <span>
                                                        Date :
                                                        {data.date.toDateString()}
                                                    </span>
                                                    <span>
                                                        Count : {data.count}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>

            <div className="flex items-center justify-between px-10">
                {/* Metrics */}
                <TooltipProvider delayDuration={0}>
                    <div className="flex">
                        <Tooltip>
                            <TooltipTrigger className="flex gap-1">
                                <Flame size={20} color="#FF5722" />
                                <span>100</span>
                            </TooltipTrigger>
                            <TooltipContent
                                className="border bg-background"
                                side="bottom"
                            >
                                Longest Streak
                            </TooltipContent>
                        </Tooltip>
                        <Separator
                            orientation="vertical"
                            className="mx-2 h-6"
                        />
                        <Tooltip>
                            <TooltipTrigger className="flex gap-1">
                                <Zap
                                    size={20}
                                    className="mr-1"
                                    color="#FFC107"
                                />
                                <span>100</span>
                            </TooltipTrigger>
                            <TooltipContent
                                className="border bg-background"
                                side="bottom"
                            >
                                Streak
                            </TooltipContent>
                        </Tooltip>
                        <Separator
                            orientation="vertical"
                            className="mx-2 h-6"
                        />

                        <Tooltip>
                            <TooltipTrigger className="flex gap-1">
                                <Hash
                                    size={20}
                                    className="mr-1"
                                    color="#66BB6A"
                                />
                                <span>100</span>
                            </TooltipTrigger>
                            <TooltipContent
                                className="border bg-background"
                                side="bottom"
                            >
                                Total
                            </TooltipContent>
                        </Tooltip>
                        <Separator
                            orientation="vertical"
                            className="mx-2 h-6"
                        />

                        <Tooltip>
                            <TooltipTrigger className="flex gap-1">
                                <FileText
                                    size={20}
                                    className="mr-1"
                                    color="#42A5F5"
                                />
                                <span>100</span>
                            </TooltipTrigger>
                            <TooltipContent
                                className="border bg-background"
                                side="bottom"
                            >
                                Number of entries
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
                {/* Button */}
                <Button className="items-start border bg-background">
                    Log Today <MoveRight />
                </Button>
            </div>
        </div>
    );
};
