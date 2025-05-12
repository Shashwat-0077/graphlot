"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Plus,
    Search,
    Layers,
    ArrowLeft,
    Edit,
    Trash2,
    LayoutGrid,
    LayoutDashboard,
    Loader2,
    Filter,
    ChevronDown,
    Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { EmptyChartGroups } from "@/modules/chartGroups/components/EmptyChartGroups";
import { useDeleteGroup } from "@/modules/chartGroups/api/client/useDeleteGroup";
import { ChartSelect } from "@/modules/BasicChart/schema";
import { ChartGroupSelect } from "@/modules/chartGroups/schema";
import { parseSlug } from "@/utils/pathSlugsOps";
import { LAYOUT_GRID } from "@/constants";
import { useGetAllGroups } from "@/modules/chartGroups/api/client/useGetGroups";

export default function ChartGroupsPage({
    collection_slug,
}: {
    collection_slug: string;
    charts: ChartSelect[];
}) {
    const router = useRouter();
    const { toast } = useToast();
    const { id: collection_id } = parseSlug(collection_slug);

    // Fetch data
    const { data: groups, isLoading: isLoadingGroups } =
        useGetAllGroups(collection_id);

    // State for filtering and searching
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredGroups, setFilteredGroups] = useState<ChartGroupSelect[]>(
        []
    );

    // Delete group mutation
    const { mutate: deleteGroupMutation, isPending: isDeleting } =
        useDeleteGroup();

    // Filter groups based on search query
    useEffect(() => {
        if (!groups) {
            setFilteredGroups([]);
            return;
        }

        if (!searchQuery.trim()) {
            setFilteredGroups(groups);
            return;
        }

        const filtered = groups.filter((group) =>
            group.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredGroups(filtered);
    }, [searchQuery, groups]);

    // Handle delete group
    const handleDeleteGroup = (groupId: string) => {
        deleteGroupMutation(
            { param: { group_id: groupId } },
            {
                onSuccess: () => {
                    toast({
                        title: "Success",
                        description: "Chart group deleted successfully",
                    });
                },
                onError: (_error) => {
                    toast({
                        title: "Error",
                        description: "Failed to delete chart group",
                        variant: "destructive",
                    });
                },
            }
        );
    };

    // Animation variants
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
        <div className="container mx-auto px-4 py-8">
            {/* Collection Header */}
            <div className="mb-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                            <Layers className="h-6 w-6 text-primary" />
                            Chart Groups
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Organize and visualize multiple charts together
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button asChild variant="outline">
                            <Link
                                href={`/dashboard/collections/${collection_slug}`}
                            >
                                <ArrowLeft className="mr-1.5 h-4 w-4" />
                                Back to Collection
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link
                                href={`/dashboard/collections/${collection_slug}/groups/new`}
                            >
                                <Plus className="mr-1.5 h-4 w-4" />
                                New Chart Group
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search groups..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem className="font-medium">
                                Layout Type
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                                <Check className="h-4 w-4 opacity-0" />
                                <span>Grid</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                                <Check className="h-4 w-4 opacity-0" />
                                <span>Dashboard</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Badge variant="outline" className="px-3 py-1">
                        {isLoadingGroups ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                            <>
                                {filteredGroups.length} group
                                {filteredGroups.length !== 1 ? "s" : ""}
                            </>
                        )}
                    </Badge>
                </div>
            </div>

            {isLoadingGroups ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredGroups.length === 0 ? (
                <EmptyChartGroups
                    collection_slug={collection_slug}
                    onCreateClick={() =>
                        router.push(
                            `/dashboard/collections/${collection_slug}/groups/new`
                        )
                    }
                />
            ) : (
                <motion.div
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    <AnimatePresence>
                        {filteredGroups.map((group) => (
                            <motion.div
                                key={group.group_id}
                                variants={item}
                                layout
                            >
                                <Card className="group overflow-hidden transition-all hover:shadow-md">
                                    <CardHeader className="overflow-hidden p-0">
                                        <div className="flex h-[180px] items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20">
                                            <div className="grid grid-cols-2 gap-2 p-4">
                                                {Array.from({
                                                    length: Math.min(
                                                        4,
                                                        group.chart_count
                                                    ),
                                                }).map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className="h-16 w-16 rounded-md bg-background/80 shadow-sm"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="absolute right-3 top-3 z-10 flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                                                onClick={() =>
                                                    router.push(
                                                        `/dashboard/collections/${collection_slug}/groups/${group.group_id}/edit`
                                                    )
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Edit group
                                                </span>
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Delete group
                                                        </span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Delete Chart Group
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you
                                                            want to delete this
                                                            chart group? This
                                                            action cannot be
                                                            undone. The charts
                                                            in this group will
                                                            not be deleted.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleDeleteGroup(
                                                                    group.group_id
                                                                )
                                                            }
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            {isDeleting ? (
                                                                <>
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                    Deleting...
                                                                </>
                                                            ) : (
                                                                "Delete"
                                                            )}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-5">
                                        <Link
                                            href={`/dashboard/collections/${collection_slug}/groups/${group.group_id}`}
                                        >
                                            <h3 className="mb-1 truncate text-xl font-semibold hover:text-primary">
                                                {group.name}
                                            </h3>
                                        </Link>

                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className="flex items-center gap-1.5 font-normal"
                                            >
                                                {group.layout_type ===
                                                LAYOUT_GRID ? (
                                                    <LayoutGrid className="h-3 w-3" />
                                                ) : (
                                                    <LayoutDashboard className="h-3 w-3" />
                                                )}
                                                {group.layout_type
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    group.layout_type.slice(
                                                        1
                                                    )}{" "}
                                                Layout
                                            </Badge>
                                            <Badge variant="secondary">
                                                {group.chart_count} Charts
                                            </Badge>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="border-t bg-muted/30 px-5 py-3">
                                        <div className="flex w-full items-center justify-between">
                                            <span className="text-xs text-muted-foreground">
                                                {group.updated_at
                                                    ? `Updated: ${new Date(group.updated_at).toLocaleDateString()}`
                                                    : `Created: ${new Date(group.created_at).toLocaleDateString()}`}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 gap-1 text-xs"
                                                onClick={() =>
                                                    router.push(
                                                        `/dashboard/collections/${collection_slug}/groups/${group.group_id}/edit`
                                                    )
                                                }
                                            >
                                                Manage Charts
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <motion.div variants={item}>
                        <Link
                            href={`/dashboard/collections/${collection_slug}/groups/new`}
                        >
                            <div className="group flex h-full min-h-[270px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/25 bg-card/50 p-6 text-center transition-all hover:border-primary/50 hover:bg-muted/50">
                                <div className="mb-3 rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                                    <Plus className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-medium">
                                    New Chart Group
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Create a new group to organize multiple
                                    charts
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
