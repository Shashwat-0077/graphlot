"use client";
import { use } from "react";

import { AreaChartConfig } from "@/modules/Area/components/AreaChartConfig";
import { AreaChartStoreProvider } from "@/modules/Area/store";
import { useChartMetadataById } from "@/modules/Chart/api/client/use-chart";
import { parseSlug } from "@/utils/pathSlugsOps";
import { SimpleLoader } from "@/components/ui/Loader";
import { useAuthSession } from "@/hooks/use-auth-session";
import { ChartConfigStoreProvider } from "@/modules/Chart/store";
import { AreaChartView } from "@/modules/Area/components/AreaChartView";
import {
    CHART_TYPE_AREA,
    CHART_TYPE_BAR,
    CHART_TYPE_HEATMAP,
    CHART_TYPE_RADAR,
    CHART_TYPE_RADIAL,
    ChartConfigComponent,
    ChartStateProvider,
    ChartViewComponent,
} from "@/constants";
import { BarChartView } from "@/modules/Bar/components/BarChartView";
import { BarChartConfig } from "@/modules/Bar/components/BarChartConfig";
import { BarChartStoreProvider } from "@/modules/Bar/store";
import { RadarChartView } from "@/modules/Radar/components/RadarChartView";
import { RadarChartConfig } from "@/modules/Radar/components/RadarChartConfig";
import { RadarChartStoreProvider } from "@/modules/Radar/store";
import { RadialChartView } from "@/modules/Radial/components/RadialChartView";
import { RadialChartConfig } from "@/modules/Radial/components/RadialConfig";
import { RadialChartStoreProvider } from "@/modules/Radial/store";
import { HeatmapChartView } from "@/modules/Heatmap/components/HeatmapChartView";
import { HeatmapChartStoreProvider } from "@/modules/Heatmap/store";
import { HeatmapConfig } from "@/modules/Heatmap/components/heatmapConfig";

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
        data: chart,
        isLoading: isChartLoading,
        error: chartError,
    } = useChartMetadataById(chart_id);

    const { session, isAuthenticated, isLoading } = useAuthSession();

    if (!chart_id) {
        return <div>Invalid Chart ID</div>;
    }

    if (!collection_id) {
        return <div>Invalid Collection ID</div>;
    }

    if (isChartLoading || isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <SimpleLoader />
            </div>
        );
    }

    if (chartError || !chart || !isAuthenticated || !session || !session.user) {
        return (
            <div>
                Error:{" "}
                {chartError?.message ||
                    "Chart not found or user not authenticated"}
            </div>
        );
    }

    const user_id = session?.user.id;

    if (!user_id) {
        return <div>Invalid User ID</div>;
    }

    const chartComponents: {
        [key: string]: [
            ChartViewComponent,
            ChartConfigComponent,
            ChartStateProvider,
        ];
    } = {
        [CHART_TYPE_BAR]: [BarChartView, BarChartConfig, BarChartStoreProvider],
        [CHART_TYPE_RADAR]: [
            RadarChartView,
            RadarChartConfig,
            RadarChartStoreProvider,
        ],
        [CHART_TYPE_AREA]: [
            AreaChartView,
            AreaChartConfig,
            AreaChartStoreProvider,
        ],
        [CHART_TYPE_RADIAL]: [
            RadialChartView,
            RadialChartConfig,
            RadialChartStoreProvider,
        ],
        [CHART_TYPE_HEATMAP]: [
            HeatmapChartView,
            HeatmapConfig,
            HeatmapChartStoreProvider,
        ],
    };

    const [ChartView, ChartConfig, StoreProvider] = chartComponents[chart.type];

    return (
        <ChartConfigStoreProvider chartId={chart_id}>
            <StoreProvider chartId={chart_id}>
                {/* <ChartView chartName={chart.name} userId={user_id} /> */}
                <div className="px-4 py-4">
                    <ChartView chartId={chart_id} userId={user_id} />
                    <ChartConfig chartId={chart_id} userId={user_id} />
                </div>
            </StoreProvider>
        </ChartConfigStoreProvider>
    );
}
