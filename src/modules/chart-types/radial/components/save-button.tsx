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
import { useUpdateRadial } from "@/modules/chart-types/radial/api/client";
import { useRadialChartStore } from "@/modules/chart-types/radial/store";

export const RadialSaveButton = ({ chartId }: { chartId: string }) => {
    const {
        mutate: updateRadial,
        isSuccess: isRadialUpdated,
        isError: isRadialError,
    } = useUpdateRadial();
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

    const config = useRadialChartStore((state) => state);

    useEffect(() => {
        if (
            isRadialUpdated &&
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
        isRadialUpdated,
        isChartBoxModelUpdated,
        isChartColorsUpdated,
        isChartTypographyUpdated,
        isChartVisualsUpdated,
    ]);

    useEffect(() => {
        if (
            isRadialError ||
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
        isRadialError,
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
                updateRadial({
                    param: { id: chartId },
                    json: {
                        omitZeroValuesEnabled: config.omitZeroValuesEnabled,
                        xAxisField: config.xAxisField,
                        xAxisSortOrder: config.xAxisSortOrder,
                        yAxisField: config.yAxisField,
                        yAxisSortOrder: config.yAxisSortOrder,
                        specificConfig: {
                            borderRadius: config.borderRadius,
                            endAngle: config.endAngle,
                            gap: config.gap,
                            innerRadius: config.innerRadius,
                            outerRadius: config.outerRadius,
                            startAngle: config.startAngle,
                            trackColor: config.trackColor,
                            trackEnabled: config.trackEnabled,
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
