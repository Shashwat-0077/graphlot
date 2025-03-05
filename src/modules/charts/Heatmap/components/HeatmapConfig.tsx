"use client";
import React from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import ColorPickerPopover from "@/components/ui/ColorPickerPopover";

import { ChartConfigComponentType } from "../../types";
import { useHeatmapChartAppearanceStore } from "../state/provider/heatmap-store-provider";
import { type DayOfWeek } from "../state/store/appearance-store";

export const HeatmapConfig: ChartConfigComponentType = () => {
    const {
        showLabel,
        showBorder,
        buttonOnHover,
        showToolTip,
        average,
        accent,
        bgColor,
        defaultBoxColor,
        longestStreak,
        streak,
        total,
        textColor,
        numberOfEntries,

        toggleBorder,
        toggleButtonOnHover,
        toggleLabel,
        toggleToolTip,
        toggleAvg,
        setAscentColor,
        setBgColor,
        setDefaultBoxColor,
        setTextColor,
        toggleLongestStreak,
        toggleStreak,
        toggleTotal,
        setMetric,
        toggleDayToContInStreak,
        isDayPresentInArray,
        toggleNumberOfEntries,
        setLongestStreakColor,
        setNumberOfEntriesColor,
        setStreakColor,
        setTotalColor,
        setAverageColor,
    } = useHeatmapChartAppearanceStore((state) => state);

    return (
        <div className="mb-7 mt-16 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <Label>Metric</Label>
                <Input
                    onChange={(e) => {
                        setMetric(e.target.value);
                    }}
                    placeholder="Enter you metric"
                />
            </div>

            <div
                className="cursor-pointer select-none rounded border px-5 py-5"
                onClick={() => {
                    toggleStreak();
                }}
            >
                <div className="flex items-center">
                    <Checkbox className="mr-3" checked={streak.show} />
                    <span>Streak</span>
                </div>
                <span className="mb-4 block text-[#606060]">
                    Number of consecutive entries. Resets to 0 if a day is
                    missed.
                </span>
                <span
                    className="mb-2 block pl-3 text-[#606060]"
                    style={{
                        display: streak.show ? "block" : "none",
                    }}
                >
                    Calculate streak only on the following days
                </span>
                <div
                    className="grid-cols-2 grid-rows-4 px-3"
                    style={{
                        display: streak.show ? "grid" : "none",
                    }}
                >
                    {[
                        ["Sun", "Sunday"],
                        ["Mon", "Monday"],
                        ["Tue", "Tuesday"],
                        ["Wed", "Wednesday"],
                        ["Thu", "Thursday"],
                        ["Fri", "Friday"],
                        ["Sat", "Saturday"],
                    ].map(([abbr, day]) => (
                        <div key={day}>
                            <Checkbox
                                key={day}
                                className="mr-3"
                                defaultChecked={isDayPresentInArray(
                                    abbr as DayOfWeek
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                onCheckedChange={() => {
                                    toggleDayToContInStreak(abbr as DayOfWeek);
                                }}
                            />{" "}
                            {day}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 grid-rows-4 gap-5">
                <div
                    className="cursor-pointer select-none rounded border px-5 py-5"
                    onClick={toggleLongestStreak}
                >
                    <div className="flex items-center">
                        <Checkbox
                            className="mr-3"
                            checked={longestStreak.show}
                        />
                        <span>Longest Streak</span>
                    </div>
                    <span className="block text-[#606060]">
                        Longest streak of consecutive entries.
                    </span>
                </div>

                <div
                    className="cursor-pointer select-none rounded border px-5 py-5"
                    onClick={toggleLabel}
                >
                    <div className="flex items-center">
                        <Checkbox className="mr-3" checked={showLabel} />
                        <span>Toggle Label</span>
                    </div>
                    <span className="block text-[#606060]">
                        Longest streak of consecutive entries.
                    </span>
                </div>

                <div
                    className="cursor-pointer select-none rounded border px-5 py-5"
                    onClick={toggleTotal}
                >
                    <div className="flex items-center">
                        <Checkbox className="mr-3" checked={total.show} />
                        <span>Total</span>
                    </div>
                    <span className="block text-[#606060]">
                        Sum of all your entries.
                    </span>
                </div>

                <div
                    className="cursor-pointer select-none rounded border px-5 py-5"
                    onClick={toggleToolTip}
                >
                    <div className="flex items-center">
                        <Checkbox className="mr-3" checked={showToolTip} />
                        <span>Toggle Tooltip</span>
                    </div>
                    <span className="block text-[#606060]">
                        Longest streak of consecutive entries.
                    </span>
                </div>

                <div
                    className="cursor-pointer select-none rounded border px-5 py-5"
                    onClick={toggleAvg}
                >
                    <div className="flex items-center">
                        <Checkbox className="mr-3" checked={average.show} />
                        <span>Average</span>
                    </div>
                    <span className="block text-[#606060]">
                        Statical Average of all your entries.
                    </span>
                </div>

                <div
                    className="cursor-pointer select-none rounded border px-5 py-5"
                    onClick={toggleBorder}
                >
                    <div className="flex items-center">
                        <Checkbox className="mr-3" checked={showBorder} />
                        <span>Toggle Border</span>
                    </div>
                    <span className="block text-[#606060]">
                        Longest streak of consecutive entries.
                    </span>
                </div>

                <div
                    className="cursor-pointer select-none rounded border px-5 py-5"
                    onClick={toggleNumberOfEntries}
                >
                    <div className="flex items-center">
                        <Checkbox
                            className="mr-3"
                            checked={numberOfEntries.show}
                        />
                        <span>Number of entries</span>
                    </div>
                    <span className="block text-[#606060]">
                        Number of entries recorded.
                    </span>
                </div>

                <div
                    className="cursor-pointer select-none rounded border px-5 py-5"
                    onClick={toggleButtonOnHover}
                >
                    <div className="flex items-center">
                        <Checkbox className="mr-3" checked={buttonOnHover} />
                        <span>Toggle Button Hover</span>
                    </div>
                    <span className="block text-[#606060]">
                        Longest streak of consecutive entries.
                    </span>
                </div>
            </div>

            <div className="grid-row-2 grid grid-cols-4 rounded border">
                <div className="grid place-content-center border py-5">
                    Background Color
                </div>
                <div className="grid place-content-center border py-5">
                    Text Color
                </div>
                <div className="grid place-content-center border py-5">
                    Default Checkbox Color
                </div>
                <div className="grid place-content-center border py-5">
                    Accent Color
                </div>
                <ColorPickerPopover
                    color={bgColor}
                    setColor={setBgColor}
                    isSingleColor
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b} , ${bgColor.a})`,
                        }}
                    />
                </ColorPickerPopover>
                <ColorPickerPopover
                    color={textColor}
                    setColor={setTextColor}
                    isSingleColor
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${textColor.r}, ${textColor.g}, ${textColor.b} , ${textColor.a})`,
                        }}
                    />
                </ColorPickerPopover>
                <ColorPickerPopover
                    isSingleColor
                    color={defaultBoxColor}
                    setColor={setDefaultBoxColor}
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${defaultBoxColor.r}, ${defaultBoxColor.g}, ${defaultBoxColor.b} , ${defaultBoxColor.a})`,
                        }}
                    />
                </ColorPickerPopover>

                <ColorPickerPopover
                    isSingleColor
                    color={accent}
                    setColor={setAscentColor}
                    enableAlpha={false}
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${accent.r}, ${accent.g}, ${accent.b})`,
                        }}
                    />
                </ColorPickerPopover>
            </div>

            {/* 
                // TODO : add functionality to change icon for these
            */}

            <div className="grid-row-2 grid grid-cols-5 rounded border">
                <div className="grid place-content-center border py-5">
                    Longest Streak
                </div>
                <div className="grid place-content-center border py-5">
                    Streak
                </div>
                <div className="grid place-content-center border py-5">
                    Total
                </div>
                <div className="grid place-content-center border py-5">
                    Number of Entries
                </div>
                <div className="grid place-content-center border py-5">
                    Average
                </div>
                <ColorPickerPopover
                    color={longestStreak.color}
                    setColor={setLongestStreakColor}
                    isSingleColor
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${longestStreak.color.r}, ${longestStreak.color.g}, ${longestStreak.color.b} , ${longestStreak.color.a})`,
                        }}
                    />
                </ColorPickerPopover>
                <ColorPickerPopover
                    color={streak.color}
                    setColor={setStreakColor}
                    isSingleColor
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${streak.color.r}, ${streak.color.g}, ${streak.color.b} , ${streak.color.a})`,
                        }}
                    />
                </ColorPickerPopover>
                <ColorPickerPopover
                    isSingleColor
                    color={total.color}
                    setColor={setTotalColor}
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${total.color.r}, ${total.color.g}, ${total.color.b} , ${total.color.a})`,
                        }}
                    />
                </ColorPickerPopover>

                <ColorPickerPopover
                    isSingleColor
                    color={numberOfEntries.color}
                    setColor={setNumberOfEntriesColor}
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${numberOfEntries.color.r}, ${numberOfEntries.color.g}, ${numberOfEntries.color.b} , ${numberOfEntries.color.a})`,
                        }}
                    />
                </ColorPickerPopover>

                <ColorPickerPopover
                    isSingleColor
                    color={average.color}
                    setColor={setAverageColor}
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${average.color.r}, ${average.color.g}, ${average.color.b} , ${average.color.a})`,
                        }}
                    />
                </ColorPickerPopover>
            </div>
        </div>
    );
};
