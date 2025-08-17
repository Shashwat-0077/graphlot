"use client";

import { Sliders, Palette, Layout, Save } from "lucide-react";
import { usePathname } from "next/navigation";
import { useWindowSize } from "react-use";

// UI Components
import { ChartConfigComponent } from "@/constants";
import { clientEnv } from "@/lib/env/client-env";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSection } from "@/modules/chart-types/area/components/edit/data-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorsConfig } from "@/modules/chart-types/area/components/edit/area-color-config";
import { CopyButton } from "@/components/ui/copy-button";
import { GridAndBoxModelConfig } from "@/modules/chart-types/area/components/edit/area-grid-and-box-model-config";
import { TypographyAndStyleConfig } from "@/modules/chart-types/area/components/edit/typography-and-style-config";
import { Button } from "@/components/ui/button";

export const AreaChartConfig: ChartConfigComponent = ({ chartId, userId }) => {
    const path = usePathname();
    const { width } = useWindowSize();
    const isBigScreen = width >= 1280;

    return (
        <div className="py-8">
            <div className="mb-6 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
                <h1 className="text-2xl font-bold">Area Chart Configuration</h1>
                <div className="flex items-center gap-2">
                    <CopyButton
                        textToCopy={`${clientEnv.NEXT_PUBLIC_APP_URL}${path}/view?user_id=${userId}`}
                    />
                    <Button
                        type="button"
                        onClick={() => {}}
                        className="flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        Save Chart
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[450px_1fr]">
                {/* Appearance Section */}
                <Card className="border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-medium">
                            Appearance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isBigScreen ? (
                            <ScrollArea className="h-[850px]">
                                <AreaConfigTabs />
                            </ScrollArea>
                        ) : (
                            <AreaConfigTabs />
                        )}
                    </CardContent>
                </Card>

                {/* Data Section */}
                <DataSection chartId={chartId} userId={userId} />
            </div>

            {/* Keyboard shortcut info */}
            <div className="bg-muted/5 text-muted-foreground mt-8 rounded-md border p-3 text-center text-sm">
                <p>
                    Press{" "}
                    <kbd className="rounded border px-1 py-0.5 text-xs font-semibold">
                        Ctrl
                    </kbd>{" "}
                    +{" "}
                    <kbd className="rounded border px-1 py-0.5 text-xs font-semibold">
                        S
                    </kbd>{" "}
                    to save your chart configuration
                </p>
            </div>
        </div>
    );
};

function AreaConfigTabs() {
    return (
        <Tabs defaultValue="colors" className="w-full">
            <TabsList className="bg-background sticky top-0 z-10 grid w-full grid-cols-3 rounded-none">
                <TabsTrigger value="colors">
                    <div className="flex items-center gap-1">
                        <Palette className="h-3 w-3" />
                        <span>Colors</span>
                    </div>
                </TabsTrigger>
                <TabsTrigger value="ui-features">
                    <div className="flex items-center gap-1">
                        <Layout className="h-3 w-3" />
                        <span>UI Features</span>
                    </div>
                </TabsTrigger>
                <TabsTrigger value="grid-layout">
                    <div className="flex items-center gap-1">
                        <Sliders className="h-3 w-3" />
                        <span>Grid</span>
                    </div>
                </TabsTrigger>
            </TabsList>
            <div className="p-4">
                <TabsContent value="colors" className="mt-0">
                    <ColorsConfig />
                </TabsContent>
                <TabsContent value="ui-features" className="mt-0">
                    <TypographyAndStyleConfig />
                </TabsContent>
                <TabsContent value="grid-layout" className="mt-0">
                    <GridAndBoxModelConfig />
                </TabsContent>
            </div>
        </Tabs>
    );
}
