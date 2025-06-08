import { RxBorderSolid } from "react-icons/rx";
import { TbLineDashed, TbLineDotted } from "react-icons/tb";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    TOOLTIP_STYLE_DASHED,
    TOOLTIP_STYLE_DOT,
    TOOLTIP_STYLE_LINE,
    TooltipStyle,
} from "@/constants";

export const TooltipStylesSelect = ({
    toolTipStyle,
    setTooltipStyle,
}: {
    toolTipStyle: TooltipStyle;
    setTooltipStyle: (gridStyle: TooltipStyle) => void;
}) => {
    return (
        <div className="flex items-center">
            <ToggleGroup
                type="single"
                value={toolTipStyle}
                onValueChange={(val: TooltipStyle | "") => {
                    if (
                        val === TOOLTIP_STYLE_DASHED ||
                        val === TOOLTIP_STYLE_DOT ||
                        val === TOOLTIP_STYLE_LINE
                    ) {
                        setTooltipStyle(val);
                    }
                }}
                className="flex"
            >
                <ToggleGroupItem
                    value={TOOLTIP_STYLE_DASHED}
                    aria-label={"Toggle dashed"}
                    className="size-10 p-0"
                >
                    <TbLineDashed size={30} />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value={TOOLTIP_STYLE_DOT}
                    aria-label={"Toggle dotted"}
                    className="size-10 p-0"
                >
                    <TbLineDotted size={30} />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value={TOOLTIP_STYLE_LINE}
                    aria-label={"Toggle solid"}
                    className="size-10 p-0"
                >
                    <RxBorderSolid size={30} />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
};
