"use client";

import React from "react";
import { RgbaColorPicker } from "react-colorful";
import { Trash2, ChevronDown, Clock } from "lucide-react";
import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "react-use";

import { cn } from "@/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface RGBAColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

type ColorPickerPopoverProps =
    | {
          children?: React.ReactNode;
          isSingleColor: false;
          className?: string;
          colorIndex: number;
          removeColor: (index: number) => void;
          color: RGBAColor;
          setColor: (index: number, color: RGBAColor) => void;
          enableAlpha?: boolean;
          label?: string;
      }
    | {
          children?: React.ReactNode;
          isSingleColor: true;
          colorIndex?: never;
          className?: string;
          removeColor?: never;
          color: RGBAColor;
          setColor: (color: RGBAColor) => void;
          enableAlpha?: boolean;
          label?: string;
      };

// Constants
const MAX_RECENT_COLORS = 12;
const ANIMATION_DURATION = 0.3;
const INVALID_COLOR_VALUE = -Number.MIN_VALUE;
const RECENT_COLORS_STORAGE_KEY = "color-picker-recent-colors";

// Predefined color palette - moved outside component to prevent recreation
const COLOR_PALETTE: RGBAColor[] = [
    { r: 239, g: 68, b: 68, a: 1 }, // Red
    { r: 249, g: 115, b: 22, a: 1 }, // Orange
    { r: 234, g: 179, b: 8, a: 1 }, // Yellow
    { r: 34, g: 197, b: 94, a: 1 }, // Green
    { r: 16, g: 185, b: 129, a: 1 }, // Emerald
    { r: 6, g: 182, b: 212, a: 1 }, // Cyan
    { r: 59, g: 130, b: 246, a: 1 }, // Blue
    { r: 124, g: 58, b: 237, a: 1 }, // Violet
    { r: 236, g: 72, b: 153, a: 1 }, // Pink
    { r: 0, g: 0, b: 0, a: 1 }, // Black
    { r: 107, g: 114, b: 128, a: 1 }, // Gray
    { r: 255, g: 255, b: 255, a: 1 }, // White
];

// Utility functions - memoized to prevent recreation
const normalizeColorValue = (value: number): number =>
    value === INVALID_COLOR_VALUE ? 0 : value;

const normalizeAlpha = (alpha: number): number =>
    alpha === INVALID_COLOR_VALUE ? 1 : alpha;

const rgbaToString = (color: RGBAColor): string => {
    const r = normalizeColorValue(color.r);
    const g = normalizeColorValue(color.g);
    const b = normalizeColorValue(color.b);
    const a = normalizeAlpha(color.a);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const rgbaToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number): string => {
        const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const hexToRgba = (hex: string): { r: number; g: number; b: number } | null => {
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
        return null;
    }

    return {
        r: parseInt(cleanHex.substring(0, 2), 16),
        g: parseInt(cleanHex.substring(2, 4), 16),
        b: parseInt(cleanHex.substring(4, 6), 16),
    };
};

const colorsEqual = (c1: RGBAColor, c2: RGBAColor): boolean => {
    return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b && c1.a === c2.a;
};

// Memoized color button component
const ColorButton = React.memo(
    ({
        color,
        onClick,
        ariaLabel,
    }: {
        color: RGBAColor;
        onClick: () => void;
        ariaLabel: string;
    }) => (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="focus:ring-ring h-6 w-6 rounded-sm border shadow-sm transition-opacity hover:opacity-80 focus:ring-2 focus:outline-none"
            style={{ backgroundColor: rgbaToString(color) }}
            onClick={onClick}
            aria-label={ariaLabel}
        />
    )
);

ColorButton.displayName = "ColorButton";

