"use client";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useHeatmapStore } from "@/modules/chart-types/heatmap/store";
import { useUpdateHeatmap } from "@/modules/chart-types/heatmap/api/client";

export const HeatmapSaveButton = ({ chartId }: { chartId: string }) => {
    const {
        mutate: updateHeatmap,
        isSuccess: isHeatmapUpdated,
        isError: isHeatmapError,
    } = useUpdateHeatmap({});

    const config = useHeatmapStore((state) => state);

    useEffect(() => {
        if (isHeatmapUpdated) {
            toast.success("Chart settings saved successfully!", {
                description: "Your changes have been applied.",
            });
        }
    }, [isHeatmapUpdated]);

    useEffect(() => {
        if (isHeatmapError) {
            toast.error("Failed to save chart settings.", {
                description: "Please try again later.",
            });
        }
    }, [isHeatmapError]);

    return (
        <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
                updateHeatmap({
                    param: { id: chartId },
                    json: {
                        accent: config.accent,
                        averageOfAllEntries: config.averageOfAllEntries,
                        backgroundColor: config.backgroundColor,
                        borderEnabled: config.borderEnabled,
                        boxBorderRadius: config.boxBorderRadius,
                        buttonHoverEnabled: config.buttonHoverEnabled,
                        dateField: config.dateField,
                        defaultBoxColor: config.defaultBoxColor,
                        labelEnabled: config.labelEnabled,
                        legendEnabled: config.legendEnabled,
                        longestStreak: config.longestStreak,
                        metric: config.metric,
                        numberOfEntries: config.numberOfEntries,
                        streak: config.streak,
                        sumOfAllEntries: config.sumOfAllEntries,
                        textColor: config.textColor,
                        tooltipEnabled: config.tooltipEnabled,
                        valueField: config.valueField,
                    },
                });
            }}
        >
            <Save />
        </Button>
    );
};
