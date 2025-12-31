"use client";

import { useState } from "react";

import ColorPickerPopover from "@/components/ui/color-picker-popover";

export default function TestPage() {
    const [color, setColor] = useState({ r: 255, g: 0, b: 0, a: 1 });

    return (
        <div className="grid h-full w-full place-content-center">
            <ColorPickerPopover
                color={color}
                setColor={setColor}
                isSingleColor={true}
            >
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900"></div>
            </ColorPickerPopover>
        </div>
    );
}
