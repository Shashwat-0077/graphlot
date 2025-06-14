import ColorPickerPopover from "@/components/ui/ColorPickerPopover";
import { RGBAColor } from "@/constants";
import { getHexString, getRGBAString } from "@/utils/colors";

export const ColorTile = ({
    color,
    setColor,
    label,
}: {
    color: RGBAColor;
    setColor: (color: RGBAColor) => void;
    label: string;
}) => {
    const hexCode = getHexString(color);

    return (
        <ColorPickerPopover
            isSingleColor={true}
            color={color}
            setColor={setColor}
        >
            <div className="group relative cursor-pointer overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
                {/* Color display */}
                <div
                    className="relative h-20 w-full"
                    style={{ backgroundColor: getRGBAString(color) }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                </div>

                {/* Info section */}
                <div className="space-y-1 p-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-200">
                            {label}
                        </span>
                        <div
                            className="h-4 w-4 rounded border border-neutral-700"
                            style={{ backgroundColor: getRGBAString(color) }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-neutral-400">
                            {hexCode}
                        </span>
                        <span className="text-neutral-500">
                            {color.r}, {color.g}, {color.b}
                        </span>
                    </div>
                </div>
            </div>
        </ColorPickerPopover>
    );
};
