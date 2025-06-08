"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { motion } from "framer-motion";

import CollectionCard from "@/modules/Collection/components/CollectionCard";
import { getSlug } from "@/utils/pathSlugsOps";
import { Input } from "@/components/ui/input";

type Collection = {
    collection_id: string;
    name: string;
    description?: string;
    chart_count: number;
    created_at: string;
};

export function CollectionsClient({
    collections,
}: {
    collections: Collection[];
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCollections, setFilteredCollections] = useState(collections);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredCollections(collections);
            return;
        }

        const filtered = collections.filter((collection) =>
            collection.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCollections(filtered);
    }, [searchQuery, collections]);

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

    return (
        <>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Collections
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Manage and organize your chart collections
                    </p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search collections..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <motion.div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {filteredCollections.map((collection) => (
                    <motion.div key={collection.collection_id} variants={item}>
                        <CollectionCard
                            name={collection.name}
                            path={`/dashboard/collections/${getSlug({ id: collection.collection_id, name: collection.name })}`}
                            chartCount={collection.chart_count}
                        />
                    </motion.div>
                ))}
                <motion.div variants={item}>
                    <Link
                        href="/dashboard/new-collection"
                        className="group flex h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted bg-card/50 p-8 text-center shadow-sm transition-all hover:border-primary/30 hover:bg-card/80 hover:shadow-md"
                    >
                        <div className="mb-4 rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                            <Plus className="h-8 w-8 text-primary" />
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
        </>
    );
}
