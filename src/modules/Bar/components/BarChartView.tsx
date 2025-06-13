"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useBarChartStore } from "@/modules/Bar/store";
import { getRGBAString } from "@/utils/colors";
import {
    type ChartViewComponent,
    FONT_STYLES_BOLD,
    FONT_STYLES_STRIKETHROUGH,
    FONT_STYLES_UNDERLINE,
    GRID_ORIENTATION_TYPE_THREE,
    GRID_ORIENTATION_TYPE_ONE,
    GRID_ORIENTATION_TYPE_NONE,
    GRID_ORIENTATION_TYPE_TWO,
} from "@/constants";
import { ChartViewWrapper } from "@/modules/Chart/components/ChartViewWrapperComponent";
import { WavyLoader } from "@/components/ui/Loader";
import { useProcessData } from "@/modules/notion/api/client/use-process-data";
import {
    useChartBoxModelStore,
    useChartColorStore,
    useChartTypographyStore,
    useChartVisualStore,
} from "@/modules/Chart/store";
import {
    getGridStyle,
    getLabelAnchor,
} from "@/modules/notion/utils/get-things";
import { CustomTooltipContent } from "@/components/ui/CustomToolTip";
import {
    CustomChartLegend,
    CustomChartLegendContent,
} from "@/components/ui/CustomChartLegend";

export const BarChartView: ChartViewComponent = ({ chartId, userId }) => {
    const LIMIT = 8;

    // Visual configuration from store
    const gridOrientation = useChartVisualStore(
        (state) => state.gridOrientation
    );
    const gridStyle = useChartVisualStore((state) => state.gridStyle);
    const gridWidth = useChartVisualStore((state) => state.gridWidth);
    const tooltipEnabled = useChartVisualStore((state) => state.tooltipEnabled);
    const tooltipStyle = useChartVisualStore((state) => state.tooltipStyle);
    const tooltipBorderRadius = useChartVisualStore(
        (state) => state.tooltipBorderRadius
    );
    const tooltipBorderWidth = useChartVisualStore(
        (state) => state.tooltipBorderWidth
    );
    const tooltipTotalEnabled = useChartVisualStore(
        (state) => state.tooltipTotalEnabled
    );
    const tooltipSeparatorEnabled = useChartVisualStore(
        (state) => state.tooltipSeparatorEnabled
    );

    // Box model configuration from store
    const borderWidth = useChartBoxModelStore((state) => state.borderWidth);
    const marginBottom = useChartBoxModelStore((state) => state.marginBottom);
    const marginLeft = useChartBoxModelStore((state) => state.marginLeft);
    const marginRight = useChartBoxModelStore((state) => state.marginRight);
    const marginTop = useChartBoxModelStore((state) => state.marginTop);

    // Color configuration from store
    const backgroundColor = useChartColorStore(
        (state) => state.backgroundColor
    );
    const borderColor = useChartColorStore((state) => state.borderColor);
    const colorPalette = useChartColorStore((state) => state.colorPalette);
    const gridColor = useChartColorStore((state) => state.gridColor);
    const labelColor = useChartColorStore((state) => state.labelColor);
    const legendTextColor = useChartColorStore(
        (state) => state.legendTextColor
    );
    const tooltipTextColor = useChartColorStore(
        (state) => state.tooltipTextColor
    );
    const tooltipBackgroundColor = useChartColorStore(
        (state) => state.tooltipBackgroundColor
    );
    const tooltipSeparatorColor = useChartColorStore(
        (state) => state.tooltipSeparatorColor
    );
    const tooltipBorderColor = useChartColorStore(
        (state) => state.tooltipBorderColor
    );

    // Typography configuration from store
    const label = useChartTypographyStore((state) => state.label);
    const labelAnchor = useChartTypographyStore((state) => state.labelAnchor);
    const labelEnabled = useChartTypographyStore((state) => state.labelEnabled);
    const labelFontFamily = useChartTypographyStore(
        (state) => state.labelFontFamily
    );
    const labelFontStyle = useChartTypographyStore(
        (state) => state.labelFontStyle
    );
    const labelSize = useChartTypographyStore((state) => state.labelSize);
    const legendEnabled = useChartTypographyStore(
        (state) => state.legendEnabled
    );

    // Bar chart store selectors
    const xAxisField = useBarChartStore((state) => state.xAxisField);
    const yAxisField = useBarChartStore((state) => state.yAxisField);
    const xAxisSortOrder = useBarChartStore((state) => state.xAxisSortOrder);
    const yAxisSortOrder = useBarChartStore((state) => state.yAxisSortOrder);

    // Bar specific config selectors
    const yAxisEnabled = useBarChartStore((state) => state.yAxisEnabled);
    const xAxisEnabled = useBarChartStore((state) => state.xAxisEnabled);
    const barBorderRadius = useBarChartStore((state) => state.barBorderRadius);
    const barWidth = useBarChartStore((state) => state.barWidth);
    const barGap = useBarChartStore((state) => state.barGap);
    const fillOpacity = useBarChartStore((state) => state.fillOpacity);
    const strokeWidth = useBarChartStore((state) => state.strokeWidth);
    const stacked = useBarChartStore((state) => state.stacked);
    const borderRadiusBetweenBars = useBarChartStore(
        (state) => state.borderRadiusBetweenBars
    );

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
                    <WavyLoader />
                    <p className="text-sm text-muted-foreground">
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
                    <div className="rounded-full bg-destructive/10 p-3">
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
                            className="h-6 w-6 text-destructive"
                        >
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold">
                        Failed to load chart data
                    </h3>
                    <p className="max-w-[250px] text-sm text-muted-foreground">
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
                    <div className="rounded-full bg-muted p-3">
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
                            className="h-6 w-6 text-muted-foreground"
                        >
                            <path d="M3 3v18h18" />
                            <path d="m19 9-5 5-4-4-3 3" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold">
                        Chart Configuration Required
                    </h3>
                    <p className="max-w-[250px] text-sm text-muted-foreground">
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
                    barGap={barGap / 100} // Convert to percentage for Recharts
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

                    {gridOrientation !== GRID_ORIENTATION_TYPE_NONE && (
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
                        if (borderRadiusBetweenBars) {
                            return (
                                <Bar
                                    key={data_label}
                                    dataKey={data_label}
                                    fill={configData[data_label].color}
                                    fillOpacity={fillOpacity}
                                    stroke={configData[data_label].color}
                                    strokeWidth={strokeWidth}
                                    radius={barBorderRadius}
                                    stackId={stacked ? "1" : undefined}
                                />
                            );
                        }

                        // For non-stacked bars, apply full radius
                        if (!stacked) {
                            return (
                                <Bar
                                    key={data_label}
                                    dataKey={data_label}
                                    fill={configData[data_label].color}
                                    fillOpacity={fillOpacity}
                                    stroke={configData[data_label].color}
                                    strokeWidth={strokeWidth}
                                    radius={barBorderRadius}
                                    stackId={undefined}
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

                            const path = `
            M ${x + topLeftRadius} ${y}
            L ${x + width - topRightRadius} ${y}
            Q ${x + width} ${y} ${x + width} ${y + topRightRadius}
            L ${x + width} ${y + height - bottomRightRadius}
            Q ${x + width} ${y + height} ${x + width - bottomRightRadius} ${y + height}
            L ${x + bottomLeftRadius} ${y + height}
            Q ${x} ${y + height} ${x} ${y + height - bottomLeftRadius}
            L ${x} ${y + topLeftRadius}
            Q ${x} ${y} ${x + topLeftRadius} ${y}
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
