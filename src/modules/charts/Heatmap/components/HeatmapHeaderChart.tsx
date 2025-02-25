"use client";
import { motion } from "motion/react";
import { useMeasure } from "react-use";

export const heatMapData = {
    data: [
        3, 12, 7, 8, 15, 5, 10, 11, 4, 13, 9, 6, 2, 14, 1, 7, 8, 15, 12, 3, 10,
        5, 13, 6, 9, 4, 2, 14, 11, 7, 1, 15, 4, 8, 12, 6, 11, 5, 13, 3, 9, 10,
        7, 14, 2, 15, 1, 4, 8, 12, 14, 0, 3, 10, 9, 7, 2, 13, 5, 11, 1, 15, 8,
        4, 9, 14, 2, 6, 12, 7, 1, 10, 5, 13, 8, 15, 11, 3, 9, 4, 12, 7, 10, 1,
        14, 8, 3, 0, 6, 11, 15, 2, 9, 4, 7, 5, 11, 14, 8, 3, 6, 9, 10, 2, 13,
        12, 7, 4, 15, 1, 5, 11, 6, 13, 8, 10, 9, 7, 14, 12, 15, 3, 4, 2, 11, 1,
        5, 6, 0, 7, 8, 15, 14, 3, 9, 10, 5, 2, 11, 4, 12, 6, 1, 14, 7, 13, 10,
        8, 2, 15, 0, 9, 11, 3, 6, 12, 5, 4, 1, 7, 15, 14, 9, 8, 10, 13, 3, 2,
        12, 11, 4, 6, 0, 7, 15, 5, 14, 13, 1, 8, 9, 11, 10, 2, 3, 4, 6, 15, 5,
        14, 8, 7, 12, 3, 10, 13, 1, 4, 9, 2, 6, 11, 0, 15, 8, 14, 7, 10, 5, 12,
        6, 13, 3, 9, 1, 11, 4, 0, 8, 15, 14, 7, 2, 12, 10, 5, 13, 9, 3, 6, 11,
        0, 4, 7, 14, 8, 15, 10, 2, 12, 9, 13, 1, 3, 5, 6, 11, 4, 15, 7, 8, 14,
        2, 10, 13, 5, 12, 6, 3, 9, 4, 11, 0, 8, 15, 7, 14, 1, 10, 12, 9, 6, 3,
        5, 2, 11, 4, 13, 15, 8, 7, 14, 10, 1, 6, 3, 12, 9, 2, 11, 4, 15, 8, 13,
    ],
    max: 15,
};

export const HeatmapChartCardHeader = () => {
    const GAP = 5;
    const CELL_WIDTH = 20;
    const { data, max } = heatMapData;

    const [ref, { width }] = useMeasure();

    const boxesPerRow = width ? Math.floor(width / CELL_WIDTH) - 5 : 0;
    const boxesPerColumn = 7;

    return (
        <div
            className="mx-1 grid h-[270px] place-content-center overflow-hidden"
            ref={ref as React.Ref<HTMLDivElement>}
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
                                />
                            )
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
