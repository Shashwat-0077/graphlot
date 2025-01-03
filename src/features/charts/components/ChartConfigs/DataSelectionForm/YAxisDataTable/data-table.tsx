"use client";

import { useState } from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useChartConfigStore } from "@/components/providers/ChartConfigStoreProvider";

interface RowData {
    name: string;
    active: boolean;
    id: string;
    type: string;
}

interface DataTableProps<TData extends RowData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData extends RowData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    // const { activateYAxis, setYAxis } = useChartConfigStore((state) => state);

    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 10, //default page size
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            pagination,
            columnFilters,
            rowSelection,
        },
    });

    // useEffect(() => {
    //     // Initialize row selection based on the `active` field
    //     const initialRowSelection = table.getRowModel().rows.reduce(
    //         (acc, row) => {
    //             if (row.original.active) {
    //                 acc[row.id] = true;
    //             }
    //             return acc;
    //         },
    //         {} as Record<string, boolean>
    //     );

    //     setRowSelection(initialRowSelection);

    //     // Prepare YAxis data based on active rows
    //     const stateData = table.getRowModel().rows.map((row) => ({
    //         name: row.original.name,
    //         active: row.original.active,
    //         aggregation: "count" as
    //             | "count"
    //             | "sum"
    //             | "average"
    //             | "cumulative_sum",
    //         sort: "asc" as "asc" | "desc",
    //     }));

    //     setYAxis(stateData);
    // }, [table, setYAxis]);

    // useEffect(() => {
    //     const selectedRows = table.getFilteredSelectedRowModel().rows;
    //     const selectedData = selectedRows.map(
    //         (row) => row.getValue("name") as string
    //     );

    //     activateYAxis(selectedData);

    //     // eslint-disable-next-line
    // }, [rowSelection, activateYAxis]);

    return (
        <div>
            <div className="flex items-center pb-4">
                <Input
                    placeholder="Filter columns..."
                    value={
                        (table.getColumn("name")?.getFilterValue() as string) ??
                        ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("name")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
