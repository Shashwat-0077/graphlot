"use client";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

import { useUpdateArea } from "@/modules/chart-types/area/api/client";
import { useAreaChartStore } from "@/modules/chart-types/area/store";
import { Button } from "@/components/ui/button";
import {
    useUpdateChartBoxModel,
    useUpdateChartColors,
    useUpdateChartTypography,
    useUpdateChartVisuals,
} from "@/modules/chart-attributes/api/client";

export const AreaSaveButton = ({ chartId }: { chartId: string }) => {
    const {
        mutate: updateArea,
        isSuccess: isAreaUpdated,
        isError: isAreaError,
    } = useUpdateArea();
    const {
        mutate: updateChartBoxModel,
        isSuccess: isChartBoxModelUpdated,
        isError: isChartBoxModelError,
    } = useUpdateChartBoxModel();
    const {
        mutate: updateChartTypography,
        isSuccess: isChartTypographyUpdated,
        isError: isChartTypographyError,
    } = useUpdateChartTypography();
    const {
        mutate: updateChartColors,
        isSuccess: isChartColorsUpdated,
        isError: isChartColorsError,
    } = useUpdateChartColors();
    const {
        mutate: updateChartVisuals,
        isSuccess: isChartVisualsUpdated,
        isError: isChartVisualsError,
    } = useUpdateChartVisuals();

    const config = useAreaChartStore((state) => state);

    useEffect(() => {
        if (
            isAreaUpdated &&
            isChartBoxModelUpdated &&
            isChartColorsUpdated &&
            isChartTypographyUpdated &&
            isChartVisualsUpdated
        ) {
            toast.success("Chart settings saved successfully!", {
                description: "Your changes have been applied.",
            });
        }
    }, [
        isAreaUpdated,
        isChartBoxModelUpdated,
        isChartColorsUpdated,
        isChartTypographyUpdated,
        isChartVisualsUpdated,
    ]);

    useEffect(() => {
        if (
            isAreaError ||
            isChartBoxModelError ||
            isChartColorsError ||
            isChartTypographyError ||
            isChartVisualsError
        ) {
            toast.error("Failed to save chart settings.", {
                description: "Please try again later.",
            });
        }
    }, [
        isAreaError,
        isChartBoxModelError,
        isChartColorsError,
        isChartTypographyError,
        isChartVisualsError,
    ]);

    return (
        <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
                updateArea({
                    param: { id: chartId },
                    json: {
                        cumulativeEnabled: config.cumulativeEnabled,
                        omitZeroValuesEnabled: config.omitZeroValuesEnabled,
                        xAxisField: config.xAxisField,
                        xAxisSortOrder: config.xAxisSortOrder,
                        yAxisField: config.yAxisField,
                        yAxisSortOrder: config.yAxisSortOrder,
                        specificConfig: {
                            fill: config.fill,
                            strokeWidth: config.strokeWidth,
                            isAreaChart: config.isAreaChart,
                            lineStyle: config.lineStyle,
                            stackedEnabled: config.stackedEnabled,
                            xAxisEnabled: config.xAxisEnabled,
                            yAxisEnabled: config.yAxisEnabled,
                        },
                    },
                });

                updateChartBoxModel({
                    param: { id: chartId },
                    json: {
                        borderWidth: config.borderWidth,
                        marginBottom: config.marginBottom,
                        marginLeft: config.marginLeft,
                        marginRight: config.marginRight,
                        marginTop: config.marginTop,
                    },
                });

                updateChartColors({
                    param: { id: chartId },
                    json: {
                        backgroundColor: config.backgroundColor,
                        borderColor: config.borderColor,
                        colorPalette: config.colorPalette,
                        gridColor: config.gridColor,
                        labelColor: config.labelColor,
                        legendTextColor: config.legendTextColor,
                        tooltipBackgroundColor: config.tooltipBackgroundColor,
                        tooltipBorderColor: config.tooltipBorderColor,
                        tooltipSeparatorColor: config.tooltipSeparatorColor,
                        tooltipTextColor: config.tooltipTextColor,
                    },
                });

                updateChartTypography({
                    param: { id: chartId },
                    json: {
                        label: config.label,
                        labelAnchor: config.labelAnchor,
                        labelEnabled: config.labelEnabled,
                        labelFontFamily: config.labelFontFamily,
                        labelFontStyle: config.labelFontStyle,
                        labelSize: config.labelSize,
                        legendEnabled: config.legendEnabled,
                    },
                });

                updateChartVisuals({
                    param: { id: chartId },
                    json: {
                        gridEnabled: config.gridEnabled,
                        gridOrientation: config.gridOrientation,
                        gridStyle: config.gridStyle,
                        gridWidth: config.gridWidth,
                        tooltipBorderRadius: config.tooltipBorderRadius,
                        tooltipBorderWidth: config.tooltipBorderWidth,
                        tooltipEnabled: config.tooltipEnabled,
                        tooltipSeparatorEnabled: config.tooltipSeparatorEnabled,
                        tooltipStyle: config.tooltipStyle,
                        tooltipTotalEnabled: config.tooltipTotalEnabled,
                    },
                });
            }}
        >
            <Save />
        </Button>
    );
};
