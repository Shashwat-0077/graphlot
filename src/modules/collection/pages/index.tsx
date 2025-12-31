"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Grid3X3, SortAsc } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SimpleLoader } from "@/components/ui/simple-loader";
import CollectionCard from "@/modules/collection/components/collection-card";
import { getSlug } from "@/utils";
import { useGetCollections } from "@/modules/collection/api/client";

export default function CollectionsPage() {
    // State for filtering and sorting
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState<string>("newest");

    const { data: collections, isLoading, error } = useGetCollections();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    if (isLoading) {
        return (
            <div className="flex h-[70vh] w-full items-center justify-center">
                <SimpleLoader />
            </div>
        );
    }

    if (error || !collections) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Card className="border-destructive/50 w-full max-w-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-destructive">
                            Error
                        </CardTitle>
                        <CardDescription>
                            There was a problem loading your collections.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            {error?.message}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Filter collections based on search query
    const filteredCollections = collections.filter((collection) =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort collections based on selected sort option
    const sortedCollections = [...filteredCollections].sort((a, b) => {
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
            case "charts-desc":
                return b.chartCount - a.chartCount;
            case "charts-asc":
                return a.chartCount - b.chartCount;
            default:
                return 0;
        }
    });

    return (
        <div>
            <div className="bg-background/60 mb-8 rounded-xl border p-6 shadow-sm backdrop-blur-sm">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Collections
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage and organize your chart collections
                        </p>
                    </div>
                    <Button asChild className="shadow-sm">
                        <Link href="/collections/new">
                            <Plus className="mr-1.5 h-4 w-4" />
                            New Collection
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder="Search collections..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10"
                            >
                                <SortAsc className="mr-2 h-4 w-4" />
                                Sort
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => setSortOption("newest")}
                                className={
                                    sortOption === "newest" ? "bg-muted" : ""
                                }
                            >
                                Newest First
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSortOption("oldest")}
                                className={
                                    sortOption === "oldest" ? "bg-muted" : ""
                                }
                            >
                                Oldest First
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSortOption("name-asc")}
                                className={
                                    sortOption === "name-asc" ? "bg-muted" : ""
                                }
                            >
                                Name (A-Z)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSortOption("name-desc")}
                                className={
                                    sortOption === "name-desc" ? "bg-muted" : ""
                                }
                            >
                                Name (Z-A)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSortOption("charts-desc")}
                                className={
                                    sortOption === "charts-desc"
                                        ? "bg-muted"
                                        : ""
                                }
                            >
                                Most Charts
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSortOption("charts-asc")}
                                className={
                                    sortOption === "charts-asc"
                                        ? "bg-muted"
                                        : ""
                                }
                            >
                                Fewest Charts
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {collections.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <Grid3X3 className="text-muted-foreground mb-4 h-10 w-10" />
                    <h3 className="text-lg font-medium">
                        No collections found
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Create your first collection to start organizing your
                        charts
                    </p>
                    <Button asChild className="mt-4">
                        <Link href="/collections/new">
                            <Plus className="mr-1.5 h-4 w-4" />
                            Create Collection
                        </Link>
                    </Button>
                </div>
            ) : sortedCollections.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <Search className="text-muted-foreground mb-4 h-10 w-10" />
                    <h3 className="text-lg font-medium">
                        No matching collections found
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Try adjusting your search criteria
                    </p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setSearchQuery("")}
                    >
                        Clear Search
                    </Button>
                </div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {" "}
                    <AnimatePresence>
                        {sortedCollections.map((collection) => (
                            <motion.div
                                key={collection.collectionId}
                                variants={item}
                                layout
                            >
                                <CollectionCard
                                    name={collection.name}
                                    path={`/collections/${getSlug({ id: collection.collectionId, name: collection.name })}`}
                                    chartCount={collection.chartCount}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <motion.div variants={item}>
                        <Link
                            href="/collections/new"
                            className="group border-muted bg-card/50 hover:border-primary/30 hover:bg-card/80 flex h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 rounded-full p-4 transition-colors">
                                <Plus className="text-primary h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">
                                New Collection
                            </h3>
                            <p className="text-muted-foreground">
                                Create a new collection to organize your charts
                            </p>
                        </Link>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
