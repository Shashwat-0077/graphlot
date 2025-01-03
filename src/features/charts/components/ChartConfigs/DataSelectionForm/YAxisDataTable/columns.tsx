"use client";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
// import { useChartConfigStore } from "@/components/providers/ChartConfigStoreProvider";

export type Columns = {
    id: string;
    name: string;
    type: string;
    active: boolean;
};

const SelectMenu = ({
    // name,
    isSelected,
}: {
    name: string;
    isSelected: boolean;
}) => {
    return (
        <div className="max-w-10">
            <Select
                disabled={!isSelected}
                // value={getAggregationByKey(name)}
                // onValueChange={(value) => {
                //     setAggregationByKey(
                //         name,
                //         value as "sum" | "average" | "count" | "cumulative_sum"
                //     );
                // }}
            >
                <SelectTrigger
                    className={`w-[180px] ${isSelected ? "border-primary" : ""}`}
                >
                    <SelectValue placeholder="Select a Aggregation" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="sum">Sum</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="count">Count</SelectItem>
                    <SelectItem value="cumulative_sum">
                        Cumulative Sum
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export const columns: ColumnDef<Columns>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => {
            return (
                <Checkbox
                    defaultChecked={row.original.active}
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        row.toggleSelected(!!value);
                    }}
                    aria-label="Select row"
                />
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const type: string = row.original.type;

            const formatted = type
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        id: "aggregation",
        header: "Aggregation",
        cell: ({ row }) => {
            const isSelected = row.getIsSelected();
            const rowName = row.original.name;
            return <SelectMenu name={rowName} isSelected={isSelected} />;
        },
    },
];
