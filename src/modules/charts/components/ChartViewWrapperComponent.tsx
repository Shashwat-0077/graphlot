import React from "react";

export const ChartViewWrapperComponent = ({
    children,
    bgColor,
    labelColor,
    showLabel,
    label,
}: {
    children: React.ReactNode;
    bgColor: { r: number; g: number; b: number; a: number };
    labelColor: { r: number; g: number; b: number; a: number };
    showLabel: boolean;
    label: string;
}) => {
    return (
        <div
            className="flex flex-col items-center justify-center rounded-xl border pb-14 pt-7"
            style={{
                backgroundColor: `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})`,
            }}
        >
            <h1
                className="text-2xl font-bold"
                style={{
                    color: `rgba(${labelColor.r}, ${labelColor.g}, ${labelColor.b}, ${labelColor.a})`,
                }}
            >
                {showLabel ? (
                    label[0].toUpperCase() + label.slice(1)
                ) : (
                    <>&nbsp;</>
                )}
            </h1>
            {children}
        </div>
    );
};
