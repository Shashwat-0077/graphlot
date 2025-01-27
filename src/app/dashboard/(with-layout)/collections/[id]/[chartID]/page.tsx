"use client";

import { useChartConfigStore } from "@/components/providers/ChartConfigStoreProvider";
import { RadarChartView } from "@/features/charts/components/ChartsView/RadarChartView";
// import ChartConfigs from "@/features/charts/components/ChartConfigs";

export default function ChatConfigs() {
    const {
        type: chartType,
        bgColor,
        showLabel,
        label,
    } = useChartConfigStore((state) => state);

    return (
        <section>
            <div
                className="flex flex-col items-center justify-center rounded-xl border pb-14 pt-7"
                style={{
                    backgroundColor: `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})`,
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

            <div>{/* <ChartConfigs /> */}</div>
        </section>
    );
}
