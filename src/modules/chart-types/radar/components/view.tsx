"use client";

import { useMemo } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

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
    GRID_ORIENTATION_TYPE_ONE,
} from "@/constants";
import { useProcessData } from "@/hooks/use-process-data";
import { useRadarChartStore } from "@/modules/chart-types/radar/store";
import { getGridStyle, getLabelAnchor, getRGBAString } from "@/utils";

export const RadarChartView: ChartViewComponent = ({ chartId, userId }) => {
    const LIMIT = 8;

    const gridOrientation = useRadarChartStore(
        (state) => state.gridOrientation
    );
    const gridStyle = useRadarChartStore((state) => state.gridStyle);
    const gridWidth = useRadarChartStore((state) => state.gridWidth);
    const gridEnabled = useRadarChartStore((state) => state.gridEnabled);
    const tooltipEnabled = useRadarChartStore((state) => state.tooltipEnabled);
    const tooltipStyle = useRadarChartStore((state) => state.tooltipStyle);
    const tooltipBorderRadius = useRadarChartStore(
        (state) => state.tooltipBorderRadius
    );
    const tooltipBorderWidth = useRadarChartStore(
        (state) => state.tooltipBorderWidth
    );
    const tooltipTotalEnabled = useRadarChartStore(
        (state) => state.tooltipTotalEnabled
    );
    const tooltipSeparatorEnabled = useRadarChartStore(
        (state) => state.tooltipSeparatorEnabled
    );

    // Box model configuration from store
    const borderWidth = useRadarChartStore((state) => state.borderWidth);
    const marginBottom = useRadarChartStore((state) => state.marginBottom);
    const marginLeft = useRadarChartStore((state) => state.marginLeft);
    const marginRight = useRadarChartStore((state) => state.marginRight);
    const marginTop = useRadarChartStore((state) => state.marginTop);
    const xOffset = useRadarChartStore((state) => state.xOffset);
    const yOffset = useRadarChartStore((state) => state.yOffset);

    // Color configuration from store
    const backgroundColor = useRadarChartStore(
        (state) => state.backgroundColor
    );
    const borderColor = useRadarChartStore((state) => state.borderColor);
    const colorPalette = useRadarChartStore((state) => state.colorPalette);
    const gridColor = useRadarChartStore((state) => state.gridColor);
    const labelColor = useRadarChartStore((state) => state.labelColor);
    const legendTextColor = useRadarChartStore(
        (state) => state.legendTextColor
    );
    const tooltipTextColor = useRadarChartStore(
        (state) => state.tooltipTextColor
    );
    const tooltipBackgroundColor = useRadarChartStore(
        (state) => state.tooltipBackgroundColor
    );
    const tooltipSeparatorColor = useRadarChartStore(
        (state) => state.tooltipSeparatorColor
    );
    const tooltipBorderColor = useRadarChartStore(
        (state) => state.tooltipBorderColor
    );

    // Typography configuration from store
    const label = useRadarChartStore((state) => state.label);
    const labelAnchor = useRadarChartStore((state) => state.labelAnchor);
    const labelEnabled = useRadarChartStore((state) => state.labelEnabled);
    const labelFontFamily = useRadarChartStore(
        (state) => state.labelFontFamily
    );
    const labelFontStyle = useRadarChartStore((state) => state.labelFontStyle);
    const labelSize = useRadarChartStore((state) => state.labelSize);
    const legendEnabled = useRadarChartStore((state) => state.legendEnabled);

    // Radar chart store selectors
    const strokeWidth = useRadarChartStore((state) => state.strokeWidth);
    const xAxisEnabled = useRadarChartStore((state) => state.xAxisEnabled);
    const xAxisField = useRadarChartStore((state) => state.xAxisField);
    const yAxisField = useRadarChartStore((state) => state.yAxisField);
    const xAxisSortOrder = useRadarChartStore((state) => state.xAxisSortOrder);
    const yAxisSortOrder = useRadarChartStore((state) => state.yAxisSortOrder);

    const { data, config, isLoading, error } = useProcessData({
        chartId,
        userId,
        xAxis: xAxisField,
        yAxis: yAxisField,
        sortX: xAxisSortOrder,
        sortY: yAxisSortOrder,
    });

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
                className="h-full w-full min-w-0 overflow-hidden"
            >
                <RadarChart
                    className="relative"
                    data={limitedRadarChartData}
                    margin={{
                        bottom: marginBottom,
                        left: marginLeft,
                        right: marginRight,
                        top: marginTop,
                    }}
                    style={{
                        top: yOffset,
                        left: xOffset,
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

                    {xAxisEnabled && (
                        <PolarAngleAxis
                            dataKey="class"
                            fill={getRGBAString(gridColor)}
                            tickLine={false}
                            axisLine={false}
                            style={{
                                fontSize: "12px",
                                fontFamily: labelFontFamily,
                            }}
                        />
                    )}

                    {gridEnabled && (
                        <PolarGrid
                            gridType={
                                gridOrientation === GRID_ORIENTATION_TYPE_ONE
                                    ? "polygon"
                                    : "circle"
                            }
                            strokeWidth={gridWidth}
                            stroke={getRGBAString(gridColor)}
                            fill={getRGBAString(gridColor)}
                            strokeOpacity={0.3}
                            strokeDasharray={getGridStyle(gridStyle, gridWidth)}
                        />
                    )}

                    {config.map((data_label) => (
                        <Radar
                            key={data_label}
                            dataKey={data_label}
                            fill={configData[data_label].color}
                            fillOpacity={configData[data_label].alpha}
                            dot={{
                                r: 3,
                                fillOpacity: 1,
                                stroke: configData[data_label].color,
                                strokeWidth: 1,
                            }}
                            strokeWidth={strokeWidth}
                            stroke={configData[data_label].color}
                        />
                    ))}
                </RadarChart>
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
