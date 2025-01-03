"use client";
import { Eye, EyeOff, Plus } from "lucide-react";

// NOTE : Maybe used when we intended to use data-table to show the multi-column data

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useChartConfigStore } from "@/components/providers/ChartConfigStoreProvider";
import ColorPickerPopover from "@/components/ui/ColorPickerPopover";
import { Checkbox } from "@/components/ui/checkbox";

export default function RadarConfig() {
    const {
        showLabel: isLabelOn,
        toggleLabel,
        colors,
        setColor,
        addColor,
        removeColor,
        bgColor: bg_color,
        setBGColor,
        setLabel,
        showLegends,
        toggleLegends,
    } = useChartConfigStore((state) => state);

    // const handleSetColors = (color: string, index: number) => {};

    return (
        <div className="select-none">
            {/* Label */}
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

            {/* Color */}
            <section>
                <Label className="text-lg">Color</Label>
                <div className="flex flex-wrap items-center gap-2">
                    {colors.map((color, index) => (
                        <ColorPickerPopover
                            key={index}
                            isSingleColor={false}
                            color={color}
                            colorIndex={index}
                            setColor={setColor}
                            removeColor={removeColor}
                        >
                            <div
                                className="h-8 w-20 shrink-0 grow-0 cursor-pointer rounded border transition-transform hover:scale-110"
                                style={{
                                    backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
                                }}
                            />
                        </ColorPickerPopover>
                    ))}
                    <div
                        className="grid h-8 w-20 cursor-pointer place-content-center rounded border"
                        onClick={() => {
                            addColor();
                        }}
                    >
                        <Plus />
                    </div>
                </div>
                {/* BG Color */}
                <div>
                    <Label className="text-lg">BG Color</Label>
                    <div className="flex items-center">
                        <ColorPickerPopover
                            isSingleColor={true}
                            color={bg_color}
                            setColor={setBGColor}
                        >
                            <div
                                className="h-8 w-20 shrink-0 grow-0 cursor-pointer rounded border transition-transform hover:scale-110"
                                style={{
                                    backgroundColor: `rgba(${bg_color.r}, ${bg_color.g}, ${bg_color.b}, ${bg_color.a})`,
                                }}
                            />
                        </ColorPickerPopover>
                    </div>
                </div>

                {/* Legends */}
                <div>
                    <Checkbox
                        id="legends"
                        defaultChecked={showLegends}
                        onCheckedChange={toggleLegends}
                    />
                </div>
            </section>
        </div>
    );
}
