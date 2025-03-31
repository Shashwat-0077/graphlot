"use client";
import { use } from "react";

import { decodeFromUrl } from "@/utils/pathSerialization";
import { useGetChartWithId } from "@/modules/charts/api/client/useGetChart";
import {
    ChartConfigComponentType,
    ChartViewComponentType,
    StateProviderType,
} from "@/modules/charts/types";
import { BarChartView } from "@/modules/charts/specificCharts/Bar/components/BarChartView";
import { BarConfig } from "@/modules/charts/specificCharts/Bar/components/BarConfig";
import { BarChartStoreProvider } from "@/modules/charts/specificCharts/Bar/state/provider/bar-chart-store-provider";
import { RadarChartView } from "@/modules/charts/specificCharts/Radar/components/RadarChartView";
import { RadarConfig } from "@/modules/charts/specificCharts/Radar/components/RadarConfig";
import { RadarChartStoreProvider } from "@/modules/charts/specificCharts/Radar/state/provider/radar-chart-store-provider";
import { AreaChartStoreProvider } from "@/modules/charts/specificCharts/Area/state/provider/area-chart-store-provider";
import { AreaConfig } from "@/modules/charts/specificCharts/Area/components/AreaConfig";
import { AreaChartView } from "@/modules/charts/specificCharts/Area/components/AreaChartView";
import { DonutChartView } from "@/modules/charts/specificCharts/Donut/components/DonutChartView";
import { DonutConfig } from "@/modules/charts/specificCharts/Donut/components/DonutConfig";
import { DonutChartStoreProvider } from "@/modules/charts/specificCharts/Donut/state/provider/donut-chart-store-provider";
import { HeatmapChartStoreProvider } from "@/modules/charts/specificCharts/Heatmap/state/provider/heatmap-store-provider";
import { HeatmapConfig } from "@/modules/charts/specificCharts/Heatmap/components/HeatmapConfig";
import { HeatmapChartView } from "@/modules/charts/specificCharts/Heatmap/components/HeatmapChartView";

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

    const chartPathObj = decodeFromUrl(encoded_chart_id);
    const collectionPathObj = decodeFromUrl(encoded_collection_id);

    const {
        data: chartData,
        isLoading: isChartLoading,
        error: chartError,
    } = useGetChartWithId(chartPathObj ? chartPathObj.path : "");

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
        Heatmap: [HeatmapChartView, HeatmapConfig, HeatmapChartStoreProvider],
    };

    const [ChartView, ChartConfig, StoreProvider] = chartComponents[
        chart.type
    ] || [RadarChartView, RadarConfig, RadarChartStoreProvider];

    return (
        <StoreProvider>
            <ChartView
                notion_table_id={chart.notion_database_id}
                chartName={chart.name}
            />

            <div>
                <ChartConfig notion_table_id={chart.notion_database_id} />
            </div>
        </StoreProvider>
    );
}
