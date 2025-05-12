"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, LayoutGrid, Layers, Search } from "lucide-react";
import { motion } from "framer-motion";

import { ChartCard } from "@/modules/BasicChart/components/ChartCard";
import ChartCardLoader from "@/modules/BasicChart/components/ChartCardLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartTypeFilter } from "@/modules/BasicChart/components/ChartTypeFilter";
import { EmptyCharts } from "@/modules/BasicChart/components/EmptyCharts";
import type { ChartType } from "@/constants";

import { ChartGroups } from "@/modules/BasicChart/components/ChartGroup";
import { CreateChartGroupButton } from "@/modules/BasicChart/components/CreateChartGroupButton";

type Chart = {
    chart_id: string;
    name: string;
    type: ChartType;
    notion_database_name: string;
    created_at: string;
};

type Collection = {
    collection_id: string;
    name: string;
    description?: string;
};

export function CollectionClient({
    collection_slug,
    charts,
    collection,
}: {
    collection_slug: string;
    charts: Chart[];
    collection: Collection | null;
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [filteredCharts, setFilteredCharts] = useState(charts);
    const [isLoading, setIsLoading] = useState(false);

    // Get unique chart types for filtering
    const chartTypes = useMemo(
        () => [...new Set(charts.map((chart) => chart.type))],
        [charts]
    );

    // Filter charts based on search query and selected type
    useEffect(() => {
        setIsLoading(true);

        let filtered = [...charts];

        if (searchQuery) {
            filtered = filtered.filter(
                (chart) =>
                    chart.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    chart.notion_database_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        if (selectedType) {
            filtered = filtered.filter((chart) => chart.type === selectedType);
        }

        // Simulate a small delay to show loading state
        const timer = setTimeout(() => {
            setFilteredCharts(filtered);
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedType, charts]);

    const handleTypeChange = (type: string | null) => {
        setSelectedType(type === selectedType ? null : type);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Collection Header */}
            <div className="mb-8">
                <div className="mb-2 flex items-center gap-2">
                    <Link
                        href="/dashboard/collections"
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        Collections
                    </Link>
                    <span className="text-sm text-muted-foreground">/</span>
                    <span className="text-sm font-medium">
                        {collection?.name || "Collection"}
                    </span>
                </div>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {collection?.name || "Collection"}
                        </h1>
                        {collection?.description && (
                            <p className="mt-1 text-muted-foreground">
                                {collection.description}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <CreateChartGroupButton
                            collection_slug={collection_slug}
                            charts={charts}
                        />
                        <Button asChild variant="default">
                            <Link
                                href={`/dashboard/collections/${collection_slug}/new-chart`}
                            >
                                <Plus className="mr-1.5 h-4 w-4" />
                                New Chart
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabs for different views */}
            <Tabs defaultValue="all-charts" className="mb-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <TabsList className="h-auto p-1">
                        <TabsTrigger
                            value="all-charts"
                            className="flex items-center gap-1.5 px-4 py-2.5"
                        >
                            <LayoutGrid className="h-4 w-4" />
                            <span>All Charts</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="chart-groups"
                            className="flex items-center gap-1.5 px-4 py-2.5"
                        >
                            <Layers className="h-4 w-4" />
                            <span>Chart Groups</span>
                        </TabsTrigger>
                    </TabsList>

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
                            selectedType={selectedType}
                            onTypeChange={handleTypeChange}
                        />
                    </div>
                </div>

                <TabsContent value="all-charts" className="mt-0">
                    {charts.length === 0 ? (
                        <EmptyCharts collection_slug={collection_slug} />
                    ) : isLoading ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <ChartCardLoader />
                            <ChartCardLoader />
                            <ChartCardLoader />
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            {filteredCharts.map((chart) => (
                                <motion.div
                                    key={chart.chart_id}
                                    variants={item}
                                >
                                    <ChartCard
                                        type={chart.type}
                                        collection_slug={collection_slug}
                                        name={chart.name}
                                        chartId={chart.chart_id}
                                        notionDatabaseName={
                                            chart.notion_database_name
                                        }
                                    />
                                </motion.div>
                            ))}
                            <motion.div variants={item}>
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
                            </motion.div>
                        </motion.div>
                    )}
                </TabsContent>

                <TabsContent value="chart-groups" className="mt-0">
                    <ChartGroups
                        collection_slug={collection_slug}
                        charts={charts}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
