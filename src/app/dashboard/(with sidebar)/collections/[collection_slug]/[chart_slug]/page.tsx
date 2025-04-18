"use client";
import { use } from "react";

import {
    ChartConfigComponentType,
    ChartViewComponentType,
    StateProviderType,
} from "@/constants";
import { AreaChartView } from "@/modules/Area/components/AreaChartView";
import { AreaConfig } from "@/modules/Area/components/AreaConfig";
import { AreaChartStoreProvider } from "@/modules/Area/store";
import { BarChartView } from "@/modules/Bar/components/BarChartView";
import { BarConfig } from "@/modules/Bar/components/BarConfig";
import { BarChartStoreProvider } from "@/modules/Bar/store";
import { useGetChartWithId } from "@/modules/BasicChart/api/client/useGetChart";
import { DonutChartView } from "@/modules/Donut/components/DonutChartView";
import { DonutConfig } from "@/modules/Donut/components/DonutConfig";
import { DonutChartStoreProvider } from "@/modules/Donut/store";
import { HeatmapChartView } from "@/modules/Heatmap/components/HeatmapChartView";
import { HeatmapConfig } from "@/modules/Heatmap/components/HeatmapConfig";
import { HeatmapChartStoreProvider } from "@/modules/Heatmap/store";
import { RadarChartView } from "@/modules/Radar/components/RadarChartView";
import { RadarConfig } from "@/modules/Radar/components/RadarConfig";
import { RadarChartStoreProvider } from "@/modules/Radar/store";
import { parseSlug } from "@/utils/pathSlugsOps";
import { BoxLoader } from "@/components/ui/Loader";

type Props = {
    params: Promise<{
        chart_slug: string;
        collection_slug: string;
    }>;
};

export default function ChatConfigs({ params }: Props) {
    const { chart_slug, collection_slug } = use(params);

    const { id: chart_id } = parseSlug(chart_slug);
    const { id: collection_id } = parseSlug(collection_slug);

    const {
        data: chartData,
        isLoading: isChartLoading,
        error: chartError,
    } = useGetChartWithId(chart_id);

    if (!chart_id) {
        return <div>Invalid Chart ID</div>;
    }

    if (!collection_id) {
        return <div>Invalid Collection ID</div>;
    }

    if (isChartLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <BoxLoader />
            </div>
        );
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
