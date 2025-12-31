import { Separator } from "@/components/ui/separator";
import { RGBAColor } from "@/constants";
import { cn, getRGBAString } from "@/utils";

interface CustomTooltipContentProps {
    active?: boolean;
    payload?: any[]; // eslint-disable-line
    label?: string;
    indicator?: "dot" | "line" | "dashed";
    className?: string;
    separatorEnabled?: boolean; // Optional prop for separator
    textColor?: RGBAColor;
    totalEnabled?: boolean; // Optional prop for total
    separatorColor?: RGBAColor; // Default separator color
    backgroundColor?: RGBAColor; // Optional background color
}

export const CustomTooltipContent = ({
    active,
    payload,
    label,
    indicator = "dot",
    className,
    separatorEnabled = true, // Optional prop for separator
    textColor = { r: 255, g: 255, b: 255, a: 1 }, // Default text color
    totalEnabled = false, // Optional prop for total
    separatorColor = { r: 255, g: 255, b: 255, a: 0.1 }, // Default separator color
    backgroundColor = { r: 0, g: 0, b: 0, a: 0.8 }, // Default background color
}: CustomTooltipContentProps) => {
    if (!active || !payload || !payload.length) {
        return null;
    }

    const maxItems = 10; // Limit number of items shown
    const displayPayload = payload.slice(0, maxItems);
    const hasMore = payload.length > maxItems;

    const formattedLabel =
        label && new Date(label).toString() !== "Invalid Date"
            ? new Date(label).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
              })
            : label;

    return (
        <div
            className={cn(
                "bg-background max-w-70 overflow-hidden border p-4 shadow-lg",
                "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                className
            )}
            style={{
                color: getRGBAString(textColor, true),
                backgroundColor: getRGBAString(backgroundColor, true),
            }}
        >
            {indicator === "line" && (
                <div className="bg-border absolute top-0 -left-px h-full w-0.5" />
            )}

            <div className="space-y-3">
                {formattedLabel && (
                    <div>
                        <h4 className="text-sm font-medium">
                            {formattedLabel}
                        </h4>
                    </div>
                )}

                {separatorEnabled && (
                    <Separator
                        className="w-full"
                        style={{
                            backgroundColor: getRGBAString(
                                separatorColor,
                                true
                            ),
                        }}
                    />
                )}

                <div className="custom-scrollbar max-h-40 space-y-2 overflow-y-auto pr-1">
                    {displayPayload.reverse().map(
                        (
                            entry: any, // eslint-disable-line
                            index: number
                        ) => (
                            <div
                                key={index}
                                className="group flex items-center justify-between gap-3"
                            >
                                <div className="flex min-w-0 items-center gap-2">
                                    <div
                                        className={cn(
                                            "h-3 w-3 shrink-0",
                                            indicator === "line"
                                                ? "rounded-sm"
                                                : "rounded-full",
                                            indicator === "dashed" &&
                                                "border-2 border-dashed bg-transparent"
                                        )}
                                        style={{
                                            backgroundColor:
                                                indicator === "dashed"
                                                    ? "transparent"
                                                    : entry.color,
                                            borderColor:
                                                indicator === "dashed"
                                                    ? entry.color
                                                    : undefined,
                                        }}
                                    />
                                    <span
                                        className="group-hover:text-foreground truncate text-sm transition-colors"
                                        title={entry.name}
                                    >
                                        {entry.name}
                                    </span>
                                </div>
                                <span className="text-sm font-medium tabular-nums">
                                    {typeof entry.value === "number"
                                        ? entry.value.toLocaleString()
                                        : entry.value}
                                </span>
                            </div>
                        )
                    )}

                    {hasMore && (
                        <div className="mt-2 border-t pt-2 text-center text-xs">
                            +{payload.length - maxItems} more items
                        </div>
                    )}

                    {totalEnabled && payload.length > 0 && (
                        <>
                            {separatorEnabled && (
                                <Separator
                                    className="w-full"
                                    style={{
                                        backgroundColor: getRGBAString(
                                            separatorColor,
                                            true
                                        ),
                                    }}
                                />
                            )}
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span>Total</span>
                                {payload
                                    .reduce(
                                        (sum, entry) =>
                                            sum + (entry.value || 0),
                                        0
                                    )
                                    .toLocaleString()}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
