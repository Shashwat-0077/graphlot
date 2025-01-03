"use client";
import {
    ChartNoAxesColumn,
    ChartSpline,
    Donut,
    Grid2x2,
    Radar as RadarIcon,
} from "lucide-react";

import { useChartConfigStore } from "@/components/providers/ChartConfigStoreProvider";
import { RadarChartView } from "@/features/charts/components/ChartsView/RadarChartView";
import ChartConfigs from "@/features/charts/components/ChartConfigs";

export default function ChatConfigs() {
    const {
        type: chartType,
        changeChartType,
        bg_color,
        showLabel,
        label,
    } = useChartConfigStore((state) => state);

    return (
        <section>
            <div
                className="flex flex-col items-center justify-center rounded-xl border pb-14 pt-7"
                style={{
                    backgroundColor: `rgba(${bg_color.r}, ${bg_color.g}, ${bg_color.b}, ${bg_color.a})`,
                }}
            >
                {showLabel ? (
                    <h1 className="text-2xl font-bold">
                        {label.length === 0 || !label
                            ? chartType + " Chart"
                            : label}
                    </h1>
                ) : (
                    // NOTE : This is added so that if the label is not shown, the height of the page is not affected
                    <h1 className="text-2xl font-bold">&nbsp;</h1>
                )}
                <RadarChartView />
            </div>
            <div className="mt-5 grid place-content-center">
                <div className="flex gap-10">
                    <div
                        onClick={() => changeChartType("Bar")}
                        className={`cursor-pointer rounded-lg border border-primary bg-primary/10 px-5 py-2 hover:bg-primary/20 ${chartType === "Bar" ? "!bg-primary/50" : ""}`}
                    >
                        <ChartNoAxesColumn />
                    </div>
                    <div
                        onClick={() => changeChartType("Area")}
                        className={`cursor-pointer rounded-lg border border-primary bg-primary/10 px-5 py-2 hover:bg-primary/20 ${chartType === "Area" ? "!bg-primary/50" : ""}`}
                    >
                        <ChartSpline />
                    </div>
                    <div
                        onClick={() => changeChartType("Donut")}
                        className={`cursor-pointer rounded-lg border border-primary bg-primary/10 px-5 py-2 hover:bg-primary/20 ${chartType === "Donut" ? "!bg-primary/50" : ""}`}
                    >
                        <Donut />
                    </div>
                    <div
                        onClick={() => changeChartType("Radar")}
                        className={`cursor-pointer rounded-lg border border-primary bg-primary/10 px-5 py-2 hover:bg-primary/20 ${chartType === "Radar" ? "!bg-primary/50" : ""}`}
                    >
                        <RadarIcon />
                    </div>
                    <div
                        onClick={() => changeChartType("Heatmap")}
                        className={`cursor-pointer rounded-lg border border-primary bg-primary/10 px-5 py-2 hover:bg-primary/20 ${chartType === "Heatmap" ? "!bg-primary/50" : ""}`}
                    >
                        <Grid2x2 />
                    </div>
                </div>
            </div>

            <div>
                <ChartConfigs />
            </div>
        </section>
    );
}
