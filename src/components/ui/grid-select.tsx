import React from "react";
import { Columns3, Grid2x2, Rows3 } from "lucide-react";

import {
    GRID_BOTH,
    GRID_HORIZONTAL,
    GRID_NONE,
    GRID_VERTICAL,
    GridType,
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
        <div>
            <ToggleGroup
                type="single"
                defaultValue={grid_type}
                onValueChange={(val: GridType) => {
                    if (val === GRID_VERTICAL) {
                        setGridType(GRID_VERTICAL);
                    } else if (val === GRID_HORIZONTAL) {
                        setGridType(GRID_HORIZONTAL);
                    } else if (val === GRID_BOTH) {
                        setGridType(GRID_BOTH);
                    } else {
                        setGridType(GRID_NONE);
                    }
                }}
            >
                <ToggleGroupItem
                    value={GRID_HORIZONTAL}
                    aria-label={"Toggle " + GRID_HORIZONTAL}
                    className="size-12"
                >
                    <Rows3 size={24} />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value={GRID_VERTICAL}
                    aria-label={"Toggle " + GRID_VERTICAL}
                    className="size-12"
                >
                    <Columns3 size={24} />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value={GRID_BOTH}
                    aria-label={"Toggle " + GRID_BOTH}
                    className="size-12"
                >
                    <Grid2x2 size={24} />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
};

export { GridSelect };
