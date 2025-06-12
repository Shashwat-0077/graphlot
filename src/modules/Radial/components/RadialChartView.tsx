"use client";

import { useMemo } from "react";
import { LabelList, RadialBar, RadialBarChart } from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
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
    SORT_NONE,
} from "@/constants";
import { getLabelAnchor } from "@/modules/notion/utils/get-things";
import {
    useChartBoxModelStore,
    useChartColorStore,
    useChartTypographyStore,
} from "@/modules/Chart/store";

export const RadialChartView: ChartViewComponent = ({ chartId, userId }) => {
    const LIMIT = 8; // Limit for performance optimization

    // Radial chart store selectors
    const xAxisField = useRadialChartStore((state) => state.xAxisField);
    const xAxisSortOrder = useRadialChartStore((state) => state.xAxisSortOrder);
    // const omitZeroValuesEnabled = useRadialChartStore(
    //     (state) => state.omitZeroValuesEnabled
    // );
    const innerRadius = useRadialChartStore((state) => state.innerRadius);
    const outerRadius = useRadialChartStore((state) => state.outerRadius);
    const startAngle = useRadialChartStore((state) => state.startAngle);
    const endAngle = useRadialChartStore((state) => state.endAngle);
    const legendPosition = useRadialChartStore((state) => state.legendPosition);
    const legendTextSize = useRadialChartStore((state) => state.legendTextSize);

    const borderEnabled = useChartBoxModelStore((state) => state.borderEnabled);
    const borderWidth = useChartBoxModelStore((state) => state.borderWidth);
    const marginBottom = useChartBoxModelStore((state) => state.marginBottom);
    const marginLeft = useChartBoxModelStore((state) => state.marginLeft);
    const marginRight = useChartBoxModelStore((state) => state.marginRight);
    const marginTop = useChartBoxModelStore((state) => state.marginTop);

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

    const backgroundColor = useChartColorStore(
        (state) => state.backgroundColor
    );
    const borderColor = useChartColorStore((state) => state.borderColor);
    const colorPalette = useChartColorStore((state) => state.colorPalette);
    const labelColor = useChartColorStore((state) => state.labelColor);
    const legendTextColor = useChartColorStore(
        (state) => state.legendTextColor
    );

    const { data, config, isLoading, error } = useProcessData({
        chartId,
        userId,
        xAxis: xAxisField,
        sortX: xAxisSortOrder,
        yAxis: "count",
        sortY: SORT_NONE,
    });

    // Limit data for better performance if needed
    const limitedRadarChartData = useMemo(() => {
        return data.length > LIMIT ? data.slice(0, LIMIT) : data;
    }, [data]);

    // Loading state
    if (isLoading) {
        return (
            <ChartViewWrapper
                borderEnabled={borderEnabled}
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
                borderEnabled={borderEnabled}
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
                borderEnabled={borderEnabled}
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

    const configData: {
        [key: string]: { label: string };
    } = {};

    for (let idx = 0; idx < config.length; idx++) {
        const data_label = config[idx];
        configData[data_label] = {
            label:
                data_label[0].toUpperCase() + data_label.slice(1).toLowerCase(),
        };
    }

    const renderData = limitedRadarChartData.map((d, idx) => {
        configData[d.class] = {
            label: d.class,
        };
        return {
            ...d,
            fill: colorPalette[idx]
                ? `rgb(${colorPalette[idx].r}, ${colorPalette[idx].g}, ${colorPalette[idx].b}`
                : "rgb(255, 255, 255)",
        };
    });

    return (
        <ChartViewWrapper
            borderEnabled={borderEnabled}
            borderWidth={borderWidth}
            borderColor={borderColor}
            bgColor={backgroundColor}
            className="flex items-center justify-center"
        >
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
                    barCategoryGap={5}
                    data={renderData}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
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

                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent hideLabel nameKey="class" />
                        }
                    />

                    <RadialBar dataKey="count" background cornerRadius={10}>
                        {legendEnabled && (
                            <LabelList
                                position={legendPosition}
                                dataKey="class"
                                className="capitalize"
                                style={{
                                    fill: getRGBAString(legendTextColor),
                                }}
                                fontSize={legendTextSize}
                            />
                        )}
                    </RadialBar>
                </RadialBarChart>
            </ChartContainer>
        </ChartViewWrapper>
    );
};
