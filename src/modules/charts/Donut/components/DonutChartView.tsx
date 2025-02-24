import { LabelList, RadialBar, RadialBarChart } from "recharts";
import { useMemo } from "react";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetDatabaseSchema } from "@/modules/notion/api/client/useGetDatabaseSchema";
import { useGetTableData } from "@/modules/notion/api/client/useGetTableData";

import { ChartViewComponentType } from "../../types";
import {
    useDonutChartAppearanceStore,
    useDonutChartConfigStore,
} from "../state/provider/donut-chart-store-provider";
import { getRadarChartData } from "../../utils/RadarChartDataConversion";
import { ChartViewWrapperComponent } from "../../components/ChartViewWrapperComponent";

export const DonutChartView: ChartViewComponentType = ({
    chartName,
    notion_table_id,
}) => {
    const { colors, showLegends, showToolTip, labelColor, showLabel, bgColor } =
        useDonutChartAppearanceStore((state) => state);

    const { xAxis } = useDonutChartConfigStore((state) => state);

    const { data: schema, isLoading: schemaLoading } =
        useGetDatabaseSchema(notion_table_id);
    const {
        data: tableData,
        error,
        isLoading: dataLoading,
    } = useGetTableData(notion_table_id);

    const { radarChartConfig, radarChartData } = useMemo(() => {
        if (!schema || !tableData?.data || !xAxis) {
            return { radarChartConfig: [], radarChartData: [] };
        }
        return getRadarChartData(tableData.data, schema, xAxis, "count");
    }, [schema, tableData, xAxis]);

    if (schemaLoading || dataLoading) {
        return (
            <ChartViewWrapperComponent
                bgColor={bgColor}
                labelColor={labelColor}
                showLabel={showLabel}
                label={chartName}
            >
                Loading...
            </ChartViewWrapperComponent>
        ); // TODO : improve Text and design
    }

    if (error || !schema || !tableData) {
        return (
            <ChartViewWrapperComponent
                bgColor={bgColor}
                labelColor={labelColor}
                showLabel={showLabel}
                label={chartName}
            >
                Error
            </ChartViewWrapperComponent>
        ); // TODO : improve Text and design
    }

    if (!schema) {
        return (
            <ChartViewWrapperComponent
                bgColor={bgColor}
                labelColor={labelColor}
                showLabel={showLabel}
                label={chartName}
            >
                No Data
            </ChartViewWrapperComponent>
        ); // TODO : improve Text and design
    }

    if (!xAxis) {
        return (
            <ChartViewWrapperComponent
                bgColor={bgColor}
                labelColor={labelColor}
                showLabel={showLabel}
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
            fill: colors[idx]
                ? `rgb(${colors[idx].r}, ${colors[idx].g}, ${colors[idx].b}`
                : "rgb(255, 255, 255)",
        };
    });

    return (
        <ChartViewWrapperComponent
            bgColor={bgColor}
            labelColor={labelColor}
            showLabel={showLabel}
            label={chartName}
        >
            <ChartContainer
                config={configData}
                className="mx-auto max-h-[500px] min-h-[270px] w-full break1200:min-h-[500px]"
            >
                <RadialBarChart data={data} innerRadius={40} outerRadius={120}>
                    {showToolTip && (
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
                        {showLegends && (
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
