"use client";

import { useParams } from "next/navigation";

import { parseSlug } from "@/utils";
import { useGetChart } from "@/modules/chart-attributes/api/client";
import {
    CHART_TYPE_AREA,
    ChartConfigComponent,
    ChartStateProvider,
    ChartViewComponent,
} from "@/constants";
import { authClient } from "@/modules/auth/client";
import { SimpleLoader } from "@/components/ui/simple-loader";
import { AreaChartView } from "@/modules/chart-types/area/components/area-chart-view";
import { AreaChartConfig } from "@/modules/chart-types/area/components/edit/area-config";
import { AreaChartStoreProvider } from "@/modules/chart-types/area/store";

export default function ChatConfigs() {
    const { chart_slug, collection_slug } = useParams<{
        chart_slug: string;
        collection_slug: string;
    }>();

    const { id: chart_id } = parseSlug(chart_slug);
    const { id: collection_id } = parseSlug(collection_slug);

    const {
        data: chart,
        isLoading: isChartLoading,
        error: chartError,
    } = useGetChart({ params: { id: chart_id } });

    const { data: session, isPending: isAuthLoading } = authClient.useSession();

    if (!chart_id) {
        return <div>Invalid Chart ID</div>;
    }

    if (!collection_id) {
        return <div>Invalid Collection ID</div>;
    }

    if (isChartLoading || isAuthLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <SimpleLoader />
            </div>
        );
    }

    if (chartError || !chart || !session || !session.user) {
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
        [CHART_TYPE_AREA]: [
            AreaChartView,
            AreaChartConfig,
            AreaChartStoreProvider,
        ],
        // [CHART_TYPE_BAR]: [BarChartView, BarChartConfig, BarChartStoreProvider],
        // [CHART_TYPE_RADAR]: [
        //     RadarChartView,
        //     RadarChartConfig,
        //     RadarChartStoreProvider,
        // ],
        // [CHART_TYPE_RADIAL]: [
        //     RadialChartView,
        //     RadialChartConfig,
        //     RadialChartStoreProvider,
        // ],
        // [CHART_TYPE_HEATMAP]: [
        //     HeatmapChartView,
        //     HeatmapConfig,
        //     HeatmapChartStoreProvider,
        // ],
    };

    const [ChartView, ChartConfig, StoreProvider] = chartComponents[chart.type];

    return (
        <StoreProvider chartId={chart_id}>
            {/* <ChartView chartName={chart.name} userId={user_id} /> */}
            <div className="px-4 py-4">
                <ChartView chartId={chart_id} userId={user_id} />
                <ChartConfig chartId={chart_id} userId={user_id} />
            </div>
        </StoreProvider>
    );
}
