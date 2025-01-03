"use client";
import React from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetDatabaseSchema } from "@/features/charts/api/useGetDatabaseSchema";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { useChartConfigStore } from "@/components/providers/ChartConfigStoreProvider";

import YAxisDataTableSkeleton from "./YAxisDataTable/loader";
import { DataTable } from "./YAxisDataTable/data-table";
import { Columns, columns } from "./YAxisDataTable/columns";

// NOTE : Maybe used when we intended to use data-table to show the multi-column data, same for the YAxisDataTable folder

export default function DataSelectionForm() {
    // TODO : Fetch from the database as well as notion (as the notion is unlimited) and update the database according to the notion

    const { data: schema, isLoading } = useGetDatabaseSchema();
    const { setXAxis } = useChartConfigStore((state) => state);

    if (isLoading) {
        return (
            <div>
                <Skeleton className="h-10 w-56" />
                <YAxisDataTableSkeleton />
            </div>
        );
    }

    if (!schema) {
        return <div>Internal Server Error</div>;
    }

    const notionColumns: Columns[] = [];

    for (const column in schema) {
        notionColumns.push({
            name: column,
            active: false,
            id: schema[column].id as string,
            type: schema[column].type as string,
        });
    }

    return (
        <div className="space-y-6 pt-4">
            <div>
                <Label>X Axis</Label>
                <Select
                    onValueChange={(value) => {
                        setXAxis(value);
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Column" />
                    </SelectTrigger>
                    <SelectContent>
                        {notionColumns.map((column) => (
                            <SelectItem key={column.id} value={column.name}>
                                {column.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Y Axis</Label>
                <div className="container mx-auto">
                    <DataTable columns={columns} data={notionColumns} />
                </div>
            </div>
        </div>
    );
}
