import { Separator } from "@/components/ui/separator";
import { useHeatmapChartStore } from "@/modules/Heatmap/store";
import ColorPickerPopover from "@/components/ui/ColorPickerPopover";

export function ColorsTab() {
    const backgroundColor = useHeatmapChartStore(
        (state) => state.backgroundColor
    );
    const setBackgroundColor = useHeatmapChartStore(
        (state) => state.setBackgroundColor
    );
    const textColor = useHeatmapChartStore((state) => state.textColor);
    const setTextColor = useHeatmapChartStore((state) => state.setTextColor);
    const defaultBoxColor = useHeatmapChartStore(
        (state) => state.defaultBoxColor
    );
    const setDefaultBoxColor = useHeatmapChartStore(
        (state) => state.setDefaultBoxColor
    );
    const accent = useHeatmapChartStore((state) => state.accent);
    const setAccent = useHeatmapChartStore((state) => state.setAccent);

    const streakColor = useHeatmapChartStore((state) => state.streak.color);
    const setStreakColor = useHeatmapChartStore(
        (state) => state.setStreakColor
    );
    const longestStreakColor = useHeatmapChartStore(
        (state) => state.longestStreak.color
    );
    const setLongestStreakColor = useHeatmapChartStore(
        (state) => state.setLongestStreakColor
    );
    const sumOfAllEntriesColor = useHeatmapChartStore(
        (state) => state.sumOfAllEntries.color
    );
    const setSumOfAllEntriesColor = useHeatmapChartStore(
        (state) => state.setSumOfAllEntriesColor
    );
    const averageOfAllEntriesColor = useHeatmapChartStore(
        (state) => state.averageOfAllEntries.color
    );
    const setAverageOfAllEntriesColor = useHeatmapChartStore(
        (state) => state.setAverageOfAllEntriesColor
    );
    const numberOfEntriesColor = useHeatmapChartStore(
        (state) => state.numberOfEntries.color
    );
    const setNumberOfEntriesColor = useHeatmapChartStore(
        (state) => state.setNumberOfEntriesColor
    );

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme Colors</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <ColorPickerPopover
                        color={backgroundColor}
                        setColor={setBackgroundColor}
                        isSingleColor
                        label="Background"
                    />
                    <ColorPickerPopover
                        color={textColor}
                        setColor={setTextColor}
                        isSingleColor
                        label="Text"
                    />
                    <ColorPickerPopover
                        isSingleColor
                        color={defaultBoxColor}
                        setColor={setDefaultBoxColor}
                        enableAlpha={false}
                        label="Default Cell"
                    />
                    <ColorPickerPopover
                        isSingleColor
                        color={accent}
                        setColor={setAccent}
                        enableAlpha={false}
                        label="Accent"
                    />
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Metric Colors</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <ColorPickerPopover
                        color={streakColor}
                        setColor={setStreakColor}
                        isSingleColor
                        label="Current Streak"
                    />
                    <ColorPickerPopover
                        color={longestStreakColor}
                        setColor={setLongestStreakColor}
                        isSingleColor
                        label="Longest Streak"
                    />
                    <ColorPickerPopover
                        isSingleColor
                        color={sumOfAllEntriesColor}
                        setColor={setSumOfAllEntriesColor}
                        label="Total"
                    />
                    <ColorPickerPopover
                        isSingleColor
                        color={averageOfAllEntriesColor}
                        setColor={setAverageOfAllEntriesColor}
                        label="Average"
                    />
                    <ColorPickerPopover
                        isSingleColor
                        color={numberOfEntriesColor}
                        setColor={setNumberOfEntriesColor}
                        label="Entry Count"
                    />
                </div>
            </div>
        </div>
    );
}
