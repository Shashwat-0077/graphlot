import { RGBAColor } from "@/constants";

export const getRGBAString = (
    color: RGBAColor,
    changeAlpha = false
): string => {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${changeAlpha ? color.a : 1})`;
};

export const invertRGBA = ({ r, g, b, a }: RGBAColor, changeAlpha = false) => {
    return {
        r: 255 - r,
        g: 255 - g,
        b: 255 - b,
        a: changeAlpha ? a : 1,
    };
};

export const getHexString = (color: RGBAColor): string => {
    return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
};
