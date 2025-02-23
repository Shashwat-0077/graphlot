"use client";
import { use } from "react";

import { decodeFromUrl } from "@/utils/pathSerialization";
import { RadarChartView } from "@/modules/charts/components/ChartsView/RadarChartView";
import { useChartAppearanceStore } from "@/providers/chart-store-provider";
import { useGetChartWithId } from "@/modules/charts/api/client/useGetChartWithId";
import RadarConfig from "@/modules/charts/components/ChartConfigs/RadarConfig";

type Props = {
    params: Promise<{
        id: string;
        chart_id: string;
        collection_id: string;
    }>;
};

export default function ChatConfigs({ params }: Props) {
    const { chart_id: encoded_chart_id, collection_id: encoded_collection_id } =
        use(params);

    const { bgColor, showLabel, labelColor } = useChartAppearanceStore(
        (state) => state
    );

    const chartPathObj = decodeFromUrl(encoded_chart_id);
    const collectionPathObj = decodeFromUrl(encoded_collection_id);

    const {
        data: chartData,
        isLoading: isChartLoading,
        error: chartError,
    } = useGetChartWithId(
        chartPathObj ? chartPathObj.path : "",
        collectionPathObj ? collectionPathObj.path : ""
    );

    if (!chartPathObj) {
        return <div>Invalid Chart ID</div>;
    }

    if (!collectionPathObj) {
        return <div>Invalid Collection ID</div>;
    }

    if (isChartLoading) {
        return <div>Loading...</div>;
    }

    if (chartError || !chartData) {
        return <div>Error: {chartError?.message}</div>;
    }

    const { chart } = chartData;

    return (
        <section>
            <div
                className="flex flex-col items-center justify-center rounded-xl border pb-14 pt-7"
                style={{
                    backgroundColor: `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})`,
                }}
            >
                <h1
                    className="text-2xl font-bold"
                    style={{
                        color: `rgba(${labelColor.r}, ${labelColor.g}, ${labelColor.b}, ${labelColor.a})`,
                    }}
                >
                    {showLabel ? (
                        chart.name[0].toUpperCase() + chart.name.slice(1)
                    ) : (
                        <>&nbsp;</>
                    )}
                </h1>

                <RadarChartView notion_table_id={chart.notion_database_id} />
            </div>

            <div>
                <RadarConfig
                    chartType={chart.type}
                    notion_table_id={chart.notion_database_id}
                />
            </div>
        </section>
    );
}
