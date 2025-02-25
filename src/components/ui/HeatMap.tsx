"use client";

import { motion } from "motion/react";

import { ColorType } from "@/modules/charts/Area/state/store/appearance-store";
import { getShortMonth } from "@/modules/charts/Heatmap/utils/getDayOfWeek";
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
        <div>
            <div
                className="flex"
                style={{
                    gap: `${GAP}px`,
                    marginBottom: `${GAP}px`,
                    marginLeft: `${LABELS_WIDTH + GAP}px`,
                }}
            >
                {monthStarts.map((month, col_index) => (
                    <div
                        key={col_index}
                        className="shrink-0 grow-0 text-center"
                        style={{
                            width: `${CELL_WIDTH}px`,
                        }}
                    >
                        {month || ""}
                    </div>
                ))}
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
                    {LABELS.map((label, index) => (
                        <div
                            key={index}
                            className="shrink-0 grow-0 text-center"
                            style={{
                                width: `${LABELS_WIDTH}px`,
                                height: `${CELL_WIDTH}px`,
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                <TooltipProvider>
                    {weeks.map((week, col_index) => (
                        <motion.div
                            key={col_index}
                            className="flex shrink-0 grow-0 flex-col"
                            style={{
                                gap: `${GAP}px`,
                            }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: col_index * 0.07 }}
                        >
                            {week.map((data, row_index) => (
                                <Tooltip key={row_index}>
                                    <TooltipTrigger asChild>
                                        {data.count === 0 ? (
                                            <div
                                                key={row_index}
                                                className="shrink-0 grow-0 rounded-sm"
                                                style={{
                                                    backgroundColor: `rgb(${DEFAULT_BG_COLOR.r}, ${DEFAULT_BG_COLOR.g}, ${DEFAULT_BG_COLOR.b})`,
                                                    width: `${CELL_WIDTH}px`,
                                                    height: `${CELL_WIDTH}px`,
                                                }}
                                            />
                                        ) : (
                                            <div
                                                key={row_index}
                                                className="shrink-0 grow-0 rounded-sm"
                                                style={{
                                                    backgroundColor: `rgb(${ACCENT_COLOR.r}, ${ACCENT_COLOR.g}, ${ACCENT_COLOR.b})`,
                                                    width: `${CELL_WIDTH}px`,
                                                    height: `${CELL_WIDTH}px`,
                                                    opacity:
                                                        data.count / maxCount,
                                                }}
                                            />
                                        )}
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="right"
                                        className="flex gap-2 overflow-hidden border bg-background p-0"
                                    >
                                        <div
                                            className="w-1"
                                            style={{
                                                backgroundColor: `rgb(${ACCENT_COLOR.r}, ${ACCENT_COLOR.g}, ${ACCENT_COLOR.b})`,
                                                opacity: data.count / maxCount,
                                            }}
                                        />
                                        <div className="m-0 flex flex-col py-1.5 pr-3">
                                            <span>
                                                Date :{" "}
                                                {data.date.toDateString()}
                                            </span>
                                            <span>Count : {data.count}</span>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </motion.div>
                    ))}
                </TooltipProvider>
            </div>
        </div>
    );
};
