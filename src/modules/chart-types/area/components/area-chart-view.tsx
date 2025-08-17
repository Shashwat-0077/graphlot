"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
    type ChartViewComponent,
    FONT_STYLES_BOLD,
    FONT_STYLES_STRIKETHROUGH,
    FONT_STYLES_UNDERLINE,
    GRID_ORIENTATION_TYPE_ONE,
    GRID_ORIENTATION_TYPE_THREE,
    GRID_ORIENTATION_TYPE_TWO,
} from "@/constants";
import { useAreaChartStore } from "@/modules/chart-types/area/store";
import { useProcessData } from "@/hooks/use-process-data";
import { ChartViewWrapper } from "@/components/ui/chart-view-wrapper";
import { SimpleLoader } from "@/components/ui/simple-loader";
import { getGridStyle, getLabelAnchor, getRGBAString } from "@/utils";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { CustomTooltipContent } from "@/components/ui/custom-tooltip";
import {
    CustomChartLegend,
    CustomChartLegendContent,
} from "@/components/ui/custom-legend";

export const AreaChartView: ChartViewComponent = ({ chartId, userId }) => {
    const LIMIT = 8; // Maximum number of data points to display

    // Visual configuration from store
    const gridEnabled = useAreaChartStore((state) => state.gridEnabled);
    const gridOrientation = useAreaChartStore((state) => state.gridOrientation);
    const gridStyle = useAreaChartStore((state) => state.gridStyle);
    const gridWidth = useAreaChartStore((state) => state.gridWidth);
    const tooltipEnabled = useAreaChartStore((state) => state.tooltipEnabled);
    const tooltipStyle = useAreaChartStore((state) => state.tooltipStyle);
    const tooltipBorderRadius = useAreaChartStore(
        (state) => state.tooltipBorderRadius
    );
    const tooltipBorderWidth = useAreaChartStore(
        (state) => state.tooltipBorderWidth
    );
    const tooltipTotalEnabled = useAreaChartStore(
        (state) => state.tooltipTotalEnabled
    );
    const tooltipSeparatorEnabled = useAreaChartStore(
        (state) => state.tooltipSeparatorEnabled
    );

    // Box model configuration from store
    const borderWidth = useAreaChartStore((state) => state.borderWidth);
    const marginBottom = useAreaChartStore((state) => state.marginBottom);
    const marginLeft = useAreaChartStore((state) => state.marginLeft);
    const marginRight = useAreaChartStore((state) => state.marginRight);
    const marginTop = useAreaChartStore((state) => state.marginTop);

    // Color configuration from store
    const backgroundColor = useAreaChartStore((state) => state.backgroundColor);
    const borderColor = useAreaChartStore((state) => state.borderColor);
    const colorPalette = useAreaChartStore((state) => state.colorPalette);
    const gridColor = useAreaChartStore((state) => state.gridColor);
    const labelColor = useAreaChartStore((state) => state.labelColor);
    const legendTextColor = useAreaChartStore((state) => state.legendTextColor);
    const tooltipTextColor = useAreaChartStore(
        (state) => state.tooltipTextColor
    );
    const tooltipBackgroundColor = useAreaChartStore(
        (state) => state.tooltipBackgroundColor
    );
    const tooltipSeparatorColor = useAreaChartStore(
        (state) => state.tooltipSeparatorColor
    );
    const tooltipBorderColor = useAreaChartStore(
        (state) => state.tooltipBorderColor
    );

    // Typography configuration from store
    const label = useAreaChartStore((state) => state.label);
    const labelAnchor = useAreaChartStore((state) => state.labelAnchor);
    const labelEnabled = useAreaChartStore((state) => state.labelEnabled);
    const labelFontFamily = useAreaChartStore((state) => state.labelFontFamily);
    const labelFontStyle = useAreaChartStore((state) => state.labelFontStyle);
    const labelSize = useAreaChartStore((state) => state.labelSize);
    const legendEnabled = useAreaChartStore((state) => state.legendEnabled);

    // Area chart specific configuration from store
    const lineStyle = useAreaChartStore((state) => state.lineStyle);
    const strokeWidth = useAreaChartStore((state) => state.strokeWidth);
    const {
        opacity: fillOpacity,
        start: fillStart,
        end: fillEnd,
    } = useAreaChartStore((state) => state.fill);
    const isAreaChart = useAreaChartStore((state) => state.isAreaChart);
    const stackedEnabled = useAreaChartStore((state) => state.stackedEnabled);
    const xAxisEnabled = useAreaChartStore((state) => state.xAxisEnabled);
    const yAxisEnabled = useAreaChartStore((state) => state.yAxisEnabled);
    const xAxisField = useAreaChartStore((state) => state.xAxisField);
    const yAxisField = useAreaChartStore((state) => state.yAxisField);
    const xAxisSortOrder = useAreaChartStore((state) => state.xAxisSortOrder);
    const yAxisSortOrder = useAreaChartStore((state) => state.yAxisSortOrder);

    // Data fetching
    const { data, config, isLoading, error } = useProcessData({
        chartId,
        userId,
        xAxis: xAxisField,
        yAxis: yAxisField,
        sortX: xAxisSortOrder,
        sortY: yAxisSortOrder,
    });

    // Limit data points for better visualization
    const limitedRadarChartData = useMemo(() => {
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

    // Prepare chart configuration data for each series
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
                : "rgb(255, 255, 255 , 1)",
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
                <AreaChart
                    accessibilityLayer
                    data={limitedRadarChartData}
                    margin={{
                        top: marginTop,
                        right: marginRight,
                        left: marginLeft,
                        bottom: marginBottom,
                    }}
                >
                    {/* Chart title/label */}
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

                    {/* Grid configuration */}
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
                            stroke={`rgba(${gridColor.r}, ${gridColor.g}, ${gridColor.b}, ${gridColor.a})`}
                            strokeDasharray={getGridStyle(gridStyle, gridWidth)}
                        />
                    )}

                    {/* X and Y axes */}
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

                    {/* Tooltip configuration */}
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

                    {/* Gradient definitions for area fills */}
                    {isAreaChart && (
                        <defs>
                            {config.map((data_label, idx) => (
                                <linearGradient
                                    key={idx}
                                    id={`fill${data_label.replace(/\s+/g, "")}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset={`${fillStart * 100}%`}
                                        stopColor={configData[data_label].color}
                                        stopOpacity={
                                            configData[data_label].alpha
                                        }
                                    />
                                    <stop
                                        offset={`${fillEnd * 100}%`}
                                        stopColor={getRGBAString(
                                            backgroundColor
                                        )}
                                        stopOpacity={backgroundColor.a}
                                    />
                                </linearGradient>
                            ))}
                        </defs>
                    )}

                    {/* Area series */}
                    {config.map((data_label) => (
                        <Area
                            key={data_label}
                            dataKey={data_label}
                            type={lineStyle}
                            fill={`url(#fill${data_label.replace(/\s+/g, "")})`}
                            fillOpacity={fillOpacity}
                            stroke={configData[data_label].color}
                            strokeWidth={strokeWidth}
                            stackId={stackedEnabled ? "1" : undefined}
                        />
                    ))}
                </AreaChart>
            </ChartContainer>

            {/* Legend configuration */}
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
