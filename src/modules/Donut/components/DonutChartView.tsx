import { LabelList, RadialBar, RadialBarChart } from "recharts";
import { useMemo } from "react";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetDatabaseSchema } from "@/modules/notion/api/client/useGetDatabaseSchema";
import { useGetTableData } from "@/modules/notion/api/client/useGetTableData";
import { useDonutChartStore } from "@/modules/Donut/store";
import { processChartData } from "@/utils/processChartData";
import { ChartViewWrapper } from "@/modules/BasicChart/components/ChartViewWrapperComponent";
import { ChartViewComponentType } from "@/constants";
import { WavyLoader } from "@/components/ui/Loader";
import { getRGBAString } from "@/utils/colors";

export const DonutChartView: ChartViewComponentType = ({
    chartName,
    notion_table_id,
}) => {
    const {
        x_axis,
        color_palette,
        background_color,
        text_color,
        label_enabled,
        tooltip_enabled,
        legend_enabled,
    } = useDonutChartStore((state) => state);

    const { data: schema, isLoading: schemaLoading } =
        useGetDatabaseSchema(notion_table_id);
    const {
        data: tableData,
        error,
        isLoading: dataLoading,
    } = useGetTableData(notion_table_id);

    const { radarChartConfig, radarChartData } = useMemo(() => {
        if (!schema || !tableData?.data || !x_axis) {
            return { radarChartConfig: [], radarChartData: [] };
        }
        return processChartData(tableData.data, schema, x_axis, "count");
    }, [schema, tableData, x_axis]);

    // Loading state
    if (schemaLoading || dataLoading) {
        return (
            <ChartViewWrapper
                bgColor={background_color}
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
    if (error || !schema || !tableData) {
        return (
            <ChartViewWrapper
                bgColor={background_color}
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

    // No schema state
    if (!schema) {
        return (
            <ChartViewWrapper
                bgColor={background_color}
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
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M3 9h18" />
                            <path d="M9 21V9" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold">No Data Available</h3>
                    <p className="max-w-[250px] text-sm text-muted-foreground">
                        No schema data found. Please connect a valid database.
                    </p>
                </div>
            </ChartViewWrapper>
        );
    }

    // No axis selected state
    if (!x_axis) {
        return (
            <ChartViewWrapper
                bgColor={background_color}
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

    for (let idx = 0; idx < radarChartConfig.length; idx++) {
        const data_label = radarChartConfig[idx];
        configData[data_label] = {
            label:
                data_label[0].toUpperCase() + data_label.slice(1).toLowerCase(),
        };
    }

    const data = radarChartData.map((data, idx) => {
        configData[data.class] = {
            label: data.class,
        };
        return {
            ...data,
            fill: color_palette[idx]
                ? `rgb(${color_palette[idx].r}, ${color_palette[idx].g}, ${color_palette[idx].b}`
                : "rgb(255, 255, 255)",
        };
    });

    return (
        <ChartViewWrapper bgColor={background_color}>
            <ChartContainer
                config={configData}
                className="mx-auto max-h-[500px] min-h-[270px] w-full break1200:min-h-[500px]"
            >
                <RadialBarChart data={data} innerRadius={40} outerRadius={120}>
                    {label_enabled && (
                        <text
                            x="50%"
                            y={40}
                            style={{
                                fontSize: 36,
                                fontWeight: "bold",
                                fill: getRGBAString(text_color),
                            }}
                            width={200}
                            textAnchor="middle"
                        >
                            {chartName}
                        </text>
                    )}
                    {tooltip_enabled && (
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    nameKey="class"
                                />
                            }
                        />
                    )}
                    <RadialBar dataKey="count" background cornerRadius={10}>
                        {legend_enabled && (
                            <LabelList
                                position="insideStart"
                                dataKey="class"
                                className="fill-white capitalize mix-blend-luminosity"
                                fontSize={11}
                            />
                        )}
                    </RadialBar>
                </RadialBarChart>
            </ChartContainer>
        </ChartViewWrapper>
    );
};
