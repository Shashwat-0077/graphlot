"use client";

import type React from "react";
import { RgbaColorPicker } from "react-colorful";
import { Trash2, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    const colorString = `rgba(${color.r !== -Number.MIN_VALUE ? color.r : 0}, ${
        color.g !== -Number.MIN_VALUE ? color.g : 0
    }, ${color.b !== -Number.MIN_VALUE ? color.b : 0}, ${color.a === -Number.MIN_VALUE ? 1 : color.a})`;

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
    };

    return (
        <Popover>
            <PopoverTrigger className={cn("w-full", className)}>
                {children || (
                    <div className="group flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        <div
                            className="h-5 w-5 rounded-sm shadow-sm transition-transform group-hover:scale-110"
                            style={{ backgroundColor: colorString }}
                        />
                        {label && <span className="text-sm">{label}</span>}
                        <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </div>
                )}
            </PopoverTrigger>
            <PopoverContent
                sideOffset={10}
                className="w-64 p-0 shadow-xl"
                align="start"
            >
                <Tabs defaultValue="picker" className="w-full">
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

                    <TabsContent value="picker" className="space-y-3 p-3">
                        <RgbaColorPicker
                            className="!w-full"
                            color={color}
                            onChange={(color) => {
                                if (isSingleColor) {
                                    setColor(color);
                                } else {
                                    setColor(colorIndex, color);
                                }
                            }}
                        />

                        <div className="mt-3">
                            <Label className="mb-1.5 block text-xs font-medium">
                                Palette
                            </Label>
                            <div className="grid grid-cols-6 gap-1.5">
                                {colorPalette.map((paletteColor, index) => (
                                    <button
                                        key={index}
                                        className="h-6 w-6 rounded-sm border shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring"
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
                                ))}
                            </div>
                        </div>

                        {!isSingleColor && (
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
                        )}
                    </TabsContent>

                    <TabsContent value="values" className="p-3">
                        <div className="grid gap-2">
                            <div className="grid grid-cols-[2rem_1fr] items-center gap-2">
                                <Label className="text-center text-xs font-medium">
                                    R
                                </Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="255"
                                    value={
                                        color.r !== -Number.MIN_VALUE
                                            ? color.r
                                            : ""
                                    }
                                    onChange={(e) => {
                                        const c = Number.parseInt(
                                            e.target.value
                                        );
                                        const newColor = {
                                            ...color,
                                            r: isNaN(c)
                                                ? -Number.MIN_VALUE
                                                : Math.min(255, Math.max(0, c)),
                                        };

                                        if (isSingleColor) {
                                            setColor(newColor);
                                        } else {
                                            setColor(colorIndex, newColor);
                                        }
                                    }}
                                    className="h-8"
                                />
                            </div>
                            <div className="grid grid-cols-[2rem_1fr] items-center gap-2">
                                <Label className="text-center text-xs font-medium">
                                    G
                                </Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="255"
                                    value={
                                        color.g !== -Number.MIN_VALUE
                                            ? color.g
                                            : ""
                                    }
                                    onChange={(e) => {
                                        const c = Number.parseInt(
                                            e.target.value
                                        );
                                        const newColor = {
                                            ...color,
                                            g: isNaN(c)
                                                ? -Number.MIN_VALUE
                                                : Math.min(255, Math.max(0, c)),
                                        };

                                        if (isSingleColor) {
                                            setColor(newColor);
                                        } else {
                                            setColor(colorIndex, newColor);
                                        }
                                    }}
                                    className="h-8"
                                />
                            </div>
                            <div className="grid grid-cols-[2rem_1fr] items-center gap-2">
                                <Label className="text-center text-xs font-medium">
                                    B
                                </Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="255"
                                    value={
                                        color.b !== -Number.MIN_VALUE
                                            ? color.b
                                            : ""
                                    }
                                    onChange={(e) => {
                                        const c = Number.parseInt(
                                            e.target.value
                                        );
                                        const newColor = {
                                            ...color,
                                            b: isNaN(c)
                                                ? -Number.MIN_VALUE
                                                : Math.min(255, Math.max(0, c)),
                                        };

                                        if (isSingleColor) {
                                            setColor(newColor);
                                        } else {
                                            setColor(colorIndex, newColor);
                                        }
                                    }}
                                    className="h-8"
                                />
                            </div>
                            {enableAlpha && (
                                <div className="grid grid-cols-[2rem_1fr] items-center gap-2">
                                    <Label className="text-center text-xs font-medium">
                                        A
                                    </Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={
                                            color.a === -Number.MIN_VALUE
                                                ? ""
                                                : color.a
                                        }
                                        onChange={(e) => {
                                            const a = Number.parseFloat(
                                                e.target.value
                                            );
                                            const newColor = {
                                                ...color,
                                                a: isNaN(a)
                                                    ? -Number.MIN_VALUE
                                                    : Math.min(
                                                          1,
                                                          Math.max(0, a)
                                                      ),
                                            };

                                            if (isSingleColor) {
                                                setColor(newColor);
                                            } else {
                                                setColor(colorIndex, newColor);
                                            }
                                        }}
                                        className="h-8"
                                    />
                                </div>
                            )}

                            <div className="mt-2">
                                <Label className="mb-1 block text-xs font-medium">
                                    Hex
                                </Label>
                                <Input
                                    className="h-8 font-mono text-xs"
                                    value={`#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`}
                                    readOnly
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </PopoverContent>
        </Popover>
    );
}
