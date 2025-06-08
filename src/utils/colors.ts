export const getRGBAString = (
    color: {
        r: number;
        g: number;
        b: number;
        a: number;
    },
    changeAlpha = false
): string => {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${changeAlpha ? color.a : 1})`;
};

export const invertRGBA = (
    {
        r,
        g,
        b,
        a,
    }: {
        r: number;
        g: number;
        b: number;
        a: number;
    },
    changeAlpha = false
) => {
    return {
        r: 255 - r,
        g: 255 - g,
        b: 255 - b,
        a: changeAlpha ? a : 1,
    };
};
