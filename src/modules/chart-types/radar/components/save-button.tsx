"use client";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    useUpdateChartBoxModel,
    useUpdateChartColors,
    useUpdateChartTypography,
    useUpdateChartVisuals,
} from "@/modules/chart-attributes/api/client";
import { useUpdateRadar } from "@/modules/chart-types/radar/api/client";
import { useRadarChartStore } from "@/modules/chart-types/radar/store";

export const RadarSaveButton = ({ chartId }: { chartId: string }) => {
    const {
        mutate: updateRadar,
        isSuccess: isRadarUpdated,
        isError: isRadarError,
    } = useUpdateRadar();
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

    const config = useRadarChartStore((state) => state);

    useEffect(() => {
        if (
            isRadarUpdated &&
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
        isRadarUpdated,
        isChartBoxModelUpdated,
        isChartColorsUpdated,
        isChartTypographyUpdated,
        isChartVisualsUpdated,
    ]);

    useEffect(() => {
        if (
            isRadarError ||
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
        isRadarError,
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
                updateRadar({
                    param: { id: chartId },
                    json: {
                        cumulativeEnabled: config.cumulativeEnabled,
                        omitZeroValuesEnabled: config.omitZeroValuesEnabled,
                        xAxisField: config.xAxisField,
                        xAxisSortOrder: config.xAxisSortOrder,
                        yAxisField: config.yAxisField,
                        yAxisSortOrder: config.yAxisSortOrder,
                        specificConfig: {
                            strokeWidth: config.strokeWidth,
                            xAxisEnabled: config.xAxisEnabled,
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
