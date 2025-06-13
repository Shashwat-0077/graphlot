"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, LayoutGrid, Layers, Search, Filter } from "lucide-react";
import Link from "next/link";

import { ChartCard } from "@/modules/Chart/components/ChartCard";
import { parseSlug } from "@/utils/pathSlugsOps";
import ChartCardLoader from "@/modules/Chart/components/ChartCardLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChartTypeFilter } from "@/modules/Chart/components/ChartTypeFilter";
import { EmptyCharts } from "@/modules/Chart/components/EmptyCharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCollectionById } from "@/modules/Collection/api/client/use-collections";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useChartMetadataByCollection } from "@/modules/Chart/api/client/use-chart";

export default function SingleCollectionPage() {
    const { session } = useAuthSession();

    const user = useMemo(() => {
        if (!session || !session.user) {
            return null;
        }
        return session.user;
    }, [session]);

    const { collection_slug } = useParams<{ collection_slug: string }>();
    const { id: collection_id } = parseSlug(collection_slug);

    // State for filtering and searching
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedChartType, setSelectedChartType] = useState<string | null>(
        null
    );
    const [sortOption, setSortOption] = useState<string>("newest");

    const {
        data: collection,
        isLoading: isCollectionLoading,
        error: collectionError,
    } = useCollectionById(collection_id);
    const {
        data: charts,
        isLoading: isChartsLoading,
        error: chartError,
    } = useChartMetadataByCollection(collection_id);

    // Filter and sort charts based on search query, chart type, and sort option
    const filteredCharts = useMemo(() => {
        if (!charts || charts.length === 0) {
            return [];
        }

        return charts.filter((chart) => {
            const matchesSearch =
                searchQuery === "" ||
                chart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                chart.databaseName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesType =
                selectedChartType === null || chart.type === selectedChartType;

            return matchesSearch && matchesType;
        });
    }, [charts, searchQuery, selectedChartType]);

    // Sort charts based on selected sort option
    const sortedCharts = useMemo(() => {
        return [...filteredCharts].sort((a, b) => {
            switch (sortOption) {
                case "newest":
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
                case "oldest":
                    return (
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    );
                case "name-asc":
                    return a.name.localeCompare(b.name);
                case "name-desc":
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });
    }, [filteredCharts, sortOption]);

    // Get unique chart types for filtering
    const chartTypes = useMemo(() => {
        if (!charts || charts.length === 0) {
            return [];
        }

        return [...new Set(charts.map((chart) => chart.type))];
    }, [charts]);

    if (chartError || collectionError) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Card className="w-full max-w-md border-destructive/50 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-destructive">
                            Error
                        </CardTitle>
                        <CardDescription>
                            There was a problem loading the collection data.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            {chartError?.message}
                        </p>
                        <p className="text-muted-foreground">
                            {collectionError?.message}
                        </p>
                    </CardContent>
                    <div className="flex justify-end p-6 pt-0">
                        <Button asChild>
                            <Link href="/dashboard/collections">
                                Return to Collections
                            </Link>
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Collection Header with Glass Effect */}
            <div className="mb-8 rounded-xl border bg-background/60 p-6 shadow-sm backdrop-blur-sm">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {isCollectionLoading ? (
                                <div className="h-9 w-48 animate-pulse rounded-md bg-muted"></div>
                            ) : (
                                collection?.name || "Collection"
                            )}
                        </h1>
                        {isCollectionLoading ? (
                            <div className="mt-2 h-5 w-72 animate-pulse rounded-md bg-muted"></div>
                        ) : collection?.description ? (
                            <p className="mt-1 text-muted-foreground">
                                {collection.description}
                            </p>
                        ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            className="shadow-sm"
                            disabled
                        >
                            Delete Collection
                        </Button>
                        <Button asChild variant="default" className="shadow-sm">
                            <Link
                                href={`/dashboard/collections/${collection_slug}/new-chart`}
                            >
                                <Plus className="mr-1.5 h-4 w-4" />
                                New Chart
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Row */}
                {!isChartsLoading && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Card className="border-muted bg-background/50">
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Charts
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {isChartsLoading ? (
                                            <Skeleton className="size-4" />
                                        ) : (
                                            charts?.length
                                        )}
                                    </p>
                                </div>
                                <LayoutGrid className="h-8 w-8 text-primary/40" />
                            </CardContent>
                        </Card>
                        <Card className="border-muted bg-background/50">
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Groups
                                    </p>
                                    <p className="text-2xl font-bold">0</p>
                                </div>
                                <Layers className="h-8 w-8 text-primary/40" />
                            </CardContent>
                        </Card>
                        <Card className="border-muted bg-background/50">
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Last Updated
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {!isChartsLoading &&
                                        charts?.length &&
                                        charts?.length > 0
                                            ? new Date(
                                                  Math.max(
                                                      ...charts.map((c) =>
                                                          new Date(
                                                              c.updatedAt
                                                          ).getTime()
                                                      )
                                                  )
                                              ).toLocaleDateString("en-US", {
                                                  month: "short",
                                                  day: "numeric",
                                              })
                                            : "N/A"}
                                    </p>
                                </div>
                                <Layers className="h-8 w-8 text-primary/40" />
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Tabs for different views */}
            <div defaultValue="all-charts" className="mb-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl">All Charts</h2>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search charts..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <ChartTypeFilter
                            chartTypes={chartTypes}
                            selectedType={selectedChartType}
                            onSelectType={setSelectedChartType}
                        />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10"
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Sort
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => setSortOption("newest")}
                                    className={
                                        sortOption === "newest"
                                            ? "bg-muted"
                                            : ""
                                    }
                                >
                                    Newest First
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setSortOption("oldest")}
                                    className={
                                        sortOption === "oldest"
                                            ? "bg-muted"
                                            : ""
                                    }
                                >
                                    Oldest First
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setSortOption("name-asc")}
                                    className={
                                        sortOption === "name-asc"
                                            ? "bg-muted"
                                            : ""
                                    }
                                >
                                    Name (A-Z)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setSortOption("name-desc")}
                                    className={
                                        sortOption === "name-desc"
                                            ? "bg-muted"
                                            : ""
                                    }
                                >
                                    Name (Z-A)
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {isChartsLoading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <ChartCardLoader key={i} />
                        ))}
                    </div>
                ) : charts?.length && charts.length === 0 ? (
                    <EmptyCharts collection_slug={collection_slug} />
                ) : sortedCharts.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <Search className="mb-4 h-10 w-10 text-muted-foreground" />
                        <h3 className="text-lg font-medium">
                            No matching charts found
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Try adjusting your search or filter criteria
                        </p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedChartType(null);
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {sortedCharts.map((chart) => (
                            <ChartCard
                                key={chart.chartId}
                                type={chart.type}
                                collection_slug={collection_slug}
                                name={chart.name}
                                chartId={chart.chartId}
                                userId={(user && user?.id) || ""}
                                databaseName={chart.databaseName}
                                databaseProvider={chart.databaseProvider}
                            />
                        ))}
                        <Link
                            href={`/dashboard/collections/${collection_slug}/new-chart`}
                            className="block h-full min-h-[270px] w-full"
                        >
                            <div className="group flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/25 bg-card/50 p-6 text-center transition-all hover:border-primary/50 hover:bg-muted/50">
                                <div className="mb-3 rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                                    <Plus className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-medium">
                                    New Chart
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Add a new chart to this collection
                                </p>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
