"use client";

import { useMemo } from "react";
import { RadialBar, RadialBarChart } from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { ChartViewWrapper } from "@/components/ui/chart-view-wrapper";
import {
    CustomChartLegend,
    CustomChartLegendContent,
} from "@/components/ui/custom-legend";
import { CustomTooltipContent } from "@/components/ui/custom-tooltip";
import { SimpleLoader } from "@/components/ui/simple-loader";
import {
    ChartViewComponent,
    FONT_STYLES_BOLD,
    FONT_STYLES_STRIKETHROUGH,
    FONT_STYLES_UNDERLINE,
} from "@/constants";
import { useProcessData } from "@/hooks/use-process-data";
import { useRadialChartStore } from "@/modules/chart-types/radial/store";
import { getLabelAnchor, getRGBAString } from "@/utils";

export const RadialChartView: ChartViewComponent = ({ chartId, userId }) => {
    const LIMIT = 8; // Limit for performance optimization

    // Radial chart store selectors
    const xAxisField = useRadialChartStore((state) => state.xAxisField);
    const xAxisSortOrder = useRadialChartStore((state) => state.xAxisSortOrder);
    const yAxisField = useRadialChartStore((state) => state.yAxisField);
    const yAxisSortOrder = useRadialChartStore((state) => state.yAxisSortOrder);
    const innerRadius = useRadialChartStore((state) => state.innerRadius);
    const outerRadius = useRadialChartStore((state) => state.outerRadius);
    const startAngle = useRadialChartStore((state) => state.startAngle);
    const endAngle = useRadialChartStore((state) => state.endAngle);
    const gap = useRadialChartStore((state) => state.gap);
    const trackEnabled = useRadialChartStore((state) => state.trackEnabled);
    const borderRadius = useRadialChartStore((state) => state.borderRadius);
    const xOffset = useRadialChartStore((state) => state.xOffset);
    const yOffset = useRadialChartStore((state) => state.yOffset);
    const trackColor = useRadialChartStore((state) => state.trackColor);

    // Visual configuration from store
    const tooltipEnabled = useRadialChartStore((state) => state.tooltipEnabled);
    const tooltipStyle = useRadialChartStore((state) => state.tooltipStyle);
    const tooltipBorderRadius = useRadialChartStore(
        (state) => state.tooltipBorderRadius
    );
    const tooltipBorderWidth = useRadialChartStore(
        (state) => state.tooltipBorderWidth
    );
    const tooltipTotalEnabled = useRadialChartStore(
        (state) => state.tooltipTotalEnabled
    );
    const tooltipSeparatorEnabled = useRadialChartStore(
        (state) => state.tooltipSeparatorEnabled
    );

    // Box model configuration from store
    const borderWidth = useRadialChartStore((state) => state.borderWidth);
    const marginBottom = useRadialChartStore((state) => state.marginBottom);
    const marginLeft = useRadialChartStore((state) => state.marginLeft);
    const marginRight = useRadialChartStore((state) => state.marginRight);
    const marginTop = useRadialChartStore((state) => state.marginTop);

    // Color configuration from store
    const backgroundColor = useRadialChartStore(
        (state) => state.backgroundColor
    );
    const borderColor = useRadialChartStore((state) => state.borderColor);
    const colorPalette = useRadialChartStore((state) => state.colorPalette);
    const labelColor = useRadialChartStore((state) => state.labelColor);
    const legendTextColor = useRadialChartStore(
        (state) => state.legendTextColor
    );
    const tooltipTextColor = useRadialChartStore(
        (state) => state.tooltipTextColor
    );
    const tooltipBackgroundColor = useRadialChartStore(
        (state) => state.tooltipBackgroundColor
    );
    const tooltipSeparatorColor = useRadialChartStore(
        (state) => state.tooltipSeparatorColor
    );
    const tooltipBorderColor = useRadialChartStore(
        (state) => state.tooltipBorderColor
    );

    // Typography configuration from store
    const label = useRadialChartStore((state) => state.label);
    const labelAnchor = useRadialChartStore((state) => state.labelAnchor);
    const labelEnabled = useRadialChartStore((state) => state.labelEnabled);
    const labelFontFamily = useRadialChartStore(
        (state) => state.labelFontFamily
    );
    const labelFontStyle = useRadialChartStore((state) => state.labelFontStyle);
    const labelSize = useRadialChartStore((state) => state.labelSize);
    const legendEnabled = useRadialChartStore((state) => state.legendEnabled);

    const { data, config, isLoading, error } = useProcessData({
        chartId,
        userId,
        xAxis: xAxisField,
        sortX: xAxisSortOrder,
        yAxis: yAxisField,
        sortY: yAxisSortOrder,
    });

    // Limit data for better performance if needed
    const limitedRadarChartData = useMemo(() => {
        return data.length > LIMIT ? data.slice(0, LIMIT) : data;
    }, [data]);

    // Check if we're in count mode (yAxis is count)
    const isCountMode = yAxisField === "count";

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
                bgColor={backgroundColor}
                borderWidth={borderWidth}
                borderColor={borderColor}
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
    if (!xAxisField) {
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
                        Please select X axis values to display the chart.
                    </p>
                </div>
            </ChartViewWrapper>
        );
    }

    // Build config data for each segment
    const configData: {
        [key: string]: { label: string; color?: string };
    } = {};

    if (isCountMode) {
        // Count mode: each category gets its own color
        limitedRadarChartData.forEach((d, idx) => {
            configData[d.class] = {
                label: d.class,
                color: colorPalette[idx]
                    ? getRGBAString(colorPalette[idx], true)
                    : `rgba(255,255,255,1)`,
            };
        });
    } else {
        // Field mode: each field gets its own color
        config.forEach((key, idx) => {
            configData[key] = {
                label: key.charAt(0).toUpperCase() + key.slice(1),
                color: colorPalette[idx]
                    ? getRGBAString(colorPalette[idx], true)
                    : `rgba(255,255,255,1)`,
            };
        });
    }

    // Transform data for proper radial bar rendering
    const renderData = limitedRadarChartData.map((d) => {
        if (isCountMode) {
            // In count mode, we only have one value per item
            return {
                ...d,
                _total: d[yAxisField] || 0,
                _segments: [{ key: d.class, value: d[yAxisField] || 0 }],
                fill: configData[d.class]?.color || "rgba(255,255,255,1)", // Add fill for count mode
            };
        } else {
            // Calculate total for percentage calculations
            const total = config.reduce(
                (sum, key) => sum + ((d[key] as number) || 0),
                0
            );
            return {
                ...d,
                _total: total,
                _segments: config.map((key) => ({ key, value: d[key] || 0 })),
            };
        }
    });

    // Transform payload for CustomTooltipContent
    // eslint-disable-next-line
    const transformTooltipPayload = (payload: any) => {
        if (!payload || !payload.length) {
            return [];
        }

        const data = payload[0].payload;

        if (isCountMode) {
            // Count mode: single entry
            return [
                {
                    name: "Count",
                    value: data[yAxisField] || 0,
                    color:
                        configData[data.class]?.color || "rgba(255,255,255,1)",
                },
            ];
        } else {
            // Field mode: multiple entries
            return config.map((key) => ({
                name: configData[key].label,
                value: data[key] || 0,
                color: configData[key].color || `rgba(255,255,255,1)`,
            }));
        }
    };

    return (
        <ChartViewWrapper
            borderWidth={borderWidth}
            borderColor={borderColor}
            bgColor={backgroundColor} // Set to transparent to avoid background overlap
            className="flex items-center justify-center"
        >
            <div
                className="relative h-full w-full overflow-hidden pt-10"
                style={{
                    backgroundColor: getRGBAString(backgroundColor, true),
                }}
            >
                {labelEnabled && (
                    <p
                        style={{
                            position: "absolute",
                            top: "0",
                            left: getLabelAnchor(labelAnchor),
                            transform: `translateX(-${getLabelAnchor(labelAnchor)})`,
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
                            color: getRGBAString(labelColor),
                        }}
                    >
                        {label}
                    </p>
                )}
                <ChartContainer
                    config={configData}
                    className="break1200:min-h-[500px] mx-auto max-h-[500px] min-h-[270px] w-full"
                >
                    <RadialBarChart
                        className="relative"
                        margin={{
                            top: marginTop,
                            right: marginRight,
                            bottom: marginBottom,
                            left: marginLeft,
                        }}
                        barCategoryGap={gap}
                        data={renderData}
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        startAngle={startAngle}
                        endAngle={endAngle}
                        style={{
                            top: yOffset,
                            left: xOffset,
                        }}
                    >
                        <defs>
                            {/* Background pattern */}
                            <pattern
                                id="bg"
                                patternUnits="userSpaceOnUse"
                                width="1"
                                height="1"
                            >
                                <rect
                                    width="1"
                                    height="1"
                                    fill={getRGBAString(backgroundColor, true)}
                                />
                            </pattern>

                            {/* Override styles with high specificity */}
                            <style>
                                {`
                .recharts-radial-bar-background-sector {
                    fill: ${getRGBAString(trackColor, true)} !important;
                    opacity: ${trackEnabled ? 1 : 0} !important;
                }
                
                /* Target the specific Tailwind class that's overriding */
                g[class*="fill-muted"] .recharts-radial-bar-background-sector,
                [class*="\\[\\&_\\.recharts-radial-bar-background-sector\\]"] .recharts-radial-bar-background-sector {
                    fill: ${getRGBAString(trackColor, true)} !important;
                }
            `}
                            </style>
                        </defs>

                        {/* Rest of your chart content - tooltips, RadialBars, etc. */}
                        {tooltipEnabled && (
                            <ChartTooltip
                                cursor={false}
                                content={({ active, payload }) => (
                                    <CustomTooltipContent
                                        active={active}
                                        payload={transformTooltipPayload(
                                            payload
                                        )}
                                        label={payload?.[0]?.payload?.class}
                                        indicator={tooltipStyle}
                                        textColor={tooltipTextColor}
                                        separatorEnabled={
                                            tooltipSeparatorEnabled
                                        }
                                        totalEnabled={tooltipTotalEnabled}
                                        backgroundColor={tooltipBackgroundColor}
                                        separatorColor={tooltipSeparatorColor}
                                    />
                                )}
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

                        {/* Your RadialBar components */}
                        {isCountMode ? (
                            <RadialBar
                                background={trackEnabled}
                                dataKey={yAxisField}
                                cornerRadius={borderRadius}
                            />
                        ) : (
                            config.map((key, idx) => {
                                const segmentColor = colorPalette[idx]
                                    ? getRGBAString(colorPalette[idx], true)
                                    : `rgba(255,255,255,1)`;

                                return (
                                    <RadialBar
                                        background={idx === 0 && trackEnabled}
                                        key={key}
                                        dataKey={key}
                                        fill={segmentColor}
                                        cornerRadius={borderRadius}
                                        stackId="stack"
                                    />
                                );
                            })
                        )}
                    </RadialBarChart>
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
                                payload={
                                    isCountMode
                                        ? // Count mode: show categories in legend
                                          limitedRadarChartData.map((d) => ({
                                              value: d.class,
                                              color:
                                                  configData[d.class]?.color ??
                                                  "rgba(255,255,255,1)",
                                              payload: {
                                                  fill:
                                                      configData[d.class]
                                                          ?.color ??
                                                      "rgba(255,255,255,1)",
                                                  stroke:
                                                      configData[d.class]
                                                          ?.color ??
                                                      "rgba(255,255,255,1)",
                                              },
                                          }))
                                        : // Field mode: show fields in legend
                                          config.map((key) => ({
                                              value: configData[key].label,
                                              color:
                                                  configData[key].color ??
                                                  "rgba(255,255,255,1)",
                                              payload: {
                                                  fill:
                                                      configData[key].color ??
                                                      "rgba(255,255,255,1)",
                                                  stroke:
                                                      configData[key].color ??
                                                      "rgba(255,255,255,1)",
                                              },
                                          }))
                                }
                            />
                        </CustomChartLegend>
                    </div>
                )}
            </div>
        </ChartViewWrapper>
    );
};
