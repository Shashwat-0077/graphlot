"use client";
import React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChartConfigStore } from "@/components/providers/ChartConfigStoreProvider";

export default function ChartConfigs() {
    const {
        showLabel: isLabelOn,
        toggleLabel,
        colors,
        setColor,
        addColor,
        removeColor,
        bg_color,
        setBGColor,
        setLabel,
        showLegends,
        toggleLegends,
    } = useChartConfigStore((state) => state);

    return (
        <div>
            {/* Chart Types */}
            <section>
                <Label className="text-lg">Label</Label>
                <div className="flex items-stretch gap-2">
                    <Input
                        placeholder="Label"
                        onChange={(e) => {
                            setLabel(e.target.value);
                        }}
                    />
                    <div
                        className="grid cursor-pointer place-content-center rounded-lg border px-3 py-1"
                        onClick={() => {
                            toggleLabel();
                        }}
                    >
                        {isLabelOn ? <Eye /> : <EyeOff />}
                    </div>
                </div>
            </section>
        </div>
    );
}
