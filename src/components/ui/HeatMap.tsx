"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
    Calculator,
    Calendar,
    FileText,
    Flame,
    Hash,
    LucideIcon,
    MoveRight,
    Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RGBAColor } from "@/constants";
import { useHeatmapChartStore } from "@/modules/Heatmap/store";
import { getShortMonth } from "@/utils/date";

type Props = {
    weeks: {
        date: Date;
        count: number;
    }[][];
    maxCount: number;
};

export const HeatMap = ({ weeks, maxCount }: Props) => {
    const {
        accent,
        average_of_all_entries,
        average_of_all_entries_color,
        default_box_color,
        label_enabled,
        longest_streak,
        longest_streak_color,
        number_of_entries,
        number_of_entries_color,
        streak,
        streak_color,
        sum_of_all_entries,
        sum_of_all_entries_color,
        text_color,
        tooltip_enabled,
        average_of_all_entries_enabled,
        button_hover_enabled,
        longest_streak_enabled,
        number_of_entries_enabled,
        sum_of_all_entries_enabled,
        streak_enabled,
    } = useHeatmapChartStore((state) => state);

    const stats: {
        [key: string]: {
            name: string;
            value: number;
            icon: LucideIcon;
            color: RGBAColor;
        };
    } = {
        ...(longest_streak_enabled
            ? {
                  longestStreak: {
                      name: "Longest Streak",
                      value: longest_streak,
                      icon: Flame,
                      color: longest_streak_color,
                  },
              }
            : {}),
        ...(streak_enabled
            ? {
                  streak: {
                      name: "Streak",
                      value: streak,
                      icon: Zap,
                      color: streak_color,
                  },
              }
            : {}),
        ...(sum_of_all_entries_enabled
            ? {
                  total: {
                      name: "Total of all entries",
                      value: sum_of_all_entries,
                      icon: Hash,
                      color: sum_of_all_entries_color,
                  },
              }
            : {}),
        ...(number_of_entries_enabled
            ? {
                  numberOfEntries: {
                      name: "Number of entries",
                      value: number_of_entries,
                      icon: FileText,
                      color: number_of_entries_color,
                  },
              }
            : {}),
        ...(average_of_all_entries_enabled
            ? {
                  average: {
                      name: "Average",
                      value: average_of_all_entries,
                      icon: Calculator,
                      color: average_of_all_entries_color,
                  },
              }
            : {}),
    };

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
        <div
            className="container mx-auto max-w-[1450px]"
            style={{
                color: `rgba(${text_color.r}, ${text_color.g}, ${text_color.b}, ${text_color.a}`,
            }}
        >
            {label_enabled && (
                <div className="flex justify-between py-5 pl-10">
                    <h1 className="text-4xl">Label</h1>
                    <div className="flex items-center justify-center gap-2 pr-5">
                        {new Date().getFullYear()}
                        <div>
                            <Calendar className="cursor-pointer" />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex pt-7">
                <div>
                    <div
                        className="mb-3 flex w-full"
                        style={{
                            widows: `${CELL_WIDTH}px`,
                            height: `${CELL_WIDTH}px`,
                        }}
                    >
                        &nbsp;
                    </div>
                    <div
                        className="flex shrink-0 grow-0 flex-col"
                        style={{
                            gap: `${GAP}px`,
                        }}
                    >
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
                </div>

                <ScrollArea ref={scrollAreaRef} className="scroll-smooth">
                    <div
                        className="mb-3 flex"
                        style={{
                            gap: `${GAP}px`,
                        }}
                    >
                        {monthStarts.map((month, col_index) => (
                            <div
                                key={col_index}
                                className="text-center"
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
                                className="flex flex-col"
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
                                            ? default_box_color
                                            : accent;

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

                                            {tooltip_enabled && (
                                                <div
                                                    className="absolute z-50 hidden gap-2 overflow-hidden rounded border bg-background text-sm group-hover:flex"
                                                    style={{
                                                        width: `${TOOLTIP_WIDTH}px`,
                                                        height: `${TOOLTIP_HEIGHT}px`,
                                                        top: tooltipTop,
                                                        left: tooltipLeft,
                                                        flexDirection:
                                                            isReversed
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
                                            )}
                                        </div>
                                    );
                                })}
                            </motion.div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>

            <div className="flex flex-col items-center justify-between pt-5">
                <TooltipProvider delayDuration={0}>
                    {/* 
                        // TODO : make these different for mobile  
                    */}

                    <div className="flex flex-wrap">
                        {Object.keys(stats).map((key, index) => {
                            const stat = stats[key as keyof typeof stats];

                            return (
                                <React.Fragment key={key}>
                                    <Tooltip>
                                        <TooltipTrigger className="flex gap-1">
                                            <stat.icon
                                                size={20}
                                                color={`rgb(${stat.color.r}, ${stat.color.g}, ${stat.color.b}, ${stat.color.a})`}
                                            />
                                            <span>{stat.value}</span>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            className="border bg-background"
                                            side="bottom"
                                        >
                                            {stat.name}
                                        </TooltipContent>
                                    </Tooltip>
                                    {index !==
                                        Object.keys(stats).length - 1 && (
                                        <Separator
                                            orientation="vertical"
                                            className="mx-2 h-6"
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </TooltipProvider>
                <Button
                    className={cn(
                        "mt-10 w-80 max-w-[80%] items-center border bg-background hover:bg-background",
                        button_hover_enabled &&
                            "opacity-0 transition-opacity duration-200 hover:opacity-100"
                    )}
                >
                    Log Today <MoveRight />
                </Button>
            </div>
        </div>
    );
};
