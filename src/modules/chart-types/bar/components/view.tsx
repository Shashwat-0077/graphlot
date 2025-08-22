"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
    ChartViewComponent,
    FONT_STYLES_BOLD,
    FONT_STYLES_STRIKETHROUGH,
    FONT_STYLES_UNDERLINE,
    GRID_ORIENTATION_TYPE_ONE,
    GRID_ORIENTATION_TYPE_THREE,
    GRID_ORIENTATION_TYPE_TWO,
} from "@/constants";
import { useProcessData } from "@/hooks/use-process-data";
import { ChartViewWrapper } from "@/components/ui/chart-view-wrapper";
import { getGridStyle, getLabelAnchor, getRGBAString } from "@/utils";
import { useBarChartStore } from "@/modules/chart-types/bar/store";
import { SimpleLoader } from "@/components/ui/simple-loader";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { CustomTooltipContent } from "@/components/ui/custom-tooltip";
import {
    CustomChartLegend,
    CustomChartLegendContent,
} from "@/components/ui/custom-legend";

export const BarChartView: ChartViewComponent = ({ chartId, userId }) => {
    const LIMIT = 8;

    const xAxisField = useBarChartStore((state) => state.xAxisField);
    const yAxisField = useBarChartStore((state) => state.yAxisField);
    const xAxisSortOrder = useBarChartStore((state) => state.xAxisSortOrder);
    const yAxisSortOrder = useBarChartStore((state) => state.yAxisSortOrder);

    const borderWidth = useBarChartStore((state) => state.borderWidth);
    const borderColor = useBarChartStore((state) => state.borderColor);
    const backgroundColor = useBarChartStore((state) => state.backgroundColor);

    const colorPalette = useBarChartStore((state) => state.colorPalette);

    const barWidth = useBarChartStore((state) => state.barWidth);
    const barGap = useBarChartStore((state) => state.barGap);
    const marginTop = useBarChartStore((state) => state.marginTop);
    const marginRight = useBarChartStore((state) => state.marginRight);
    const marginLeft = useBarChartStore((state) => state.marginLeft);
    const marginBottom = useBarChartStore((state) => state.marginBottom);

    const labelEnabled = useBarChartStore((state) => state.labelEnabled);
    const labelAnchor = useBarChartStore((state) => state.labelAnchor);
    const labelSize = useBarChartStore((state) => state.labelSize);
    const labelFontFamily = useBarChartStore((state) => state.labelFontFamily);
    const labelFontStyle = useBarChartStore((state) => state.labelFontStyle);
    const label = useBarChartStore((state) => state.label);
    const gridEnabled = useBarChartStore((state) => state.gridEnabled);
    const gridOrientation = useBarChartStore((state) => state.gridOrientation);
    const xAxisEnabled = useBarChartStore((state) => state.xAxisEnabled);
    const gridColor = useBarChartStore((state) => state.gridColor);
    const yAxisEnabled = useBarChartStore((state) => state.yAxisEnabled);
    const tooltipEnabled = useBarChartStore((state) => state.tooltipEnabled);
    const tooltipStyle = useBarChartStore((state) => state.tooltipStyle);
    const tooltipTextColor = useBarChartStore(
        (state) => state.tooltipTextColor
    );
    const tooltipSeparatorEnabled = useBarChartStore(
        (state) => state.tooltipSeparatorEnabled
    );
    const tooltipTotalEnabled = useBarChartStore(
        (state) => state.tooltipTotalEnabled
    );
    const tooltipBackgroundColor = useBarChartStore(
        (state) => state.tooltipBackgroundColor
    );
    const tooltipSeparatorColor = useBarChartStore(
        (state) => state.tooltipSeparatorColor
    );
    const tooltipBorderRadius = useBarChartStore(
        (state) => state.tooltipBorderRadius
    );
    const tooltipBorderWidth = useBarChartStore(
        (state) => state.tooltipBorderWidth
    );
    const tooltipBorderColor = useBarChartStore(
        (state) => state.tooltipBorderColor
    );
    const borderRadiusBetweenBars = useBarChartStore(
        (state) => state.borderRadiusBetweenBars
    );
    const barBorderRadius = useBarChartStore((state) => state.barBorderRadius);

    const labelColor = useBarChartStore((state) => state.labelColor);
    const gridStyle = useBarChartStore((state) => state.gridStyle);
    const gridWidth = useBarChartStore((state) => state.gridWidth);
    const strokeWidth = useBarChartStore((state) => state.strokeWidth);
    const legendEnabled = useBarChartStore((state) => state.legendEnabled);
    const legendTextColor = useBarChartStore((state) => state.legendTextColor);
    const fillOpacity = useBarChartStore((state) => state.fillOpacity);
    const stackedStoreValue = useBarChartStore((state) => state.stacked);

    const { data, config, isLoading, error } = useProcessData({
        chartId,
        userId,
        xAxis: xAxisField,
        yAxis: yAxisField,
        sortX: xAxisSortOrder,
        sortY: yAxisSortOrder,
    });

    const limitedBarChartData = useMemo(() => {
        return data.length > LIMIT ? data.slice(0, LIMIT) : data;
    }, [data]);

    // Loading state
    if (isLoading) {
        return (
            <ChartViewWrapper
                borderWidth={borderWidth}
                borderColor={borderColor}
                bgColor={backgroundColor}
                className="flex items-center justify-center"
            >
                <div className="flex flex-col items-center gap-4">
                    <SimpleLoader />
                    <p className="text-muted-foreground text-sm">
                        Loading chart data...
                    </p>
                </div>
            </ChartViewWrapper>
        );
    }

    // Error state
    if (error || !data) {
        return (
            <ChartViewWrapper
                borderWidth={borderWidth}
                borderColor={borderColor}
                bgColor={backgroundColor}
                className="flex items-center justify-center"
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="bg-destructive/10 rounded-full p-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-destructive h-6 w-6"
                        >
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold">
                        Failed to load chart data
                    </h3>
                    <p className="text-muted-foreground max-w-[250px] text-sm">
                        There was an error loading the chart data. Please try
                        again later.
                    </p>
                </div>
            </ChartViewWrapper>
        );
    }

    // No axis selected state
    if (!xAxisField || !yAxisField) {
        return (
            <ChartViewWrapper
                borderWidth={borderWidth}
                borderColor={borderColor}
                bgColor={backgroundColor}
                className="flex items-center justify-center"
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="bg-muted rounded-full p-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-muted-foreground h-6 w-6"
                        >
                            <path d="M3 3v18h18" />
                            <path d="m19 9-5 5-4-4-3 3" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold">
                        Chart Configuration Required
                    </h3>
                    <p className="text-muted-foreground max-w-[250px] text-sm">
                        Please select both X and Y axis values to display the
                        chart.
                    </p>
                </div>
            </ChartViewWrapper>
        );
    }

    // Prepare chart configuration data
    const configData: {
        [key: string]: { label: string; color: string; alpha: number };
    } = {};

    for (let idx = 0; idx < config.length; idx++) {
        const data_label = config[idx];
        configData[data_label] = {
            label:
                data_label[0].toUpperCase() + data_label.slice(1).toLowerCase(),
            color: colorPalette[idx]
                ? getRGBAString(colorPalette[idx], false)
                : "rgb(255, 255, 255, 1)",
            alpha: colorPalette[idx]
                ? colorPalette[idx].a
                : Math.min(1 / config.length, 0.5),
        };
    }
    const stacked = config.length > 5 ? true : stackedStoreValue;

    return (
        <ChartViewWrapper
            borderWidth={borderWidth}
            borderColor={borderColor}
            bgColor={backgroundColor}
        >
            <ChartContainer
                config={configData}
                className="h-full w-full min-w-0"
            >
                <BarChart
                    accessibilityLayer
                    data={limitedBarChartData}
                    barSize={barWidth}
                    barGap={barGap}
                    margin={{
                        top: marginTop,
                        right: marginRight,
                        left: marginLeft,
                        bottom: marginBottom,
                    }}
                >
                    {labelEnabled && (
                        <text
                            x={getLabelAnchor(labelAnchor)}
                            y={30}
                            style={{
                                fontSize: `${labelSize}px`,
                                fontFamily: labelFontFamily,
                                textDecoration:
                                    labelFontStyle === FONT_STYLES_UNDERLINE
                                        ? "underline"
                                        : labelFontStyle ===
                                            FONT_STYLES_STRIKETHROUGH
                                          ? "line-through"
                                          : "none",
                                fontWeight:
                                    labelFontStyle === FONT_STYLES_BOLD
                                        ? "bold"
                                        : "normal",
                                fill: getRGBAString(labelColor),
                                textAnchor: labelAnchor,
                            }}
                        >
                            {label}
                        </text>
                    )}

                    {gridEnabled && (
                        <CartesianGrid
                            vertical={
                                gridOrientation === GRID_ORIENTATION_TYPE_TWO ||
                                gridOrientation === GRID_ORIENTATION_TYPE_THREE
                            }
                            horizontal={
                                gridOrientation === GRID_ORIENTATION_TYPE_ONE ||
                                gridOrientation === GRID_ORIENTATION_TYPE_THREE
                            }
                            stroke={getRGBAString(gridColor)}
                            strokeDasharray={getGridStyle(gridStyle, gridWidth)}
                        />
                    )}

                    {xAxisEnabled && (
                        <XAxis
                            dataKey="class"
                            tickMargin={10}
                            stroke={getRGBAString(gridColor)}
                        />
                    )}

                    {yAxisEnabled && (
                        <YAxis
                            tickMargin={10}
                            axisLine={false}
                            stroke={getRGBAString(gridColor)}
                        />
                    )}

                    {tooltipEnabled && (
                        <ChartTooltip
                            cursor={false}
                            content={
                                <CustomTooltipContent
                                    indicator={tooltipStyle}
                                    textColor={tooltipTextColor}
                                    separatorEnabled={tooltipSeparatorEnabled}
                                    totalEnabled={tooltipTotalEnabled}
                                    backgroundColor={tooltipBackgroundColor}
                                    separatorColor={tooltipSeparatorColor}
                                />
                            }
                            wrapperStyle={{
                                zIndex: 1000,
                                borderRadius: `${tooltipBorderRadius}px`,
                                borderWidth: `${tooltipBorderWidth}px`,
                                borderColor: getRGBAString(
                                    tooltipBorderColor,
                                    true
                                ),
                                overflow: "hidden",
                            }}
                        />
                    )}

                    {config.map((data_label) => {
                        // For non-stacked bars, apply full radius
                        if (!stacked) {
                            // eslint-disable-next-line
                            const shape = (props: any) => {
                                const { x, y, width, height, payload } = props;
                                const inset = strokeWidth / 2;
                                const w = Math.max(0, width - strokeWidth);
                                const h = Math.max(0, height - strokeWidth);

                                const currentValue = payload[data_label];
                                if (!currentValue || currentValue <= 0) {
                                    return null;
                                }

                                return (
                                    <rect
                                        x={x + inset}
                                        y={y + inset}
                                        width={w}
                                        height={h}
                                        rx={barBorderRadius}
                                        ry={barBorderRadius}
                                        fill={configData[data_label].color}
                                        fillOpacity={fillOpacity}
                                        stroke={configData[data_label].color}
                                        strokeWidth={strokeWidth}
                                    />
                                );
                            };

                            return (
                                <Bar
                                    key={data_label}
                                    dataKey={data_label}
                                    fill={configData[data_label].color}
                                    fillOpacity={fillOpacity}
                                    stroke={configData[data_label].color}
                                    strokeWidth={strokeWidth}
                                    // @ts-expect-error i don't wanna wrap my head around recharts types, i know this works, if it doesn't work, i'll fix it later hehe
                                    shape={shape}
                                />
                            );
                        }

                        if (borderRadiusBetweenBars) {
                            // eslint-disable-next-line
                            const shape = (props: any) => {
                                const { x, y, width, height, payload } = props;
                                const inset = strokeWidth / 2;
                                const w = Math.max(0, width - strokeWidth);
                                const h = Math.max(0, height - strokeWidth);

                                const currentValue = payload[data_label];
                                if (!currentValue || currentValue <= 0) {
                                    return null;
                                }

                                return (
                                    <rect
                                        x={x + inset}
                                        y={y + inset}
                                        width={w}
                                        height={h}
                                        rx={barBorderRadius}
                                        ry={barBorderRadius}
                                        fill={configData[data_label].color}
                                        fillOpacity={fillOpacity}
                                        stroke={configData[data_label].color}
                                        strokeWidth={strokeWidth}
                                    />
                                );
                            };

                            return (
                                <Bar
                                    key={data_label}
                                    dataKey={data_label}
                                    fill={configData[data_label].color}
                                    fillOpacity={fillOpacity}
                                    stroke={configData[data_label].color}
                                    strokeWidth={strokeWidth}
                                    // @ts-expect-error i don't wanna wrap my head around recharts types, i know this works, if it doesn't work, i'll fix it later hehe
                                    shape={shape}
                                    stackId={"1"}
                                />
                            );
                        }

                        // For stacked bars, use a shape function to handle radius dynamically
                        // eslint-disable-next-line
                        const shape = (props: any) => {
                            const { x, y, width, height, payload } = props;

                            // Get the current field's value
                            const currentValue = payload[data_label];

                            // Don't render anything if the current value is 0, null, or undefined
                            if (!currentValue || currentValue <= 0) {
                                return null;
                            }

                            // Find which bars have actual data for this data point
                            const nonZeroFields = config.filter((field) => {
                                const value = payload[field];
                                return (
                                    value !== undefined &&
                                    value !== null &&
                                    value > 0
                                );
                            });

                            const fieldIndex =
                                nonZeroFields.indexOf(data_label);
                            const isFirst = fieldIndex === 0;
                            const isLast =
                                fieldIndex === nonZeroFields.length - 1;

                            let topLeftRadius = 0;
                            let topRightRadius = 0;
                            let bottomLeftRadius = 0;
                            let bottomRightRadius = 0;

                            if (isFirst && isLast) {
                                // Single bar - all corners
                                topLeftRadius =
                                    topRightRadius =
                                    bottomLeftRadius =
                                    bottomRightRadius =
                                        barBorderRadius;
                            } else if (isLast) {
                                // Last bar - top corners only
                                topLeftRadius = topRightRadius =
                                    barBorderRadius;
                            } else if (isFirst) {
                                // First bar - bottom corners only
                                bottomLeftRadius = bottomRightRadius =
                                    barBorderRadius;
                            }

                            const inset = strokeWidth / 2;
                            const w = width - strokeWidth;
                            const h = height - strokeWidth;
                            const sx = x + inset;
                            const sy = y + inset;

                            const path = `
  M ${sx + topLeftRadius} ${sy}
  L ${sx + w - topRightRadius} ${sy}
  Q ${sx + w} ${sy} ${sx + w} ${sy + topRightRadius}
  L ${sx + w} ${sy + h - bottomRightRadius}
  Q ${sx + w} ${sy + h} ${sx + w - bottomRightRadius} ${sy + h}
  L ${sx + bottomLeftRadius} ${sy + h}
  Q ${sx} ${sy + h} ${sx} ${sy + h - bottomLeftRadius}
  L ${sx} ${sy + topLeftRadius}
  Q ${sx} ${sy} ${sx + topLeftRadius} ${sy}
  Z
`;

                            return (
                                <path
                                    d={path}
                                    fill={configData[data_label].color}
                                    fillOpacity={fillOpacity}
                                    stroke={configData[data_label].color}
                                    strokeWidth={strokeWidth}
                                />
                            );
                        };

                        return (
                            <Bar
                                key={data_label}
                                dataKey={data_label}
                                fill={configData[data_label].color} // Keep this for tooltip colors
                                fillOpacity={fillOpacity} // Keep this for tooltip colors
                                stroke={configData[data_label].color} // Keep this for tooltip colors
                                strokeWidth={strokeWidth} // Keep this for tooltip colors
                                // @ts-expect-error i don't wanna wrap my head around recharts types, i know this works, if it doesn't work, i'll fix it later hehe
                                shape={shape}
                                stackId="1"
                            />
                        );
                    })}
                </BarChart>
            </ChartContainer>

            {legendEnabled && (
                <div className="mt-2 w-full">
                    <CustomChartLegend
                        orientation="horizontal"
                        className="pb-2"
                    >
                        <CustomChartLegendContent
                            textColor={legendTextColor}
                            payload={config.map((key) => ({
                                value: configData[key].label,
                                color: configData[key].color,
                                payload: {
                                    fill: configData[key].color,
                                    stroke: configData[key].color,
                                },
                            }))}
                        />
                    </CustomChartLegend>
                </div>
            )}
        </ChartViewWrapper>
    );
};
