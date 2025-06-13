"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Components
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { ChartViewWrapper } from "@/modules/Chart/components/ChartViewWrapperComponent";
import { WavyLoader } from "@/components/ui/Loader";
import {
    CustomChartLegend,
    CustomChartLegendContent,
} from "@/components/ui/CustomChartLegend";
import { CustomTooltipContent } from "@/components/ui/CustomToolTip";
import { useAreaChartStore } from "@/modules/Area/store";
import {
    useChartBoxModelStore,
    useChartColorStore,
    useChartTypographyStore,
    useChartVisualStore,
} from "@/modules/Chart/store";
import { getRGBAString } from "@/utils/colors";
import {
    ChartViewComponent,
    FONT_STYLES_BOLD,
    FONT_STYLES_STRIKETHROUGH,
    FONT_STYLES_UNDERLINE,
    GRID_ORIENTATION_TYPE_THREE,
    GRID_ORIENTATION_TYPE_ONE,
    GRID_ORIENTATION_TYPE_NONE,
    GRID_ORIENTATION_TYPE_TWO,
} from "@/constants";
import { useProcessData } from "@/modules/notion/api/client/use-process-data";
import {
    getGridStyle,
    getLabelAnchor,
} from "@/modules/notion/utils/get-things";

export const AreaChartView: ChartViewComponent = ({ chartId, userId }) => {
    const LIMIT = 8; // Maximum number of data points to display

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

    // Area chart specific configuration from store
    const areaStyle = useAreaChartStore((state) => state.lineStyle);
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
                            type={areaStyle}
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
