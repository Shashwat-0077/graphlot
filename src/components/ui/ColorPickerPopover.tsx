"use client";

import type React from "react";
import { RgbaColorPicker } from "react-colorful";
import { Trash2, ChevronDown, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
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

type ColorPickerPopoverProps =
    | {
          children?: React.ReactNode;
          isSingleColor: false;
          className?: string;
          colorIndex: number;
          removeColor: (index: number) => void;
          color: { r: number; g: number; b: number; a: number };
          setColor: (
              index: number,
              color: {
                  r: number;
                  g: number;
                  b: number;
                  a: number;
              }
          ) => void;
          enableAlpha?: boolean;
          label?: string;
      }
    | {
          children?: React.ReactNode;
          isSingleColor: true;
          colorIndex?: never;
          className?: string;
          removeColor?: never;
          color: { r: number; g: number; b: number; a: number };
          setColor: (color: {
              r: number;
              g: number;
              b: number;
              a: number;
          }) => void;
          enableAlpha?: boolean;
          label?: string;
      };

const MAX_RECENT_COLORS = 12;

// Global state for recent colors that persists across all instances
let globalRecentColors: Array<{ r: number; g: number; b: number; a: number }> =
    [];
const recentColorListeners = new Set<
    (colors: Array<{ r: number; g: number; b: number; a: number }>) => void
>();

// Helper functions for global recent colors management
const addRecentColorListener = (
    listener: (
        colors: Array<{ r: number; g: number; b: number; a: number }>
    ) => void
) => {
    recentColorListeners.add(listener);
    listener(globalRecentColors); // Initialize with current colors
};

const removeRecentColorListener = (
    listener: (
        colors: Array<{ r: number; g: number; b: number; a: number }>
    ) => void
) => {
    recentColorListeners.delete(listener);
};

const updateGlobalRecentColors = (
    newColors: Array<{ r: number; g: number; b: number; a: number }>
) => {
    globalRecentColors = newColors;
    recentColorListeners.forEach((listener) => listener(newColors));
};

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
    const [hexValue, setHexValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("picker");
    const [hasAnimated, setHasAnimated] = useState(false);
    const [recentColors, setRecentColors] =
        useState<Array<{ r: number; g: number; b: number; a: number }>>(
            globalRecentColors
        );

    // Track the initial color when popover opens to compare on close
    const initialColorRef = useRef<{
        r: number;
        g: number;
        b: number;
        a: number;
    } | null>(null);

    // Set up listener for global recent colors
    useEffect(() => {
        const updateLocalRecentColors = (
            colors: Array<{ r: number; g: number; b: number; a: number }>
        ) => {
            setRecentColors(colors);
        };

        addRecentColorListener(updateLocalRecentColors);

        return () => {
            removeRecentColorListener(updateLocalRecentColors);
        };
    }, []);

    // Helper function to check if two colors are the same
    const colorsAreEqual = (
        color1: { r: number; g: number; b: number; a: number },
        color2: { r: number; g: number; b: number; a: number }
    ) => {
        return (
            color1.r === color2.r &&
            color1.g === color2.g &&
            color1.b === color2.b &&
            color1.a === color2.a
        );
    };

    // Helper function to save color to recent colors
    const saveToRecentColors = (newColor: {
        r: number;
        g: number;
        b: number;
        a: number;
    }) => {
        // Check if color already exists
        const colorExists = globalRecentColors.some((c) =>
            colorsAreEqual(c, newColor)
        );

        if (colorExists) {
            return; // Don't add duplicate
        }

        // Add new color to the beginning and limit to MAX_RECENT_COLORS
        const updatedColors = [newColor, ...globalRecentColors].slice(
            0,
            MAX_RECENT_COLORS
        );
        updateGlobalRecentColors(updatedColors);
    };

    // Handle popover open/close
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);

        if (open) {
            // Store initial color when opening
            initialColorRef.current = { ...color };
            // Reset animation state when opening
            setHasAnimated(false);
        } else {
            // Save color when closing (if it changed)
            if (
                initialColorRef.current &&
                !colorsAreEqual(initialColorRef.current, color)
            ) {
                saveToRecentColors(color);
            }
        }
    };

    // Handle tab change with smooth transition
    const handleTabChange = (newTab: string) => {
        if (newTab === activeTab) {
            return;
        }
        setActiveTab(newTab);
        setHasAnimated(true); // Enable animations after first tab change
    };

    // Helper function to convert RGBA to hex
    const rgbaToHex = (r: number, g: number, b: number) => {
        const toHex = (n: number) => {
            const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    // Helper function to convert hex to RGBA
    const hexToRgba = (hex: string) => {
        const cleanHex = hex.replace("#", "");
        if (cleanHex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
            return null;
        }

        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);

        return { r, g, b };
    };

    const colorString = `rgba(${color.r !== -Number.MIN_VALUE ? color.r : 0}, ${
        color.g !== -Number.MIN_VALUE ? color.g : 0
    }, ${color.b !== -Number.MIN_VALUE ? color.b : 0}, ${color.a === -Number.MIN_VALUE ? 1 : color.a})`;

    // Get current hex value from color
    const currentHex = rgbaToHex(
        color.r !== -Number.MIN_VALUE ? color.r : 0,
        color.g !== -Number.MIN_VALUE ? color.g : 0,
        color.b !== -Number.MIN_VALUE ? color.b : 0
    );

    // Predefined color palette
    const colorPalette = [
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

    // Handle palette color click - save immediately for discrete selections
    const handlePaletteColorClick = (paletteColor: {
        r: number;
        g: number;
        b: number;
        a: number;
    }) => {
        if (isSingleColor) {
            setColor(paletteColor);
        } else {
            setColor(colorIndex, paletteColor);
        }
        saveToRecentColors(paletteColor);
    };

    // Handle recent color click - don't save again since it's already in recent
    const handleRecentColorClick = (recentColor: {
        r: number;
        g: number;
        b: number;
        a: number;
    }) => {
        if (isSingleColor) {
            setColor(recentColor);
        } else {
            setColor(colorIndex, recentColor);
        }
    };

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setHexValue(value);

        // Convert hex to RGB and update color
        const rgbValues = hexToRgba(value);
        if (rgbValues) {
            const newColor = {
                ...color,
                r: rgbValues.r,
                g: rgbValues.g,
                b: rgbValues.b,
            };

            if (isSingleColor) {
                setColor(newColor);
            } else {
                setColor(colorIndex, newColor);
            }
        }
    };

    const handleHexBlur = () => {
        // Reset hex input to current color value on blur if invalid
        setHexValue("");
    };

    // Handle slider value changes
    const handleSliderChange = (
        channel: "r" | "g" | "b" | "a",
        value: number[]
    ) => {
        const newValue = value[0];
        const newColor = { ...color, [channel]: newValue };

        if (isSingleColor) {
            setColor(newColor);
        } else {
            setColor(colorIndex, newColor);
        }
    };

    const getContentHeight = () => {
        if (activeTab === "picker") {
            // Base height + color picker + palette + potential recent colors + potential remove button
            let height = 320; // Base picker height
            if (recentColors && recentColors.length > 0) {
                height += 85;
            } // Recent colors section
            if (!isSingleColor) {
                height += 40;
            } // Remove button
            return height;
        } else {
            // Values tab height: 4 sliders + hex input + spacing
            return enableAlpha ? 280 : 280;
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger className={cn("w-full", className)}>
                {children || (
                    <div className="group flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
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
                        animate={{ height: getContentHeight() }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative overflow-hidden"
                    >
                        <AnimatePresence mode="popLayout">
                            {activeTab === "picker" && (
                                <motion.div
                                    key="picker"
                                    initial={
                                        hasAnimated
                                            ? {
                                                  opacity: 0.2,
                                                  x: "-100%",
                                              }
                                            : {
                                                  opacity: 1,
                                                  x: 0,
                                              }
                                    }
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    exit={{
                                        opacity: 0.2,
                                        x: "-100%",
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut",
                                    }}
                                    className="space-y-3 p-3"
                                >
                                    <RgbaColorPicker
                                        className="!w-full px-1"
                                        color={color}
                                        onChange={(newColor) => {
                                            if (isSingleColor) {
                                                setColor(newColor);
                                            } else {
                                                setColor(colorIndex, newColor);
                                            }
                                        }}
                                    />

                                    <div className="mt-3">
                                        <Label className="mb-1.5 block text-xs font-medium">
                                            Palette
                                        </Label>
                                        <div className="grid grid-cols-6 gap-1.5">
                                            {colorPalette.map(
                                                (paletteColor, index) => (
                                                    <motion.button
                                                        key={index}
                                                        whileHover={{
                                                            scale: 1.1,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.95,
                                                        }}
                                                        className="h-6 w-6 rounded-sm border shadow-sm transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring"
                                                        style={{
                                                            backgroundColor: `rgba(${paletteColor.r}, ${paletteColor.g}, ${paletteColor.b}, ${paletteColor.a})`,
                                                        }}
                                                        onClick={() =>
                                                            handlePaletteColorClick(
                                                                paletteColor
                                                            )
                                                        }
                                                        aria-label={`Color ${index + 1}`}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {recentColors &&
                                        recentColors.length > 0 && (
                                            <div className="mt-3">
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
                                                            <motion.button
                                                                key={index}
                                                                whileHover={{
                                                                    scale: 1.1,
                                                                }}
                                                                whileTap={{
                                                                    scale: 0.95,
                                                                }}
                                                                className="h-6 w-6 rounded-sm border shadow-sm transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring"
                                                                style={{
                                                                    backgroundColor: `rgba(${recentColor.r}, ${recentColor.g}, ${recentColor.b}, ${recentColor.a})`,
                                                                }}
                                                                onClick={() =>
                                                                    handleRecentColorClick(
                                                                        recentColor
                                                                    )
                                                                }
                                                                aria-label={`Recent color ${index + 1}`}
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
                                        >
                                            <Button
                                                className="mt-2 flex w-full items-center justify-center gap-2 border border-destructive bg-transparent text-destructive hover:bg-destructive/10"
                                                variant="outline"
                                                onClick={() => {
                                                    removeColor(colorIndex);
                                                }}
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
                                            ? {
                                                  opacity: 0.2,
                                                  x: "100%",
                                              }
                                            : {
                                                  opacity: 1,
                                                  x: 0,
                                              }
                                    }
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0.2, x: "100%" }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut",
                                    }}
                                    className="p-3"
                                >
                                    <div className="space-y-4">
                                        {/* Red Slider */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs font-medium">
                                                    Red
                                                </Label>
                                                <span className="text-xs text-muted-foreground">
                                                    {color.r !==
                                                    -Number.MIN_VALUE
                                                        ? color.r
                                                        : 0}
                                                </span>
                                            </div>
                                            <Slider
                                                value={[
                                                    color.r !==
                                                    -Number.MIN_VALUE
                                                        ? color.r
                                                        : 0,
                                                ]}
                                                onValueChange={(value) =>
                                                    handleSliderChange(
                                                        "r",
                                                        value
                                                    )
                                                }
                                                max={255}
                                                min={0}
                                                step={1}
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Green Slider */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs font-medium">
                                                    Green
                                                </Label>
                                                <span className="text-xs text-muted-foreground">
                                                    {color.g !==
                                                    -Number.MIN_VALUE
                                                        ? color.g
                                                        : 0}
                                                </span>
                                            </div>
                                            <Slider
                                                value={[
                                                    color.g !==
                                                    -Number.MIN_VALUE
                                                        ? color.g
                                                        : 0,
                                                ]}
                                                onValueChange={(value) =>
                                                    handleSliderChange(
                                                        "g",
                                                        value
                                                    )
                                                }
                                                max={255}
                                                min={0}
                                                step={1}
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Blue Slider */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs font-medium">
                                                    Blue
                                                </Label>
                                                <span className="text-xs text-muted-foreground">
                                                    {color.b !==
                                                    -Number.MIN_VALUE
                                                        ? color.b
                                                        : 0}
                                                </span>
                                            </div>
                                            <Slider
                                                value={[
                                                    color.b !==
                                                    -Number.MIN_VALUE
                                                        ? color.b
                                                        : 0,
                                                ]}
                                                onValueChange={(value) =>
                                                    handleSliderChange(
                                                        "b",
                                                        value
                                                    )
                                                }
                                                max={255}
                                                min={0}
                                                step={1}
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Alpha Slider */}
                                        {enableAlpha && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-xs font-medium">
                                                        Opacity
                                                    </Label>
                                                    <span className="text-xs text-muted-foreground">
                                                        {color.a ===
                                                        -Number.MIN_VALUE
                                                            ? 1
                                                            : Math.round(
                                                                  color.a * 100
                                                              )}
                                                        %
                                                    </span>
                                                </div>
                                                <Slider
                                                    value={[
                                                        color.a ===
                                                        -Number.MIN_VALUE
                                                            ? 1
                                                            : color.a,
                                                    ]}
                                                    onValueChange={(value) =>
                                                        handleSliderChange(
                                                            "a",
                                                            value
                                                        )
                                                    }
                                                    max={1}
                                                    min={0}
                                                    step={0.01}
                                                    className="w-full"
                                                />
                                            </div>
                                        )}

                                        {/* Hex Input */}
                                        <div className="mt-4 space-y-2">
                                            <Label className="text-xs font-medium">
                                                Hex
                                            </Label>
                                            <Input
                                                className="h-8 font-mono text-xs"
                                                value={hexValue || currentHex}
                                                onChange={handleHexChange}
                                                onBlur={handleHexBlur}
                                                onFocus={() =>
                                                    setHexValue(currentHex)
                                                }
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
