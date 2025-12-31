import { parseSlug } from "@/utils";
import {
    CHART_TYPE_AREA,
    CHART_TYPE_BAR,
    CHART_TYPE_HEATMAP,
    CHART_TYPE_RADAR,
    CHART_TYPE_RADIAL,
    ChartStateProvider,
    ChartViewComponent,
} from "@/constants";
import { AreaChartView } from "@/modules/chart-types/area/components/view";
import { AreaChartStoreProvider } from "@/modules/chart-types/area/store";
import { fetchChartMetadata } from "@/modules/chart-attributes/api/handler/read";
import { BarChartView } from "@/modules/chart-types/bar/components/view";
import { BarChartStoreProvider } from "@/modules/chart-types/bar/store";
import { RadarChartView } from "@/modules/chart-types/radar/components/view";
import { RadarChartStoreProvider } from "@/modules/chart-types/radar/store";
import { RadialChartView } from "@/modules/chart-types/radial/components/view";
import { RadialChartStoreProvider } from "@/modules/chart-types/radial/store";
import { HeatmapChartView } from "@/modules/chart-types/heatmap/components/view";
import { HeatmapStoreProvider } from "@/modules/chart-types/heatmap/store";

export default async function ChartView({
    params,
    searchParams,
}: {
    params: Promise<{
        chart_slug: string;
        collection_slug: string;
    }>;
    searchParams: Promise<{
        user_id: string;
    }>;
}) {
    const { chart_slug, collection_slug } = await params;

    const { id: chartId } = parseSlug(chart_slug);
    const { id: collectionId } = parseSlug(collection_slug);

    if (!chartId) {
        return <div>Invalid Chart ID</div>;
    }

    if (!collectionId) {
        return <div>Invalid Collection ID</div>;
    }

    const response = await fetchChartMetadata(chartId);

    if (!response.ok) {
        return <div>Error: {response.error}</div>;
    }

    const chart = response.metadata;

    const { user_id } = await searchParams;

    const chartComponents: {
        [key: string]: [ChartViewComponent, ChartStateProvider];
    } = {
        [CHART_TYPE_AREA]: [AreaChartView, AreaChartStoreProvider],
        [CHART_TYPE_BAR]: [BarChartView, BarChartStoreProvider],
        [CHART_TYPE_RADAR]: [RadarChartView, RadarChartStoreProvider],
        [CHART_TYPE_RADIAL]: [RadialChartView, RadialChartStoreProvider],
        [CHART_TYPE_HEATMAP]: [HeatmapChartView, HeatmapStoreProvider],
    };

    const [ChartView, StoreProvider] = chartComponents[chart.type];

    return (
        <div className="h-svh overflow-hidden">
            <StoreProvider chartId={chart.chartId}>
                <ChartView chartId={chart.chartId} userId={user_id} />
            </StoreProvider>
        </div>
    );
}
