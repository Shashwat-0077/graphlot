"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const HeatmapChartCardHeader = () => {
    const column = 16;
    const row = 7;
    const GAP = 5;
    const CELL_WIDTH = 20;
    const data = Array.from({ length: column * row }).map(
        () => Math.floor(Math.random() * 15) + 1
    );

    const max = Math.max(...data);

    return (
        <div className="mx-4 grid min-h-[270px] place-content-center overflow-hidden">
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
};
