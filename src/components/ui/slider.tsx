"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex w-full touch-none select-none items-center",
            className
        )}
        {...props}
    >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

interface DualRangeSliderProps
    extends Omit<
        React.ComponentProps<typeof SliderPrimitive.Root>,
        "value" | "defaultValue"
    > {
    value?: [number, number];
    defaultValue?: [number, number];
    labelPosition?: "top" | "bottom";
    label?: (value: number) => React.ReactNode;
    showMinMax?: boolean;
    showSteps?: boolean;
    formatLabel?: (value: number) => string;
    thumbClassName?: string;
    trackClassName?: string;
    rangeClassName?: string;
}

const DualRangeSlider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    DualRangeSliderProps
>(
    (
        {
            className,
            label,
            labelPosition = "top",
            showMinMax = false,
            showSteps = false,
            formatLabel,
            thumbClassName,
            trackClassName,
            rangeClassName,
            min = 0,
            max = 100,
            step = 1,
            value,
            defaultValue,
            ...props
        },
        ref
    ) => {
        // Handle default values properly
        const defaultSliderValue = defaultValue || [min, max];
        const currentValue = value || defaultSliderValue;

        // Generate step marks if showSteps is true
        const stepMarks = React.useMemo(() => {
            if (!showSteps) {
                return [];
            }
            const marks = [];
            for (let i = min; i <= max; i += step) {
                marks.push(i);
            }
            return marks;
        }, [showSteps, min, max, step]);

        const formatValue = (val: number) => {
            if (formatLabel) {
                return formatLabel(val);
            }
            return val.toString();
        };

        return (
            <div className="w-full">
                <SliderPrimitive.Root
                    ref={ref}
                    className={cn(
                        "relative flex w-full touch-none select-none items-center",
                        className
                    )}
                    value={currentValue}
                    defaultValue={defaultSliderValue}
                    min={min}
                    max={max}
                    step={step}
                    {...props}
                >
                    <SliderPrimitive.Track
                        className={cn(
                            "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
                            trackClassName
                        )}
                    >
                        <SliderPrimitive.Range
                            className={cn(
                                "absolute h-full bg-primary",
                                rangeClassName
                            )}
                        />
                    </SliderPrimitive.Track>

                    {/* Step marks */}
                    {showSteps && (
                        <div className="absolute inset-0 flex items-center">
                            {stepMarks.map((mark) => {
                                const position =
                                    ((mark - min) / (max - min)) * 100;
                                return (
                                    <div
                                        key={mark}
                                        className="absolute h-1 w-0.5 rounded-full bg-muted-foreground/30"
                                        style={{
                                            left: `${position}%`,
                                            transform: "translateX(-50%)",
                                        }}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {/* Thumbs */}
                    {currentValue.map((val, index) => (
                        <SliderPrimitive.Thumb
                            key={index}
                            className={cn(
                                "relative block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                                thumbClassName
                            )}
                        >
                            {/* Thumb labels */}
                            {label && (
                                <span
                                    className={cn(
                                        "pointer-events-none absolute flex w-max justify-center rounded border bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md",
                                        labelPosition === "top" &&
                                            "-translate-x1/2 -top-10 left-1/2",
                                        labelPosition === "bottom" &&
                                            "-bottom-10 left-1/2 -translate-x-1/2"
                                    )}
                                >
                                    {label(val)}
                                </span>
                            )}
                        </SliderPrimitive.Thumb>
                    ))}
                </SliderPrimitive.Root>

                {/* Min/Max labels */}
                {showMinMax && (
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                        <span>{formatValue(min)}</span>
                        <span>{formatValue(max)}</span>
                    </div>
                )}
            </div>
        );
    }
);
DualRangeSlider.displayName = "DualRangeSlider";

export { DualRangeSlider, Slider };
