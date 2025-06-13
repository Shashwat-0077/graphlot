"use client";
import { Circle, Columns3, Grid2x2, Pentagon, Rows3 } from "lucide-react";
import { TbLineDashed, TbLineDotted } from "react-icons/tb";
import { RxBorderSolid } from "react-icons/rx";

import {
    GRID_ORIENTATION_TYPE_THREE,
    GRID_ORIENTATION_TYPE_ONE,
    GRID_ORIENTATION_TYPE_NONE,
    GRID_ORIENTATION_TYPE_TWO,
    GRID_STYLE_DASHED,
    GRID_STYLE_DOTTED,
    GRID_STYLE_SOLID,
    type GridStyle,
    type GridOrientation,
} from "@/constants";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const GridOrientationSelect = ({
    gridOrientation,
    setGridOrientation,
}: {
    gridOrientation: GridOrientation;
    setGridOrientation: (gridOrientation: GridOrientation) => void;
}) => {
    return (
        <div className="flex items-center">
            <ToggleGroup
                type="single"
                value={gridOrientation}
                onValueChange={(val: GridOrientation) => {
                    if (
                        val === GRID_ORIENTATION_TYPE_ONE ||
                        val === GRID_ORIENTATION_TYPE_TWO ||
                        val === GRID_ORIENTATION_TYPE_THREE
                    ) {
                        setGridOrientation(val);
                    } else {
                        setGridOrientation(GRID_ORIENTATION_TYPE_NONE);
                    }
                }}
                className="flex"
            >
                <ToggleGroupItem
                    value={GRID_ORIENTATION_TYPE_ONE}
                    aria-label={"Toggle " + GRID_ORIENTATION_TYPE_ONE}
                    className="size-10 p-0"
                >
                    <Rows3 size={20} />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value={GRID_ORIENTATION_TYPE_TWO}
                    aria-label={"Toggle " + GRID_ORIENTATION_TYPE_TWO}
                    className="size-10 p-0"
                >
                    <Columns3 size={20} />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value={GRID_ORIENTATION_TYPE_THREE}
                    aria-label={"Toggle " + GRID_ORIENTATION_TYPE_THREE}
                    className="size-10 p-0"
                >
                    <Grid2x2 size={20} />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
};

const GridOrientationSelectForRadar = ({
    gridOrientation,
    setGridOrientation,
}: {
    gridOrientation: GridOrientation;
    setGridOrientation: (gridOrientation: GridOrientation) => void;
}) => {
    return (
        <div className="flex items-center">
            <ToggleGroup
                type="single"
                value={gridOrientation}
                onValueChange={(val: GridOrientation) => {
                    if (
                        val === GRID_ORIENTATION_TYPE_ONE ||
                        val === GRID_ORIENTATION_TYPE_TWO
                    ) {
                        setGridOrientation(val);
                    } else {
                        setGridOrientation(GRID_ORIENTATION_TYPE_NONE);
                    }
                }}
                className="flex"
            >
                <ToggleGroupItem
                    value={GRID_ORIENTATION_TYPE_ONE}
                    aria-label={"Toggle " + GRID_ORIENTATION_TYPE_ONE}
                    className="size-10 p-0"
                >
                    <Pentagon size={20} />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value={GRID_ORIENTATION_TYPE_TWO}
                    aria-label={"Toggle " + GRID_ORIENTATION_TYPE_TWO}
                    className="size-10 p-0"
                >
                    <Circle size={20} />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
};

const GridStylesSelect = ({
    gridStyle,
    setGridStyle,
}: {
    gridStyle: GridStyle;
    setGridStyle: (gridStyle: GridStyle) => void;
}) => {
    return (
        <div className="flex items-center">
            <ToggleGroup
                type="single"
                value={gridStyle}
                onValueChange={(val: GridStyle) => {
                    if (
                        val === GRID_STYLE_DASHED ||
                        val === GRID_STYLE_DOTTED ||
                        val === GRID_STYLE_SOLID
                    ) {
                        setGridStyle(val);
                    }
                }}
                className="flex"
            >
                <ToggleGroupItem
                    value={GRID_STYLE_DASHED}
                    aria-label={"Toggle dashed"}
                    className="size-10 p-0"
                >
                    <TbLineDashed size={30} />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value={GRID_STYLE_DOTTED}
                    aria-label={"Toggle dotted"}
                    className="size-10 p-0"
                >
                    <TbLineDotted size={30} />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value={GRID_STYLE_SOLID}
                    aria-label={"Toggle solid"}
                    className="size-10 p-0"
                >
                    <RxBorderSolid size={30} />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
};

export {
    GridOrientationSelect,
    GridStylesSelect,
    GridOrientationSelectForRadar,
};