export default function ColorPickerPopover({
    children,
    color,
    setColor,
    className,
    colorIndex,
    removeColor,
    isSingleColor,
    enableAlpha = true,
    label,
}: ColorPickerPopoverProps) {
    // State
    const [hexValue, setHexValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("picker");
    const [hasAnimated, setHasAnimated] = useState(false);

    // localStorage hook for recent colors
    const [recentColors, setRecentColors] = useLocalStorage<RGBAColor[]>(
        RECENT_COLORS_STORAGE_KEY,
        []
    );

    // Refs
    const initialColorRef = useRef<RGBAColor | null>(null);

    // Memoized values
    const colorString = useMemo(() => rgbaToString(color), [color]);

    const currentHex = useMemo(() => {
        const r = normalizeColorValue(color.r);
        const g = normalizeColorValue(color.g);
        const b = normalizeColorValue(color.b);
        return rgbaToHex(r, g, b);
    }, [color.r, color.g, color.b]);

    const contentHeight = useMemo(() => {
        if (activeTab === "picker") {
            let height = 320; // Base picker height
            if (recentColors && recentColors.length > 0) height += 100; // Recent colors section
            if (!isSingleColor) height += 60; // Remove button
            return height;
        }
        return enableAlpha ? 280 : 280; // Values tab height
    }, [activeTab, recentColors, isSingleColor, enableAlpha]);

    // Memoized callbacks
    const updateColor = useCallback(
        (newColor: RGBAColor) => {
            if (isSingleColor) {
                setColor(newColor);
            } else {
                setColor(colorIndex, newColor);
            }
        },
        [isSingleColor, setColor, colorIndex]
    );

    const addToRecentColors = useCallback(
        (newColor: RGBAColor) => {
            if (!recentColors) {
                setRecentColors([newColor]);
                return;
            }

            // Check if color already exists
            const exists = recentColors.some((c) => colorsEqual(c, newColor));
            if (exists) return;

            // Add to beginning and limit
            const updatedColors = [newColor, ...recentColors].slice(
                0,
                MAX_RECENT_COLORS
            );
            setRecentColors(updatedColors);
        },
        [recentColors, setRecentColors]
    );

    const handleOpenChange = useCallback(
        (open: boolean) => {
            setIsOpen(open);

            if (open) {
                initialColorRef.current = { ...color };
                setHasAnimated(false);
            } else {
                // Save color when closing if it changed
                if (
                    initialColorRef.current &&
                    !colorsEqual(initialColorRef.current, color)
                ) {
                    addToRecentColors(color);
                }
            }
        },
        [color, addToRecentColors]
    );

    const handleTabChange = useCallback(
        (newTab: string) => {
            if (newTab === activeTab) return;
            setActiveTab(newTab);
            setHasAnimated(true);
        },
        [activeTab]
    );

    const handleColorPickerChange = useCallback(
        (newColor: RGBAColor) => {
            updateColor(newColor);
        },
        [updateColor]
    );

    const handlePaletteColorClick = useCallback(
        (paletteColor: RGBAColor) => {
            updateColor(paletteColor);
            addToRecentColors(paletteColor);
        },
        [updateColor, addToRecentColors]
    );

    const handleRecentColorClick = useCallback(
        (recentColor: RGBAColor) => {
            updateColor(recentColor);
        },
        [updateColor]
    );

    const handleHexChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setHexValue(value);

            const rgbValues = hexToRgba(value);
            if (rgbValues) {
                const newColor = {
                    ...color,
                    ...rgbValues,
                };
                updateColor(newColor);
            }
        },
        [color, updateColor]
    );

    const handleHexBlur = useCallback(() => {
        setHexValue("");
    }, []);

    const handleHexFocus = useCallback(() => {
        setHexValue(currentHex);
    }, [currentHex]);

    const handleSliderChange = useCallback(
        (channel: keyof RGBAColor, value: number[]) => {
            const newColor = { ...color, [channel]: value[0] };
            updateColor(newColor);
        },
        [color, updateColor]
    );

    const handleRemoveColor = useCallback(() => {
        if (!isSingleColor && removeColor) {
            removeColor(colorIndex);
        }
    }, [isSingleColor, removeColor, colorIndex]);

    // Render slider component
    const renderSlider = useCallback(
        (
            channel: keyof RGBAColor,
            label: string,
            max: number,
            step: number,
            format?: (val: number) => string
        ) => {
            const value =
                channel === "a"
                    ? normalizeAlpha(color[channel])
                    : normalizeColorValue(color[channel]);

            const displayValue = format ? format(value) : value;

            return (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">{label}</Label>
                        <span className="text-muted-foreground text-xs">
                            {displayValue}
                        </span>
                    </div>
                    <Slider
                        value={[value]}
                        onValueChange={(val) =>
                            handleSliderChange(channel, val)
                        }
                        max={max}
                        min={0}
                        step={step}
                        className="w-full"
                    />
                </div>
            );
        },
        [color, handleSliderChange]
    );

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger className={cn("w-full", className)}>
                {children || (
                    <div className="group border-input bg-background ring-offset-background hover:border-primary focus:ring-ring flex h-10 items-center gap-2 rounded-md border px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none">
                        <div
                            className="h-5 w-5 rounded-sm shadow-sm"
                            style={{ backgroundColor: colorString }}
                        />
                        {label && <span className="text-sm">{label}</span>}
                        <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </div>
                )}
            </PopoverTrigger>
            <PopoverContent
                sideOffset={10}
                alignOffset={30}
                className="w-64 overflow-hidden p-0 shadow-xl"
                align="start"
            >
                <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="w-full"
                >
                    <div className="flex items-center justify-between border-b px-3 py-2">
                        <TabsList className="grid h-8 w-32 grid-cols-2">
                            <TabsTrigger value="picker" className="text-xs">
                                Picker
                            </TabsTrigger>
                            <TabsTrigger value="values" className="text-xs">
                                Values
                            </TabsTrigger>
                        </TabsList>
                        <div
                            className="h-6 w-6 rounded-sm border shadow-sm"
                            style={{ backgroundColor: colorString }}
                        />
                    </div>

                    <motion.div
                        animate={{ height: contentHeight }}
                        transition={{
                            duration: hasAnimated ? ANIMATION_DURATION : 0,
                            ease: "easeInOut",
                        }}
                        className="relative overflow-hidden"
                    >
                        <AnimatePresence mode="popLayout">
                            {activeTab === "picker" && (
                                <motion.div
                                    key="picker"
                                    initial={
                                        hasAnimated
                                            ? { opacity: 0.2, x: "-100%" }
                                            : { opacity: 1, x: 0 }
                                    }
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0.2, x: "-100%" }}
                                    transition={{
                                        duration: ANIMATION_DURATION,
                                        ease: "easeInOut",
                                    }}
                                    className="flex h-full flex-col gap-5 p-3"
                                >
                                    <RgbaColorPicker
                                        className="!w-full shrink-0 grow-0 px-1"
                                        color={color}
                                        onChange={handleColorPickerChange}
                                    />

                                    <div className="shrink-0 grow-0">
                                        <Label className="mb-1.5 block text-xs font-medium">
                                            Palette
                                        </Label>
                                        <div className="grid grid-cols-6 gap-1.5">
                                            {COLOR_PALETTE.map(
                                                (paletteColor, index) => (
                                                    <ColorButton
                                                        key={index}
                                                        color={paletteColor}
                                                        onClick={() =>
                                                            handlePaletteColorClick(
                                                                paletteColor
                                                            )
                                                        }
                                                        ariaLabel={`Color ${index + 1}`}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {recentColors &&
                                        recentColors.length > 0 && (
                                            <div className="shrink-0 grow-0">
                                                <Label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium">
                                                    <Clock size={12} />
                                                    Recent
                                                </Label>
                                                <div className="grid grid-cols-6 gap-1.5">
                                                    {recentColors.map(
                                                        (
                                                            recentColor,
                                                            index
                                                        ) => (
                                                            <ColorButton
                                                                key={index}
                                                                color={
                                                                    recentColor
                                                                }
                                                                onClick={() =>
                                                                    handleRecentColorClick(
                                                                        recentColor
                                                                    )
                                                                }
                                                                ariaLabel={`Recent color ${index + 1}`}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {!isSingleColor && (
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="mt-auto"
                                        >
                                            <Button
                                                className="border-destructive text-destructive hover:bg-destructive/10 mt-2 flex w-full items-center justify-center gap-2 border bg-transparent"
                                                variant="outline"
                                                onClick={handleRemoveColor}
                                                size="sm"
                                            >
                                                <Trash2 size={14} />
                                                <span>Remove</span>
                                            </Button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === "values" && (
                                <motion.div
                                    key="values"
                                    initial={
                                        hasAnimated
                                            ? { opacity: 0.2, x: "100%" }
                                            : { opacity: 1, x: 0 }
                                    }
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0.2, x: "100%" }}
                                    transition={{
                                        duration: ANIMATION_DURATION,
                                        ease: "easeInOut",
                                    }}
                                    className="p-3"
                                >
                                    <div className="space-y-4">
                                        {renderSlider("r", "Red", 255, 1)}
                                        {renderSlider("g", "Green", 255, 1)}
                                        {renderSlider("b", "Blue", 255, 1)}

                                        {enableAlpha &&
                                            renderSlider(
                                                "a",
                                                "Opacity",
                                                1,
                                                0.01,
                                                (val) =>
                                                    `${Math.round(val * 100)}%`
                                            )}

                                        <div className="mt-4 space-y-2">
                                            <Label className="text-xs font-medium">
                                                Hex
                                            </Label>
                                            <Input
                                                className="h-8 font-mono text-xs"
                                                value={hexValue || currentHex}
                                                onChange={handleHexChange}
                                                onBlur={handleHexBlur}
                                                onFocus={handleHexFocus}
                                                placeholder="#000000"
                                                maxLength={7}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </Tabs>
            </PopoverContent>
        </Popover>
    );
}
