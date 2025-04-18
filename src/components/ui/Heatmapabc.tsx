import React from "react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const CELL_WIDTH = 20;
const GAP = 5;

// NOTE : Maybe we can use Chart Tooltip here

export default function Heatmap({
    row,
    column,
    data,
}: {
    row: number;
    column: number;
    data: number[];
}) {
    const max = Math.max(...data);

    return (
        <div>
            <div
                className="flex"
                style={{
                    gap: `${GAP}px`,
                }}
            >
                <TooltipProvider>
                    {Array.from({ length: column }).map((_, col_index) => (
                        <div
                            key={col_index}
                            className="flex shrink-0 grow-0 flex-col"
                            style={{
                                gap: `${GAP}px`,
                            }}
                        >
                            {Array.from({ length: row }).map((_, row_index) => (
                                <Tooltip key={row_index}>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="shrink-0 grow-0 rounded-sm bg-primary"
                                            style={{
                                                width: `${CELL_WIDTH}px`,
                                                height: `${CELL_WIDTH}px`,
                                                opacity:
                                                    data[
                                                        row_index * column +
                                                            col_index
                                                    ] / max,
                                            }}
                                        ></div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        sideOffset={5}
                                        className="bg-slate-800"
                                    >
                                        Count :{" "}
                                        {data[row_index * column + col_index]}
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    ))}
                </TooltipProvider>
            </div>
        </div>
    );
}
