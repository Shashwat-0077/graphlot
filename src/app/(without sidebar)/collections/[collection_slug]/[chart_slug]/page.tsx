import { headers } from "next/headers";

import { parseSlug } from "@/utils";
import {
    CHART_TYPE_AREA,
    CHART_TYPE_BAR,
    CHART_TYPE_HEATMAP,
    CHART_TYPE_RADAR,
    CHART_TYPE_RADIAL,
    ChartStateProvider,
    ChartViewComponent,
    DataSettings,
    NoPropFunction,
} from "@/constants";
import { AreaChartView } from "@/modules/chart-types/area/components/view";
import { AreaConfigTabs } from "@/modules/chart-types/area/components/edit";
import { AreaChartStoreProvider } from "@/modules/chart-types/area/store";
import { AreaDataSettings } from "@/modules/chart-types/area/components/edit/data-settings";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchChartMetadata } from "@/modules/chart-attributes/api/handler/read";
import { auth } from "@/modules/auth";
import { NavStrip } from "@/components/nav-strip";
import { BarChartView } from "@/modules/chart-types/bar/components/view";
import { BarConfigTabs } from "@/modules/chart-types/bar/components/edit";
import { BarDataSettings } from "@/modules/chart-types/bar/components/edit/data-settings";
import { BarChartStoreProvider } from "@/modules/chart-types/bar/store";
import { RadarChartView } from "@/modules/chart-types/radar/components/view";
import { RadarChartStoreProvider } from "@/modules/chart-types/radar/store";
import { RadarConfigTabs } from "@/modules/chart-types/radar/components/edit";
import { RadarDataSettings } from "@/modules/chart-types/radar/components/edit/data-settings";
import { RadialChartView } from "@/modules/chart-types/radial/components/view";
import { RadialChartStoreProvider } from "@/modules/chart-types/radial/store";
import { RadialConfigTabs } from "@/modules/chart-types/radial/components/edit";
import { RadialDataSettings } from "@/modules/chart-types/radial/components/edit/data-settings";
import { HeatmapChartView } from "@/modules/chart-types/heatmap/components/view";
import { HeatmapDataSettings } from "@/modules/chart-types/heatmap/components/edit/data-section";
import { HeatmapStoreProvider } from "@/modules/chart-types/heatmap/store";
import { HeatmapConfigPanel } from "@/modules/chart-types/heatmap/components/edit";
import { AreaSaveButton } from "@/modules/chart-types/area/components/save-button";
import { BarSaveButton } from "@/modules/chart-types/bar/components/save-button";
import { HeatmapSaveButton } from "@/modules/chart-types/heatmap/components/save-button";
import { RadarSaveButton } from "@/modules/chart-types/radar/components/save-button";
import { RadialSaveButton } from "@/modules/chart-types/radial/components/save-button";

export default async function ChatConfigs({
    params,
}: {
    params: Promise<{
        chart_slug: string;
        collection_slug: string;
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
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return <div>Invalid User ID</div>;
    }

    const userId = session.user.id;

    const chartComponents: {
        [key: string]: [
            ChartViewComponent,
            NoPropFunction,
            DataSettings,
            ChartStateProvider,
            React.ElementType,
        ];
    } = {
        [CHART_TYPE_AREA]: [
            AreaChartView,
            AreaConfigTabs,
            AreaDataSettings,
            AreaChartStoreProvider,
            AreaSaveButton,
        ],
        [CHART_TYPE_BAR]: [
            BarChartView,
            BarConfigTabs,
            BarDataSettings,
            BarChartStoreProvider,
            BarSaveButton,
        ],
        [CHART_TYPE_RADAR]: [
            RadarChartView,
            RadarConfigTabs,
            RadarDataSettings,
            RadarChartStoreProvider,
            RadarSaveButton,
        ],
        [CHART_TYPE_RADIAL]: [
            RadialChartView,
            RadialConfigTabs,
            RadialDataSettings,
            RadialChartStoreProvider,
            RadialSaveButton,
        ],
        [CHART_TYPE_HEATMAP]: [
            HeatmapChartView,
            HeatmapConfigPanel,
            HeatmapDataSettings,
            HeatmapStoreProvider,
            HeatmapSaveButton,
        ],
    };

    const [
        ChartView,
        ChartConfigTabs,
        DataSettings,
        StoreProvider,
        SaveButton,
    ] = chartComponents[chart.type];

    return (
        <StoreProvider chartId={chart.chartId}>
            <ResizablePanelGroup
                direction="horizontal"
                className="max-h-screen min-h-screen"
            >
                <ResizablePanel defaultSize={25}>
                    <ScrollArea className="h-full p-5 pb-0">
                        <NavStrip
                            className="mb-4"
                            collection_slug={collection_slug}
                            chartId={chartId}
                            SaveButton={SaveButton}
                        />
                        <ChartConfigTabs />
                    </ScrollArea>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={75}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={60}>
                            <ChartView
                                chartId={chart.chartId}
                                userId={userId}
                            />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={40}>
                            <ScrollArea className="h-full p-5 pb-0">
                                <DataSettings
                                    chartId={chart.chartId}
                                    userId={userId}
                                />
                            </ScrollArea>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </StoreProvider>
    );
}
