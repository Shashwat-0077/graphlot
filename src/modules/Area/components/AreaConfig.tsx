import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import ColorPickerPopover from "@/components/ui/ColorPickerPopover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetDatabaseSchema } from "@/modules/notion/api/client/useGetDatabaseSchema";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterType } from "@/constants";
import { useAreaChartStore } from "@/modules/Area/store";
import { GridSelect } from "@/components/ui/grid-select";
import ClearAll from "@/modules/BasicChart/components/ClearAll";

export const AreaConfig = ({
    notion_table_id,
}: {
    notion_table_id: string;
}) => {
    const COLOR_SECTION_HEIGHT = 120; // in px
    const FILTER_SECTION_HEIGHT = 400; // in px

    // TODO : Add data in functionality

    const { data, isLoading } = useGetDatabaseSchema(notion_table_id);

    // local states
    const [xAxis, setXAxis] = useState("");
    const [yAxis, setYAxis] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [groupBy, setGroupBy] = useState("");
    const [omitZeroValues, setOmitZeroValues] = useState(false);
    const [cumulative, setCumulative] = useState(false);
    const [filters, setFilters] = useState<FilterType[]>([]);

    const addFilter = (filter: FilterType) => {
        setFilters((prevFilters) => [...prevFilters, filter]);
    };

    const removeFilter = (index: number) => {
        setFilters((prevFilters) =>
            prevFilters.filter((_, filterIndex) => filterIndex !== index)
        );
    };

    const clearFilters = () => {
        setFilters([]);
    };

    const setFilterColumn = (value: string, index: number) => {
        setFilters((prevFilters) => {
            const newFilters = [...prevFilters];
            newFilters[index].column = value;
            return newFilters;
        });
    };

    const setFilterOperation = (value: string, index: number) => {
        setFilters((prevFilters) => {
            const newFilters = [...prevFilters];
            newFilters[index].operation = value;
            return newFilters;
        });
    };

    const setFilterValue = (value: string, index: number) => {
        setFilters((prevFilters) => {
            const newFilters = [...prevFilters];
            newFilters[index].value = value;
            return newFilters;
        });
    };

    // TODO : make the data state independent and only add them when the button is clicked
    // TODO : Donut and heatmap will have different style of input

    const {
        addColor,
        removeColor,
        background_color,
        clearColorPalette,
        color_palette,
        grid_color,
        grid_type,
        label_enabled,
        legend_enabled,
        setBackgroundColor,
        setFilters: setGlobalFilters,
        setGridColor,
        setGridType,
        setGroupBy: setGlobalGroupBy,
        setSortBy: setGlobalSortBy,
        setTextColor,
        setXAxis: setGlobalXAxis,
        setYAxis: setGlobalYAxis,
        // sort_by,
        text_color,
        toggleLegend,
        toggleTooltip,
        tooltip_enabled,
        setCumulative: setGlobalCumulative,
        setOmitZeroValues: setGlobalOmitZeroValues,
        updateColor,
        toggleLabel,
    } = useAreaChartStore((state) => state);

    const onApply = () => {
        setGlobalXAxis(xAxis);
        setGlobalYAxis(yAxis);
        setGlobalGroupBy(groupBy);
        setGlobalSortBy(sortBy);
        setGlobalFilters(filters);
        setGlobalCumulative(cumulative);
        setGlobalOmitZeroValues(omitZeroValues);
    };

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

    const XAxisColumns: string[] = [];
    const YAxisColumns: string[] = [];

    Object.keys(data).forEach((col) => {
        if (["status", "select", "multi_select"].includes(data[col].type)) {
            XAxisColumns.push(col);
            YAxisColumns.push(col);
        }
    });

    return (
        <div className="mb-7 mt-16 flex flex-col gap-10 break1200:flex-row">
            {/* Colors */}
            <section className="relative flex w-full min-w-[300px] flex-col gap-7 rounded-lg border p-10 break1200:max-w-[500px]">
                <Label className="absolute -top-4 left-2 bg-background px-3 text-2xl font-bold">
                    Appearance
                </Label>

                {/* Label*/}
                <div className="flex w-full items-center justify-between">
                    <Label className="text-lg">Label</Label>
                    <ToggleSwitch
                        defaultChecked={label_enabled}
                        toggleFunction={toggleLabel}
                    />
                </div>

                {/* Legends */}
                <div className="flex w-full items-center justify-between">
                    <Label className="text-lg">Legends</Label>
                    <ToggleSwitch
                        defaultChecked={legend_enabled}
                        toggleFunction={toggleLegend}
                    />
                </div>

                {/* Grid */}
                <div className="flex w-full items-center justify-between">
                    <Label className="text-lg">Grid</Label>
                    <GridSelect
                        grid_type={grid_type}
                        setGridType={setGridType}
                    />
                </div>

                {/* ToolTip */}
                <div className="flex w-full items-center justify-between">
                    <Label className="text-lg">Tool Tip</Label>
                    <ToggleSwitch
                        defaultChecked={tooltip_enabled}
                        toggleFunction={toggleTooltip}
                    />
                </div>

                {/* Label Color */}
                <div className="w-full">
                    <Label className="mb-2 block text-lg">Label Color</Label>
                    <ColorPickerPopover
                        isSingleColor={true}
                        color={text_color}
                        setColor={setTextColor}
                    >
                        <div
                            className="grid h-8 w-full shrink-0 grow-0 cursor-pointer place-content-center rounded border py-4 text-muted"
                            style={{
                                backgroundColor: `rgba(${text_color.r}, ${text_color.g}, ${text_color.b}, ${text_color.a})`,
                            }}
                        >
                            Click me to modify
                        </div>
                    </ColorPickerPopover>
                </div>

                {/* Background Color */}
                <div className="w-full">
                    <Label className="mb-2 block text-lg">
                        Background Color
                    </Label>
                    <ColorPickerPopover
                        isSingleColor={true}
                        color={background_color}
                        setColor={setBackgroundColor}
                    >
                        <div
                            className="grid h-8 w-full shrink-0 grow-0 cursor-pointer place-content-center rounded border py-4 text-muted"
                            style={{
                                backgroundColor: `rgba(${background_color.r}, ${background_color.g}, ${background_color.b}, ${background_color.a})`,
                            }}
                        >
                            Click me to modify
                        </div>
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
                        color={grid_color}
                        setColor={setGridColor}
                    >
                        <div
                            className="grid h-8 w-full shrink-0 grow-0 cursor-pointer place-content-center rounded border py-4 text-muted"
                            style={{
                                backgroundColor: `rgba(${grid_color.r}, ${grid_color.g}, ${grid_color.b}, ${grid_color.a})`,
                            }}
                        >
                            Click me to modify{" "}
                        </div>
                    </ColorPickerPopover>
                </div>

                {/* Chart Colors */}
                <div>
                    <Label className="flex items-center gap-3 text-lg">
                        <span>Chart color</span>
                        <ClearAll clearFn={clearColorPalette} />
                    </Label>
                    <ScrollArea
                        style={{
                            height: `${COLOR_SECTION_HEIGHT}px`,
                            marginTop: "10px",
                        }}
                    >
                        <div className="flex flex-wrap items-center gap-2">
                            {color_palette.map((color, index) => (
                                <ColorPickerPopover
                                    key={index}
                                    isSingleColor={false}
                                    color={color}
                                    className="w-auto"
                                    colorIndex={index}
                                    setColor={updateColor}
                                    removeColor={removeColor}
                                >
                                    <div
                                        className="h-10 w-10 shrink-0 grow-0 cursor-pointer rounded-full border transition-transform hover:scale-105"
                                        style={{
                                            backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
                                        }}
                                    />
                                </ColorPickerPopover>
                            ))}
                            <div
                                className="grid h-10 w-10 cursor-pointer place-content-center rounded-full border"
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
            <section className="relative flex w-full flex-col gap-7 rounded-lg border p-10">
                <Label className="absolute -top-4 left-2 bg-background px-3 text-2xl font-bold">
                    Data
                </Label>

                <div className="grid grid-cols-[1fr] gap-10 break1400:grid-cols-[1fr_5px_1fr]">
                    {/* X Axis */}
                    <div>
                        <Label className="mb-2 block text-lg">X Axis</Label>
                        <div className="grid grid-cols-[100px_1fr] grid-rows-2 items-center gap-y-4">
                            <Label className="block text-lg">Column</Label>
                            <Select
                                onValueChange={(value) => {
                                    setXAxis(value);
                                }}
                            >
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
                            <Select
                                onValueChange={(value) => {
                                    setSortBy(value);
                                }}
                            >
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
                                defaultChecked={omitZeroValues}
                                toggleFunction={() => {
                                    setOmitZeroValues(!omitZeroValues);
                                }}
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
                            <Select
                                onValueChange={(value) => {
                                    setYAxis(value);
                                }}
                            >
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
                            <Select
                                onValueChange={(value) => {
                                    setGroupBy(value);
                                }}
                            >
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
                                defaultChecked={cumulative}
                                toggleFunction={() => {
                                    setCumulative(!cumulative);
                                }}
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
                        height: `${FILTER_SECTION_HEIGHT}px`,
                    }}
                >
                    <div className="flex flex-col gap-5 p-1">
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
                            className="grid w-full place-content-center rounded border bg-background-light py-2"
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

                <Button type="button" onClick={onApply}>
                    Apply
                </Button>
            </section>
        </div>
    );
};
