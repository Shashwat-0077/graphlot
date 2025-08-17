import { GridStyle } from "@/constants";

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
