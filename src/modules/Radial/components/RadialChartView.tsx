"use client";

import { useMemo } from "react";
import { RadialBar, RadialBarChart } from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useRadialChartStore } from "@/modules/Radial/store";
import { ChartViewWrapper } from "@/modules/Chart/components/ChartViewWrapperComponent";
import { WavyLoader } from "@/components/ui/Loader";
import { getRGBAString } from "@/utils/colors";
import { useProcessData } from "@/modules/notion/api/client/use-process-data";
import {
    ChartViewComponent,
    FONT_STYLES_BOLD,
    FONT_STYLES_STRIKETHROUGH,
    FONT_STYLES_UNDERLINE,
} from "@/constants";
import { getLabelAnchor } from "@/modules/notion/utils/get-things";
import {
    useChartBoxModelStore,
    useChartColorStore,
    useChartTypographyStore,
    useChartVisualStore,
} from "@/modules/Chart/store";
import { CustomTooltipContent } from "@/components/ui/CustomToolTip";
import {
    CustomChartLegend,
    CustomChartLegendContent,
} from "@/components/ui/CustomChartLegend";

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
    const offsetX = useRadialChartStore((state) => state.offset.x);
    const offsetY = useRadialChartStore((state) => state.offset.y);
    const trackColor = useRadialChartStore((state) => state.trackColor);

    // Visual configuration from store
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
                bgColor={backgroundColor}
                borderWidth={borderWidth}
                borderColor={borderColor}
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
    if (!xAxisField) {
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
                    className="mx-auto max-h-[500px] min-h-[270px] w-full break1200:min-h-[500px]"
                >
                    <RadialBarChart
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
                            position: "relative",
                            top: `${offsetY}px`,
                            left: `${offsetX}px`,
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
