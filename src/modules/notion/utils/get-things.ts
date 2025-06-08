import { AnchorType, GridStyle } from "@/constants";

export const getGridStyle = (style: GridStyle, width: number): string => {
    switch (style) {
        case "solid":
            return `0`;
        case "dashed":
            return `${width + 5} ${width}`;
        case "dotted":
            return `${width} ${width + 10} `;
        default:
            return "";
    }
};

export const getLabelAnchor = (anchor: AnchorType): string => {
    switch (anchor) {
        case "start":
            return "0%";
        case "middle":
            return "50%";
        case "end":
            return "100%";
        default:
            return "0";
    }
};
