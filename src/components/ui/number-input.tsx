"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface NumberInputProps
    extends Omit<NumericFormatProps, "value" | "onValueChange"> {
    stepper?: number;
    thousandSeparator?: string;
    placeholder?: string;
    defaultValue?: number;
    min?: number;
    max?: number;
    value?: number; // Controlled value
    suffix?: string;
    prefix?: string;
    onValueChange?: (value: number | undefined) => void;
    fixedDecimalScale?: boolean;
    decimalScale?: number;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    (
        {
            stepper,
            thousandSeparator,
            placeholder,
            defaultValue,
            min = Number.NEGATIVE_INFINITY,
            max = Number.POSITIVE_INFINITY,
            onValueChange,
            fixedDecimalScale = false,
            decimalScale = 0,
            suffix,
            prefix,
            value: controlledValue,
            ...props
        },
        ref
    ) => {
        const [value, setValue] = useState<number | undefined>(
            controlledValue ?? defaultValue
        );

        const handleIncrement = useCallback(() => {
            setValue((prev) =>
                prev === undefined
                    ? (stepper ?? 1)
                    : Math.min(prev + (stepper ?? 1), max)
            );
        }, [stepper, max]);

        const handleDecrement = useCallback(() => {
            setValue((prev) =>
                prev === undefined
                    ? -(stepper ?? 1)
                    : Math.max(prev - (stepper ?? 1), min)
            );
        }, [stepper, min]);

        useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (
                    ref &&
                    document.activeElement ===
                        (ref as React.RefObject<HTMLInputElement>).current
                ) {
                    if (e.key === "ArrowUp") {
                        handleIncrement();
                    } else if (e.key === "ArrowDown") {
                        handleDecrement();
                    }
                }
            };

            window.addEventListener("keydown", handleKeyDown);

            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }, [handleIncrement, handleDecrement, ref]);

        useEffect(() => {
            if (controlledValue !== undefined) {
                setValue(controlledValue);
            }
        }, [controlledValue]);

        const handleChange = (values: {
            value: string;
            floatValue: number | undefined;
        }) => {
            const newValue =
                values.floatValue === undefined ? undefined : values.floatValue;
            setValue(newValue);
            if (onValueChange) {
                onValueChange(newValue);
            }
        };

        const handleBlur = () => {
            if (value !== undefined) {
                if (value < min && ref) {
                    setValue(min);
                    (ref as React.RefObject<HTMLInputElement>).current!.value =
                        String(min);
                } else if (value > max && ref) {
                    setValue(max);
                    (ref as React.RefObject<HTMLInputElement>).current!.value =
                        String(max);
                }
            }
        };

        return (
            <div className="relative flex h-10">
                <NumericFormat
                    value={value}
                    onValueChange={handleChange}
                    thousandSeparator={thousandSeparator}
                    decimalScale={decimalScale}
                    fixedDecimalScale={fixedDecimalScale}
                    allowNegative={min < 0}
                    valueIsNumericString
                    onBlur={handleBlur}
                    max={max}
                    min={min}
                    suffix={suffix}
                    prefix={prefix}
                    customInput={Input}
                    placeholder={placeholder}
                    getInputRef={ref}
                    {...props}
                    className="h-full rounded-r-none pr-0"
                />

                <div className="border-input flex h-full flex-col rounded-r-md border border-l-0">
                    <Button
                        type="button"
                        aria-label="Increase value"
                        className="border-input hover:bg-accent h-1/2 w-8 rounded-none rounded-tr-md border-0 border-b px-0 focus-visible:z-10"
                        variant="ghost"
                        size="sm"
                        onClick={handleIncrement}
                        disabled={value === max}
                    >
                        <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                        type="button"
                        aria-label="Decrease value"
                        className="hover:bg-accent h-1/2 w-8 rounded-none rounded-br-md border-0 px-0 focus-visible:z-10"
                        variant="ghost"
                        size="sm"
                        onClick={handleDecrement}
                        disabled={value === min}
                    >
                        <ChevronDown className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        );
    }
);
NumberInput.displayName = "NumberInput";
