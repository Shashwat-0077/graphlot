"use client";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";

import { Label } from "@/components/ui/label";
import { useChartConfigStore } from "@/components/providers/ChartConfigStoreProvider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import ColorPickerPopover from "@/components/ui/ColorPickerPopover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import ClearAll from "../ClearAll";
import { useGetDatabaseSchema } from "../../../notion/api/useGetDatabaseSchema";

export default function ChartConfigs({}) {
    const colorSectionHeight = 120; // in px
    const filterSectionHeight = 500; // in px

    const { data, isLoading } = useGetDatabaseSchema();

    // TODO : make the data state independent and only add them when the button is clicked
    // TODO : Donut and heatmap will have different style of input

    const {
        type: chartType,
        showLabel: isLabelOn,
        colors,
        bgColor,
        filters,
        showGrid,
        gridColor,
        showLegends,
        showToolTip,
        setColor,
        setLabel,
        setBGColor,
        setXAxis,
        setYAxis,
        setGridColor,
        setFilterValue,
        setFilterColumn,
        setFilterOperation,
        toggleGrid,
        toggleLabel,
        toggleLegends,
        toggleToolTip,
        clearColors,
        clearFilters,
        addColor,
        addFilter,
        removeColor,
        removeFilter,
        changeChartType,
    } = useChartConfigStore((state) => state);

    if (isLoading) {
        return (
            <div className="mb-7 mt-16 flex flex-col gap-10 break1200:grid break1200:grid-cols-[.5fr_1fr]">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="row-span-2 min-h-96 w-full" />
                <Skeleton className="min-h-96 w-full" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="mb-7 mt-16 flex flex-col gap-10 break1200:grid break1200:grid-cols-[.5fr_1fr]">
                <div className="text-2xl font-bold">No Data Available</div>
            </div>
        );
    }

    const XAxisColumns = [];
    const YAxisColumns = [];

    for (const col in data) {
        switch (chartType) {
            case "Radar":
                if (
                    data[col].type === "select" ||
                    data[col].type === "status" ||
                    data[col].type === "multi_select"
                ) {
                    YAxisColumns.push(col);
                    XAxisColumns.push(col);
                }
                break;
            case "Area":
            case "Bar":
                if (
                    data[col].type === "number" ||
                    data[col].type === "status" ||
                    data[col].type === "select" ||
                    data[col].type === "multi_select" ||
                    data[col].type === "date"
                ) {
                    YAxisColumns.push(col);
                    XAxisColumns.push(col);
                }
                break;
            default:
                break;
        }
    }

    return (
        <div className="mb-7 mt-16 flex flex-col gap-10 break1200:grid break1200:grid-cols-[.5fr_1fr]">
            {/* Colors */}
            <section className="relative flex flex-col gap-7 rounded-lg border p-10">
                <Label className="absolute -top-4 left-2 bg-background px-3 text-2xl font-bold">
                    Colors
                </Label>

                {/* Background Color */}
                <div className="w-full">
                    <Label className="mb-2 block text-lg">
                        Background Color
                    </Label>
                    <ColorPickerPopover
                        isSingleColor={true}
                        color={bgColor}
                        setColor={setBGColor}
                    >
                        <div
                            className="h-8 w-full shrink-0 grow-0 cursor-pointer rounded border"
                            style={{
                                backgroundColor: `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})`,
                            }}
                        />
                    </ColorPickerPopover>
                </div>

                {/* 
                    // TODO : Add the functionality to change the color of the legends and the chart label and axis labels
                */}

                {/* Grid Color */}
                <div className="w-full">
                    <Label className="mb-2 block text-lg">Grid Color</Label>
                    <ColorPickerPopover
                        isSingleColor={true}
                        color={gridColor}
                        setColor={setGridColor}
                    >
                        <div
                            className="h-8 w-full shrink-0 grow-0 cursor-pointer rounded border"
                            style={{
                                backgroundColor: `rgba(${gridColor.r}, ${gridColor.g}, ${gridColor.b}, ${gridColor.a})`,
                            }}
                        />
                    </ColorPickerPopover>
                </div>

                {/* Chart Colors */}
                <div>
                    <Label className="flex items-center gap-3 text-lg">
                        <span>Color</span>
                        <ClearAll clearFn={clearColors} />
                    </Label>
                    <ScrollArea
                        style={{
                            height: `${colorSectionHeight}px`,
                        }}
                    >
                        <div className="flex flex-wrap items-center gap-2">
                            {colors.map((color, index) => (
                                <ColorPickerPopover
                                    key={index}
                                    isSingleColor={false}
                                    color={color}
                                    className="w-auto"
                                    colorIndex={index}
                                    setColor={setColor}
                                    removeColor={removeColor}
                                >
                                    <div
                                        className="h-8 w-20 shrink-0 grow-0 cursor-pointer rounded border transition-transform hover:scale-105"
                                        style={{
                                            backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
                                        }}
                                    />
                                </ColorPickerPopover>
                            ))}
                            <div
                                className="grid h-8 w-20 cursor-pointer place-content-center rounded border"
                                onClick={() => {
                                    addColor();
                                }}
                            >
                                <Plus />
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </section>

            {/* Data */}
            <section className="relative row-span-2 flex flex-col gap-7 rounded-lg border p-10">
                <Label className="absolute -top-4 left-2 bg-background px-3 text-2xl font-bold">
                    Data
                </Label>

                <div className="grid grid-cols-[1fr] gap-10 break1200:grid-cols-[1fr_5px_1fr]">
                    {/* X Axis */}
                    <div>
                        <Label className="mb-2 block text-lg">X Axis</Label>
                        <div className="grid grid-cols-[100px_1fr] grid-rows-2 items-center gap-y-4">
                            <Label className="block text-lg">Column</Label>
                            <Select onValueChange={(value) => setXAxis(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a Column" />
                                </SelectTrigger>
                                <SelectContent>
                                    {XAxisColumns.map((col, index) => (
                                        <SelectItem key={index} value={col}>
                                            {col}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Label className="block text-lg">Sort By</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a Column" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key={0} value="None">
                                        None
                                    </SelectItem>
                                    <Separator className="my-1" />
                                    {XAxisColumns.map((col, index) => (
                                        <SelectItem key={index + 1} value={col}>
                                            {col}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between pt-6">
                            <Label className="block text-lg">
                                Omit Zero Values
                            </Label>
                            <ToggleSwitch
                                defaultChecked={false}
                                toggleFunction={() => {}}
                            />
                        </div>
                    </div>
                    <Separator
                        orientation="vertical"
                        className="hidden justify-self-center break1200:block"
                    />
                    <Separator
                        orientation="horizontal"
                        className="justify-self-center break1200:hidden"
                    />

                    {/* Y Axis */}
                    <div>
                        <Label className="mb-2 block text-lg">Y Axis</Label>
                        <div className="grid grid-cols-[100px_1fr] grid-rows-2 items-center gap-y-4">
                            <Label className="block text-lg">Column</Label>
                            <Select onValueChange={(value) => setYAxis(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a Column" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key={0} value="count">
                                        count
                                    </SelectItem>
                                    <Separator className="my-1" />
                                    {YAxisColumns.map((col, index) => (
                                        <SelectItem key={index + 1} value={col}>
                                            {col}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Label className="block text-lg">Group By</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a Column" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key={0} value="None">
                                        None
                                    </SelectItem>
                                    <Separator className="my-1" />
                                    {YAxisColumns.map((col, index) => (
                                        <SelectItem key={index + 1} value={col}>
                                            {col}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between pt-6">
                            <Label className="block text-lg">Cumulative</Label>
                            <ToggleSwitch
                                defaultChecked={false}
                                toggleFunction={() => {}}
                            />
                        </div>
                    </div>
                </div>

                <Separator orientation="horizontal" />

                {/* Filters */}
                <Label className="flex items-center gap-3 text-lg">
                    <span>Filters</span>
                    <ClearAll clearFn={clearFilters} />
                </Label>
                <ScrollArea
                    style={{
                        height: `${filterSectionHeight}px`,
                    }}
                >
                    <div className="flex flex-col gap-5 p-1 pr-5">
                        {filters.map((filter, index) => (
                            <div className="flex gap-5" key={index}>
                                <Input
                                    placeholder="Column"
                                    value={filter.column}
                                    onChange={(e) =>
                                        setFilterColumn(e.target.value, index)
                                    }
                                />
                                <Input
                                    placeholder="Operation"
                                    value={filter.operation}
                                    onChange={(e) =>
                                        setFilterOperation(
                                            e.target.value,
                                            index
                                        )
                                    }
                                />
                                <Input
                                    placeholder="Value"
                                    value={filter.value}
                                    onChange={(e) =>
                                        setFilterValue(e.target.value, index)
                                    }
                                />
                                <Button onClick={() => removeFilter(index)}>
                                    <Trash2 />
                                </Button>
                            </div>
                        ))}
                        <Button
                            className="grid place-content-center rounded border bg-background-light py-2"
                            onClick={() => {
                                addFilter({
                                    column: "",
                                    operation: "",
                                    value: "",
                                });
                            }}
                        >
                            <Plus />
                        </Button>
                    </div>
                </ScrollArea>

                <Button>Apply</Button>
            </section>

            {/* Chart Config */}
            <section className="relative flex flex-col gap-7 rounded-lg border p-10">
                <Label className="absolute -top-4 left-2 bg-background px-3 text-2xl font-bold">
                    Chart Config
                </Label>

                {/* Chart Type */}
                <div>
                    <Label className="mb-2 block text-lg">
                        Select You chart Type
                    </Label>
                    <Select
                        defaultValue={chartType || "Radar"}
                        onValueChange={(value) =>
                            changeChartType(
                                value as
                                    | "Area"
                                    | "Radar"
                                    | "Heatmap"
                                    | "Bar"
                                    | "Donut"
                            )
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Chart Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Area">Area</SelectItem>
                            <SelectItem value="Radar">Radar</SelectItem>
                            <SelectItem value="Heatmap">Heatmap</SelectItem>
                            <SelectItem value="Bar">Bar</SelectItem>
                            <SelectItem value="Donut">Donut</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Label */}
                <div>
                    <Label className="mb-2 block text-lg">Label</Label>
                    <div className="grid grid-cols-[9fr_40px]">
                        <Input
                            className="rounded-br-none rounded-tr-none border-r-0"
                            onChange={(e) => setLabel(e.target.value)}
                        />
                        <button
                            className="grid place-content-center rounded rounded-bl-none rounded-tl-none border"
                            onClick={toggleLabel}
                        >
                            {isLabelOn ? <Eye /> : <EyeOff />}
                        </button>
                    </div>
                </div>

                {/* Togglers */}
                <div className="grid grid-cols-[100px_4fr] grid-rows-3 place-content-center items-center gap-y-5">
                    {/* Legends */}
                    <Label className="text-lg">Legends</Label>
                    <ToggleSwitch
                        defaultChecked={showLegends}
                        toggleFunction={toggleLegends}
                    />

                    {/* Grid */}
                    <Label className="text-lg">Grid</Label>
                    <ToggleSwitch
                        defaultChecked={showGrid}
                        toggleFunction={toggleGrid}
                    />

                    {/* ToolTip */}
                    <Label className="text-lg">Tool Tip</Label>
                    <ToggleSwitch
                        defaultChecked={showToolTip}
                        toggleFunction={toggleToolTip}
                    />
                </div>
            </section>
        </div>
    );
}
