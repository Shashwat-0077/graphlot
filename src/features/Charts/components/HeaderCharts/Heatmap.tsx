"use client";
import { motion } from "motion/react";
import { useMeasure } from "react-use";

import { heatMapData } from "./config/data";

export const HeatmapChartCardHeader = () => {
    const GAP = 5;
    const CELL_WIDTH = 20;
    const { data, max } = heatMapData;

    const [ref, { width }] = useMeasure();

    const boxesPerRow = width ? Math.floor(width / CELL_WIDTH) - 5 : 0;
    const boxesPerColumn = 7;

    return (
        <div
            className="mx-1 grid min-h-[270px] place-content-center overflow-hidden"
            // BUG : This is giving Type error, solve this
            ref={ref}
        >
            <div
                className="flex"
                style={{
                    gap: `${GAP}px`,
                }}
            >
                {Array.from({ length: boxesPerRow }).map((_, col_index) => (
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
                        {Array.from({ length: boxesPerColumn }).map(
                            (_, row_index) => (
                                <div
                                    key={row_index}
                                    className="shrink-0 grow-0 rounded-sm bg-primary"
                                    style={{
                                        width: `${CELL_WIDTH}px`,
                                        height: `${CELL_WIDTH}px`,
                                        opacity:
                                            data[
                                                row_index * boxesPerRow +
                                                    col_index
                                            ] / max,
                                    }}
                                ></div>
                            )
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
