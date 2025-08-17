import { AnchorType } from "@/constants";

export const getLabelAnchor = (anchor: AnchorType): string => {
    switch (anchor) {
        case "start":
            return "0%";
        case "middle":
            return "50%";
        case "end":
            return "100%";
        default:
            return "0";
    }
};
