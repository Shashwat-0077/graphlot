"use client";
import { use } from "react";

import { decodeFromUrl } from "@/utils/pathSerialization";
import { RadarChartView } from "@/modules/charts/Radar/components/RadarChartView";
import { useGetChartWithId } from "@/modules/charts/api/client/useGetChartWithId";
import { RadarConfig } from "@/modules/charts/Radar/components/RadarConfig";
import { BarChartView } from "@/modules/charts/Bar/components/BarChartView";
import { BarConfig } from "@/modules/charts/Bar/components/BarConfig";
import {
    ChartConfigComponentType,
    ChartViewComponentType,
    StateProviderType,
} from "@/modules/charts/types";
import { BarChartStoreProvider } from "@/modules/charts/Bar/state/provider/bar-chart-store-provider";
import { RadarChartStoreProvider } from "@/modules/charts/Radar/state/provider/radar-chart-store-provider";
import { AreaChartStoreProvider } from "@/modules/charts/Area/state/provider/area-chart-store-provider";
import { AreaConfig } from "@/modules/charts/Area/components/AreaConfig";
import { AreaChartView } from "@/modules/charts/Area/components/AreaChartView";
import { DonutChartStoreProvider } from "@/modules/charts/Donut/state/provider/donut-chart-store-provider";
import { DonutConfig } from "@/modules/charts/Donut/components/DonutConfig";
import { DonutChartView } from "@/modules/charts/Donut/components/DonutChartView";

type Props = {
    params: Promise<{
        id: string;
        chart_id: string;
        collection_id: string;
    }>;
};

// eslint-disable-next-line
const chartViews: Record<string, any> = {
    Bar: BarChartView,
    Radar: RadarChartView,
    // area: AreaChartView,
    // heatmap: HeatMapChartView,
    // donut: DonutChartView,
};

// eslint-disable-next-line
const chartConfigs: Record<string, any> = {
    Bar: BarConfig,
    Radar: RadarConfig,
    // area: AreaConfig,
    // heatmap: HeatMapConfig,
    // donut: DonutConfig,
};

export default function ChatConfigs({ params }: Props) {
    const { chart_id: encoded_chart_id, collection_id: encoded_collection_id } =
        use(params);

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

    const chartComponents: {
        [key: string]: [
            ChartViewComponentType,
            ChartConfigComponentType,
            StateProviderType,
        ];
    } = {
        Bar: [BarChartView, BarConfig, BarChartStoreProvider],
        Radar: [RadarChartView, RadarConfig, RadarChartStoreProvider],
        Area: [AreaChartView, AreaConfig, AreaChartStoreProvider],
        Donut: [DonutChartView, DonutConfig, DonutChartStoreProvider],
        // Heatmap: [HeatMapChartView, HeatmapConfig],
    };

    const [ChartView, ChartConfig, StoreProvider] = chartComponents[
        chart.type
    ] || [RadarChartView, RadarConfig, RadarChartStoreProvider];

    return (
        <section>
            <StoreProvider>
                <ChartView
                    notion_table_id={chart.notion_database_id}
                    chartName={chart.name}
                />

                <div>
                    <ChartConfig notion_table_id={chart.notion_database_id} />
                </div>
            </StoreProvider>
        </section>
    );
}
