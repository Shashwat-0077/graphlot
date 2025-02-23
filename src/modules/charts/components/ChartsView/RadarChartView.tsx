"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { getRadarChartData } from "@/modules/charts/utils/RadarChartDataConversion";
import { useGetDatabaseSchema } from "@/modules/notion/api/client/useGetDatabaseSchema";
import {
    useChartAppearanceStore,
    useChartConfigStore,
} from "@/providers/chart-store-provider";
import { useGetTableData } from "@/modules/notion/api/client/useGetTableData";
import { useMemo } from "react";

export const RadarChartView = ({
    notion_table_id,
}: {
    notion_table_id: string;
}) => {
    // TODO : make that the data in the config View stays for 30 mins (stale time) but the data in the chart view should be live

    const { colors, showLegends, showGrid, showToolTip, gridColor } =
        useChartAppearanceStore((state) => state);

    const { xAxis, yAxis } = useChartConfigStore((state) => state);

    const { data: schema, isLoading: schemaLoading } =
        useGetDatabaseSchema(notion_table_id);
    const {
        data: tableData,
        error,
        isLoading: dataLoading,
    } = useGetTableData(notion_table_id);

    const { radarChartConfig, radarChartData } = useMemo(() => {
        if (!schema || !tableData?.data || !xAxis || !yAxis) {
            return { radarChartConfig: [], radarChartData: [] };
        }
        return getRadarChartData(tableData.data, schema, xAxis, yAxis);
    }, [schema, tableData, xAxis, yAxis]);

    // TODO : Show disclaimer message to user if the data is more than 8 and say that only 8 data will be shown for bigger datasets to avoid clutter, and provider link to the full dataset chart their, it will be on different page
    const limitedRadarChartData = useMemo(() => {
        return radarChartData.length > 8
            ? radarChartData.slice(0, 8)
            : radarChartData;
    }, [radarChartData]);

    if (schemaLoading || dataLoading) {
        return <div>Loading...</div>; // TODO : improve Text and design
    }

    if (error || !schema || !tableData) {
        return <div>Error</div>; // TODO : improve Text and design
    }

    if (!schema) {
        return <div>No Data</div>; // TODO : improve Text and design
    }

    if (!xAxis || !yAxis) {
        return <div>Select X and Y Axis</div>; // TODO : improve Text and design
    }

    const configData: {
        [key: string]: { label: string; color: string; alpha: number };
    } = {};

    for (let idx = 0; idx < radarChartConfig.length; idx++) {
        const data_label = radarChartConfig[idx];
        configData[data_label] = {
            label:
                data_label[0].toUpperCase() + data_label.slice(1).toLowerCase(),
            color: colors[idx]
                ? `rgb(${colors[idx].r}, ${colors[idx].g}, ${colors[idx].b}`
                : "rgb(255, 255, 255)",
            alpha: colors[idx]
                ? colors[idx].a
                : Math.min(1 / radarChartConfig.length, 0.5),
        };
    }

    return (
        <ChartContainer
            config={configData}
            // TODO : make size responsive
            className="mx-auto min-h-[270px] break1200:min-h-[500px]"
        >
            <RadarChart
                data={limitedRadarChartData}
                margin={{
                    top: -40,
                    bottom: -10,
                }}
            >
                {showToolTip && (
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                )}
                <PolarAngleAxis dataKey="class" />
                {showGrid && (
                    <PolarGrid
                        stroke={`rgba(${gridColor.r}, ${gridColor.g}, ${gridColor.b}, ${gridColor.a})`}
                        fill={`rgba(${gridColor.r}, ${gridColor.g}, ${gridColor.b}, ${gridColor.a})`}
                    />
                )}

                {radarChartConfig.map((data_label) => (
                    <Radar
                        key={data_label}
                        dataKey={data_label}
                        fill={configData[data_label].color}
                        fillOpacity={configData[data_label].alpha}
                        dot={{
                            r: 4,
                            fillOpacity: 1,
                        }}
                        strokeWidth={0.2}
                        stroke={configData[data_label].color}
                    />
                ))}

                {showLegends ? (
                    <ChartLegend
                        className="mt-8"
                        content={<ChartLegendContent />}
                    />
                ) : (
                    ""
                )}
            </RadarChart>
        </ChartContainer>
    );
};
