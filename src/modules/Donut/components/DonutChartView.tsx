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
import { ChartViewWrapperComponent } from "@/modules/BasicChart/components/ChartViewWrapperComponent";
import { ChartViewComponentType } from "@/constants";
import { WavyLoader } from "@/components/ui/Loader";

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

    if (schemaLoading || dataLoading) {
        return (
            <ChartViewWrapperComponent
                bgColor={background_color}
                labelColor={text_color}
                showLabel={label_enabled}
                label={chartName}
            >
                <WavyLoader />
            </ChartViewWrapperComponent>
        ); // TODO : improve Text and design
    }

    if (error || !schema || !tableData) {
        return (
            <ChartViewWrapperComponent
                bgColor={background_color}
                labelColor={text_color}
                showLabel={label_enabled}
                label={chartName}
            >
                Error
            </ChartViewWrapperComponent>
        ); // TODO : improve Text and design
    }

    if (!schema) {
        return (
            <ChartViewWrapperComponent
                bgColor={background_color}
                labelColor={text_color}
                showLabel={label_enabled}
                label={chartName}
            >
                No Data
            </ChartViewWrapperComponent>
        ); // TODO : improve Text and design
    }

    if (!x_axis) {
        return (
            <ChartViewWrapperComponent
                bgColor={background_color}
                labelColor={text_color}
                showLabel={label_enabled}
                label={chartName}
            >
                Select X Axis
            </ChartViewWrapperComponent>
        ); // TODO : improve Text and design
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
        <ChartViewWrapperComponent
            bgColor={background_color}
            labelColor={text_color}
            showLabel={label_enabled}
            label={chartName}
        >
            <ChartContainer
                config={configData}
                className="mx-auto max-h-[500px] min-h-[270px] w-full break1200:min-h-[500px]"
            >
                <RadialBarChart data={data} innerRadius={40} outerRadius={120}>
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
        </ChartViewWrapperComponent>
    );
};
