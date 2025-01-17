"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useChartConfigStore } from "@/components/providers/ChartConfigStoreProvider";
import { data } from "@/coverage/data";

import { useGetDatabaseSchema } from "../../api/useGetDatabaseSchema";

const configData: string[] = ["count"];

export const RadarChartView = () => {
    // TODO : make that the data in the config View stays for 30 mins (stale time) but the data in the chart view should be live

    const {
        colors,
        showLegends,
        showGrid,
        showToolTip,
        gridColor,
        XAxis,
        YAxis,
    } = useChartConfigStore((state) => state);

    const { data: schema, isLoading } = useGetDatabaseSchema();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!schema) {
        return <div>No Data</div>;
    }

    if (!XAxis || !YAxis) {
        return <div>Select X and Y Axis</div>;
    }

    // const configData: string[] = [];

    // const XAxisDetails = schema[XAxis];
    const YAxisDetails = schema[YAxis];
    let RadarChartData: {
        count: number;
        class: string;
    }[] = [];
    let classes = [];
    switch (YAxisDetails["type"]) {
        case "status":
            classes = YAxisDetails["status"]["options"];
            for (const itemClass of classes) {
                RadarChartData.push({
                    class: itemClass.name,
                    count: 0,
                });
            }

            for (const item of data) {
                // @ts-expect-error - something // TODO : Write a better comment
                if (item[YAxis] === null) {
                    continue;
                }

                for (const r_data of RadarChartData) {
                    // @ts-expect-error - something // TODO : Write a better comment
                    if (r_data.class === item[YAxis].name) {
                        r_data.count++;
                    }
                }
            }
            break;
        case "select":
            classes = YAxisDetails["select"]["options"];
            for (const itemClass of classes) {
                RadarChartData.push({
                    class: itemClass.name,
                    count: 0,
                });
            }

            for (const item of data) {
                // @ts-expect-error - something // TODO : Write a better comment
                if (item[YAxis] === null) {
                    continue;
                }

                for (const r_data of RadarChartData) {
                    // @ts-expect-error - something // TODO : Write a better comment
                    if (r_data.class === item[YAxis].name) {
                        r_data.count++;
                    }
                }
            }
            break;

        case "multi_select":
            classes = YAxisDetails["multi_select"]["options"];
            console.log(classes);
            const rawData: typeof RadarChartData = [];
            for (const itemClass of classes) {
                rawData.push({
                    class: itemClass.name,
                    count: 0,
                });
            }

            for (const item of data) {
                // @ts-expect-error - something // TODO : Write a better comment
                if (item[YAxis] === null) {
                    continue;
                }

                // @ts-expect-error - something // TODO : Write a better comment
                for (const items_item of item[YAxis]) {
                    for (const r_data of rawData) {
                        if (r_data.class === items_item.name) {
                            r_data.count++;
                        }
                    }
                }
            }

            RadarChartData = rawData.filter((item) => item.count > 0);

            break;
    }

    // TODO : Show disclaimer message to user if the data is more than 8 and say that only 8 data will be shown for bigger datasets to avoid clutter, and provider link to the full dataset chart their, it will be on different page
    if (RadarChartData.length > 8) {
        RadarChartData.splice(8);
    }

    console.log(RadarChartData);
    let colorIndex = 0;
    const RadarChartConfig: {
        [key: string]: { label: string; color: string };
    } = {};

    for (const data_label of configData) {
        RadarChartConfig[data_label] = {
            label: data_label,
            color: colors[colorIndex]
                ? `rgba(${colors[colorIndex].r}, ${colors[colorIndex].g}, ${colors[colorIndex].b}, ${colors[colorIndex].a})`
                : "rgba(255, 255, 255, 0.5)",
        };
        colorIndex++;
    }

    return (
        <ChartContainer
            config={RadarChartConfig}
            // TODO : make size responsive
            className="mx-auto min-h-[270px]"
        >
            <RadarChart
                data={RadarChartData}
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

                {configData.map((data_label) => (
                    <Radar
                        key={data_label}
                        dataKey={data_label}
                        fill={RadarChartConfig[data_label].color}
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
