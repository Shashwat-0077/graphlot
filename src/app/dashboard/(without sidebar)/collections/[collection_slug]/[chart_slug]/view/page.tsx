"use client";
import { use } from "react";
import { useSearchParams } from "next/navigation";

import { ChartViewComponentType, StateProviderType } from "@/constants";
import { AreaChartView } from "@/modules/Area/components/AreaChartView";
import { AreaChartStoreProvider } from "@/modules/Area/store";
import { BarChartView } from "@/modules/Bar/components/BarChartView";
import { BarChartStoreProvider } from "@/modules/Bar/store";
import { useGetChartWithId } from "@/modules/Chart/api/client/use-chart";
import { DonutChartView } from "@/modules/Radial/components/RadialChartView";
import { DonutChartStoreProvider } from "@/modules/Radial/store";
import { HeatmapChartView } from "@/modules/Heatmap/components/HeatmapChartView";
import { HeatmapChartStoreProvider } from "@/modules/Heatmap/store";
import { RadarChartView } from "@/modules/Radar/components/RadarChartView";
import { RadarChartStoreProvider } from "@/modules/Radar/store";
import { parseSlug } from "@/utils/pathSlugsOps";
import { SimpleLoader } from "@/components/ui/Loader";

type Props = {
    params: Promise<{
        chart_slug: string;
        collection_slug: string;
    }>;
};

export default function ChatConfigs({ params }: Props) {
    const { chart_slug, collection_slug } = use(params);
    const searchParams = useSearchParams();
    const user_id = searchParams.get("user_id");

    const { id: chart_id } = parseSlug(chart_slug);
    const { id: collection_id } = parseSlug(collection_slug);

    const {
        data: chartData,
        isLoading: isChartLoading,
        error: chartError,
    } = useGetChartWithId(chart_id);

    if (!user_id) {
        return <div>Invalid User ID</div>;
    }

    if (!chart_id) {
        return <div>Invalid Chart ID</div>;
    }

    if (!collection_id) {
        return <div>Invalid Collection ID</div>;
    }

    if (isChartLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <SimpleLoader />
            </div>
        );
    }

    if (chartError || !chartData) {
        return <div>Error: {chartError?.message}</div>;
    }

    const { chart } = chartData;

    const chartComponents: {
        [key: string]: [ChartViewComponentType, StateProviderType];
    } = {
        Bar: [BarChartView, BarChartStoreProvider],
        Radar: [RadarChartView, RadarChartStoreProvider],
        Area: [AreaChartView, AreaChartStoreProvider],
        Donut: [DonutChartView, DonutChartStoreProvider],
        Heatmap: [HeatmapChartView, HeatmapChartStoreProvider],
    };

    const [ChartView, StoreProvider] = chartComponents[chart.type] || [
        RadarChartView,
        RadarChartStoreProvider,
    ];

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <StoreProvider char_id={chart_id}>
                <ChartView
                    notion_table_id={chart.notion_database_id}
                    chartName={chart.name}
                    user_id={user_id}
                />
            </StoreProvider>
        </div>
    );
}
