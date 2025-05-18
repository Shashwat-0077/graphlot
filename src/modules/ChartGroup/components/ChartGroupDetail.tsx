"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Layers, MoreHorizontal, Plus } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import type { ChartType } from "@/constants";
import { ChartCard } from "@/modules/ChartMetaData/components/ChartCard";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

type Group = {
    group_id: string;
    name: string;
    layout_type: string;
    chart_count: number;
    created_at: string;
};

export function ChartGroupDetail({
    collection_slug,
    group_slug,
    group,
    charts,
    collection,
}: {
    collection_slug: string;
    group_slug: string;
    group: Group;
    charts: Chart[];
    collection: Collection;
}) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDeleteGroup = async () => {
        try {
            // This would be replaced with your actual API call
            console.log("Deleting group:", group.group_id);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast({
                title: "Success",
                description: "Chart group deleted successfully",
            });

            // Redirect to collection page
            window.location.href = `/dashboard/collections/${collection_slug}`;
        } catch (error) {
            console.error("Error deleting chart group:", error);
            toast({
                title: "Error",
                description: "Failed to delete chart group",
                variant: "destructive",
            });
        }
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
            {/* Group Header */}
            <div className="mb-8">
                <div className="mb-2 flex items-center gap-2">
                    <Link
                        href="/dashboard/collections"
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        Collections
                    </Link>
                    <span className="text-sm text-muted-foreground">/</span>
                    <Link
                        href={`/dashboard/collections/${collection_slug}`}
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        {collection.name}
                    </Link>
                    <span className="text-sm text-muted-foreground">/</span>
                    <Link
                        href={`/dashboard/collections/${collection_slug}/groups`}
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        Groups
                    </Link>
                    <span className="text-sm text-muted-foreground">/</span>
                    <span className="text-sm font-medium">{group.name}</span>
                </div>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {group.name}
                            </h1>
                            <Badge variant="outline" className="ml-2">
                                {group.layout_type.charAt(0).toUpperCase() +
                                    group.layout_type.slice(1)}{" "}
                                Layout
                            </Badge>
                        </div>
                        <p className="mt-1 text-muted-foreground">
                            {group.chart_count} charts in this group
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button asChild variant="outline">
                            <Link
                                href={`/dashboard/collections/${collection_slug}/groups`}
                            >
                                <ArrowLeft className="mr-1.5 h-4 w-4" />
                                Back to Groups
                            </Link>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <MoreHorizontal className="mr-1.5 h-4 w-4" />
                                    Actions
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Group
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Charts
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog
                                    open={isDeleteDialogOpen}
                                    onOpenChange={setIsDeleteDialogOpen}
                                >
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                            className="text-destructive"
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                setIsDeleteDialogOpen(true);
                                            }}
                                        >
                                            Delete Group
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Delete Chart Group
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete
                                                this chart group? This action
                                                cannot be undone. The charts in
                                                this group will not be deleted.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDeleteGroup}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="mb-8">
                <div className="mb-4 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">
                        Charts in this Group
                    </h2>
                </div>

                <motion.div
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {charts.map((chart) => (
                        <motion.div key={chart.chart_id} variants={item}>
                            <ChartCard
                                type={chart.type}
                                collection_slug={collection_slug}
                                name={chart.name}
                                chartId={chart.chart_id}
                                notionDatabaseName={chart.notion_database_name}
                            />
                        </motion.div>
                    ))}
                    <motion.div variants={item}>
                        <Button
                            variant="outline"
                            className="flex h-full min-h-[270px] w-full flex-col items-center justify-center rounded-xl border border-dashed"
                            asChild
                        >
                            <Link
                                href={`/dashboard/collections/${collection_slug}/new-chart`}
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <div className="mb-3 rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                                        <Plus className="h-6 w-6 text-primary" />
                                    </div>
                                    <span className="text-lg font-medium">
                                        Add Chart to Group
                                    </span>
                                </div>
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
