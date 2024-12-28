"use client";
import React from "react";

import { useGetDatabaseSchema } from "@/features/charts/api/useGetDatabaseSchema";

import { DataTable } from "./data-table";
import { Columns, columns } from "./columns";
import YAxisDataTableSkeleton from "./loader";

export default function YAxisDataTable() {
    const { data: schema, isLoading } = useGetDatabaseSchema();

    if (isLoading) {
        return (
            <div>
                <YAxisDataTableSkeleton />
            </div>
        );
    }

    if (!schema) {
        return <div>Internal Server Error</div>;
    }

    const data: Columns[] = [];

    for (const columns in schema) {
        data.push({
            name: columns,
            id: schema[columns].id as string,
            type: schema[columns].type as string,
        });
    }

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
