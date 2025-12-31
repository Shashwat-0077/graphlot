import { Sliders, Palette, Layout } from "lucide-react";

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorsSettings } from "@/modules/chart-types/area/components/edit/color-settings";
import { GridAndBoxModelSettings } from "@/modules/chart-types/area/components/edit/grid-and-box-model-settings";
import { TypographyAndStyleSettings } from "@/modules/chart-types/area/components/edit/typography-and-style-settings";

export function AreaConfigTabs() {
    return (
        <Tabs defaultValue="colors" className="w-full min-w-[350px]">
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
            <div>
                <TabsContent value="colors" className="mt-0">
                    <ColorsSettings />
                </TabsContent>
                <TabsContent value="ui-features" className="mt-0">
                    <TypographyAndStyleSettings />
                </TabsContent>
                <TabsContent value="grid-layout" className="mt-0">
                    <GridAndBoxModelSettings />
                </TabsContent>
            </div>
        </Tabs>
    );
}
