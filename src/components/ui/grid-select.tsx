"use client";
import { Columns3, Grid2x2, Rows3 } from "lucide-react";

import {
    GRID_BOTH,
    GRID_HORIZONTAL,
    GRID_NONE,
    GRID_VERTICAL,
    type GridType,
} from "@/constants";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const GridSelect = ({
    grid_type,
    setGridType,
}: {
    grid_type: GridType;
    setGridType: (grid_type: GridType) => void;
}) => {
    return (
        <div className="flex items-center">
            <ToggleGroup
                type="single"
                value={grid_type}
                onValueChange={(val: GridType) => {
                    if (
                        val === GRID_HORIZONTAL ||
                        val === GRID_VERTICAL ||
                        val === GRID_BOTH
                    ) {
                        setGridType(val);
                    } else {
                        setGridType(GRID_NONE);
                    }
                }}
                className="flex"
            >
                <ToggleGroupItem
                    value={GRID_HORIZONTAL}
                    aria-label={"Toggle " + GRID_HORIZONTAL}
                    className="size-10 p-0"
                >
                    <Rows3 size={20} />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value={GRID_VERTICAL}
                    aria-label={"Toggle " + GRID_VERTICAL}
                    className="size-10 p-0"
                >
                    <Columns3 size={20} />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value={GRID_BOTH}
                    aria-label={"Toggle " + GRID_BOTH}
                    className="size-10 p-0"
                >
                    <Grid2x2 size={20} />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
};

export { GridSelect };
