"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Layers,
    LayoutGrid,
    LayoutDashboard,
    Loader2,
    Edit,
    Trash2,
    ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { useGetFullChartsInGroups } from "@/modules/chartGroups/api/client/useGetChartsInGroups";
import { useGetGroupWithId } from "@/modules/chartGroups/api/client/useGetGroups";
import { useDeleteGroup } from "@/modules/chartGroups/api/client/useDeleteGroup";
import { LAYOUT_GRID } from "@/constants";

export default function ChartGroupDetailPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { collection_slug, group_id } = useParams<{
        collection_slug: string;
        group_id: string;
    }>();

    // Fetch group data
    const { data: group, isLoading: isLoadingGroup } =
        useGetGroupWithId(group_id);

    // Fetch charts in group
    const { data: charts = [], isLoading: isLoadingCharts } =
        useGetFullChartsInGroups(group_id);

    // Delete group mutation
    const { mutate: deleteGroupMutation, isPending: isDeleting } =
        useDeleteGroup();

    // Handle delete group
    const handleDeleteGroup = () => {
        deleteGroupMutation(
            {
                param: {
                    group_id,
                },
            },
            {
                onSuccess: () => {
                    toast({
                        title: "Success",
                        description: "Chart group deleted successfully",
                    });
                    router.push(
                        `/dashboard/collections/${collection_slug}/groups`
                    );
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

    // Loading state
    if (isLoadingGroup || isLoadingCharts) {
        return (
            <div className="container mx-auto flex h-screen items-center justify-center px-4 py-8">
                <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-lg font-medium">
                        Loading chart group...
                    </p>
                </div>
            </div>
        );
    }

    // Error state if group not found
    if (!group) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
                    <h2 className="text-xl font-semibold text-destructive">
                        Group not found
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        The chart group you&apos;re looking for doesn&apos;t
                        exist or you don&apos;t have permission to view it.
                    </p>
                    <Button className="mt-4" variant="outline" asChild>
                        <Link
                            href={`/dashboard/collections/${collection_slug}/groups`}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Groups
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                            <Layers className="h-6 w-6 text-primary" />
                            {group.name}
                        </h1>
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
                        <Button asChild variant="outline">
                            <Link
                                href={`/dashboard/collections/${collection_slug}/groups/${group_id}/edit`}
                            >
                                <Edit className="mr-1.5 h-4 w-4" />
                                Edit Group
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="mr-1.5 h-4 w-4" />
                                    Delete Group
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete Chart Group
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this
                                        chart group? This action cannot be
                                        undone. The charts in this group will
                                        not be deleted.
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
                </div>
            </div>

            {/* Group Info */}
            <div className="mb-8 grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Group Details</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Layout Type
                            </p>
                            <div className="mt-1 flex items-center gap-1.5">
                                {group.layout_type === LAYOUT_GRID ? (
                                    <LayoutGrid className="h-4 w-4" />
                                ) : (
                                    <LayoutDashboard className="h-4 w-4" />
                                )}
                                <span>
                                    {group.layout_type.charAt(0).toUpperCase() +
                                        group.layout_type.slice(1)}{" "}
                                    Layout
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Charts
                            </p>
                            <p className="mt-1">{group.chart_count} charts</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Created
                            </p>
                            <p className="mt-1">
                                {new Date(
                                    group.created_at
                                ).toLocaleDateString()}
                            </p>
                        </div>
                        {group.updated_at && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Last Updated
                                </p>
                                <p className="mt-1">
                                    {new Date(
                                        group.updated_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Preview</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed border-muted-foreground/25 bg-muted/20">
                            <div className="text-center">
                                <p className="text-sm font-medium">
                                    Group Preview
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {group.layout_type === LAYOUT_GRID
                                        ? "Grid"
                                        : "Carousel"}
                                    layout with {group.chart_count} charts
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts List */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Charts in this Group</h2>
                <Badge variant="outline">
                    {charts.length} chart{charts.length !== 1 ? "s" : ""}
                </Badge>
            </div>

            {charts.length === 0 ? (
                <Card>
                    <CardContent className="flex h-[200px] items-center justify-center p-6">
                        <div className="text-center">
                            <p className="text-lg font-medium">
                                No charts in this group
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Edit this group to add charts
                            </p>
                            <Button className="mt-4" asChild>
                                <Link
                                    href={`/dashboard/collections/${collection_slug}/groups/${group_id}/edit`}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Group
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {charts.map((chart) => (
                        <Card key={chart.chart_id}>
                            <CardHeader className="p-4">
                                <div className="flex h-[120px] items-center justify-center rounded-md bg-muted/30">
                                    <div className="text-center">
                                        <p className="font-medium">
                                            {chart.type.toUpperCase()} Chart
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Preview
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <h3 className="text-lg font-medium">
                                    {chart.name}
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {chart.notion_database_name}
                                </p>
                            </CardContent>
                            <CardFooter className="border-t bg-muted/20 p-4">
                                <div className="flex w-full items-center justify-between">
                                    <Badge variant="outline">
                                        {chart.type}
                                    </Badge>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link
                                            href={`/dashboard/collections/${collection_slug}/charts/${chart.chart_id}`}
                                        >
                                            View Chart
                                            <ChevronRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
