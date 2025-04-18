"use client";
import React from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import ColorPickerPopover from "@/components/ui/ColorPickerPopover";
import { useHeatmapChartStore } from "@/modules/Heatmap/store";
import { DAY_OF_WEEK } from "@/constants";
import { getFullDayFromAbbr } from "@/utils/date";

export const HeatmapConfig = () => {
    const {
        label_enabled,
        has_border,
        button_hover_enabled,
        tooltip_enabled,
        accent,
        background_color,
        default_box_color,
        text_color,
        toggleBorder,
        toggleButtonHover,
        toggleTooltip,
        toggleAverageOfAllEntries,
        setAccent,
        setBackgroundColor,
        setDefaultBoxColor,
        setTextColor,
        toggleLongestStreak,
        toggleStreak,
        toggleSumOfAllEntries,
        setMetric,
        toggleNumberOfEntries,
        setLongestStreakColor,
        setNumberOfEntriesColor,
        setStreakColor,
        setSumOfAllEntriesColor,
        setAverageOfAllEntriesColor,
        streak_enabled,
        longest_streak_enabled,
        average_of_all_entries_color,
        average_of_all_entries_enabled,
        number_of_entries_enabled,
        longest_streak_color,
        number_of_entries_color,
        streak_color,
        sum_of_all_entries_color,
        sum_of_all_entries_enabled,
        toggleLabel,
        isDayIncludedInStreak,
        toggleDaysToIncludeInStreak,
    } = useHeatmapChartStore((state) => state);

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
                    <Checkbox className="mr-3" checked={streak_enabled} />
                    <span>Streak</span>
                </div>
                <span className="mb-4 block text-[#606060]">
                    Number of consecutive entries. Resets to 0 if a day is
                    missed.
                </span>
                <span
                    className="mb-2 block pl-3 text-[#606060]"
                    style={{
                        display: streak_enabled ? "block" : "none",
                    }}
                >
                    Calculate streak only on the following days
                </span>
                <div
                    className="grid-cols-2 grid-rows-4 px-3"
                    style={{
                        display: streak_enabled ? "grid" : "none",
                    }}
                >
                    {DAY_OF_WEEK.map((abbr) => (
                        <div key={abbr}>
                            <Checkbox
                                className="mr-3"
                                defaultChecked={isDayIncludedInStreak(abbr)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                onCheckedChange={() => {
                                    toggleDaysToIncludeInStreak(abbr);
                                }}
                            />{" "}
                            {getFullDayFromAbbr(abbr)}
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
                            checked={longest_streak_enabled}
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
                        <Checkbox className="mr-3" checked={label_enabled} />
                        <span>Toggle Label</span>
                    </div>
                    <span className="block text-[#606060]">
                        Longest streak of consecutive entries.
                    </span>
                </div>

                <div
                    className="cursor-pointer select-none rounded border px-5 py-5"
                    onClick={toggleSumOfAllEntries}
                >
                    <div className="flex items-center">
                        <Checkbox
                            className="mr-3"
                            checked={sum_of_all_entries_enabled}
                        />
                        <span>Total</span>
                    </div>
                    <span className="block text-[#606060]">
                        Sum of all your entries.
                    </span>
                </div>

                <div
                    className="cursor-pointer select-none rounded border px-5 py-5"
                    onClick={toggleTooltip}
                >
                    <div className="flex items-center">
                        <Checkbox className="mr-3" checked={tooltip_enabled} />
                        <span>Toggle Tooltip</span>
                    </div>
                    <span className="block text-[#606060]">
                        Longest streak of consecutive entries.
                    </span>
                </div>

                <div
                    className="cursor-pointer select-none rounded border px-5 py-5"
                    onClick={toggleAverageOfAllEntries}
                >
                    <div className="flex items-center">
                        <Checkbox
                            className="mr-3"
                            checked={average_of_all_entries_enabled}
                        />
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
                        <Checkbox className="mr-3" checked={has_border} />
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
                            checked={number_of_entries_enabled}
                        />
                        <span>Number of entries</span>
                    </div>
                    <span className="block text-[#606060]">
                        Number of entries recorded.
                    </span>
                </div>

                <div
                    className="cursor-pointer select-none rounded border px-5 py-5"
                    onClick={toggleButtonHover}
                >
                    <div className="flex items-center">
                        <Checkbox
                            className="mr-3"
                            checked={button_hover_enabled}
                        />
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
                    color={background_color}
                    setColor={setBackgroundColor}
                    isSingleColor
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${background_color.r}, ${background_color.g}, ${background_color.b} , ${background_color.a})`,
                        }}
                    />
                </ColorPickerPopover>
                <ColorPickerPopover
                    color={text_color}
                    setColor={setTextColor}
                    isSingleColor
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${text_color.r}, ${text_color.g}, ${text_color.b} , ${text_color.a})`,
                        }}
                    />
                </ColorPickerPopover>
                <ColorPickerPopover
                    isSingleColor
                    color={default_box_color}
                    setColor={setDefaultBoxColor}
                    enableAlpha={false}
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${default_box_color.r}, ${default_box_color.g}, ${default_box_color.b})`,
                        }}
                    />
                </ColorPickerPopover>

                <ColorPickerPopover
                    isSingleColor
                    color={accent}
                    setColor={setAccent}
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
                    color={longest_streak_color}
                    setColor={setLongestStreakColor}
                    isSingleColor
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${longest_streak_color.r}, ${longest_streak_color.g}, ${longest_streak_color.b} , ${longest_streak_color.a})`,
                        }}
                    />
                </ColorPickerPopover>
                <ColorPickerPopover
                    color={streak_color}
                    setColor={setStreakColor}
                    isSingleColor
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${streak_color.r}, ${streak_color.g}, ${streak_color.b} , ${streak_color.a})`,
                        }}
                    />
                </ColorPickerPopover>
                <ColorPickerPopover
                    isSingleColor
                    color={sum_of_all_entries_color}
                    setColor={setSumOfAllEntriesColor}
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${sum_of_all_entries_color.r}, ${sum_of_all_entries_color.g}, ${sum_of_all_entries_color.b} , ${sum_of_all_entries_color.a})`,
                        }}
                    />
                </ColorPickerPopover>

                <ColorPickerPopover
                    isSingleColor
                    color={number_of_entries_color}
                    setColor={setNumberOfEntriesColor}
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${number_of_entries_color.r}, ${number_of_entries_color.g}, ${number_of_entries_color.b} , ${number_of_entries_color.a})`,
                        }}
                    />
                </ColorPickerPopover>

                <ColorPickerPopover
                    isSingleColor
                    color={average_of_all_entries_color}
                    setColor={setAverageOfAllEntriesColor}
                >
                    <div
                        className="grid cursor-pointer border py-7"
                        style={{
                            backgroundColor: `rgba(${average_of_all_entries_color.r}, ${average_of_all_entries_color.g}, ${average_of_all_entries_color.b} , ${average_of_all_entries_color.a})`,
                        }}
                    />
                </ColorPickerPopover>
            </div>
        </div>
    );
};
