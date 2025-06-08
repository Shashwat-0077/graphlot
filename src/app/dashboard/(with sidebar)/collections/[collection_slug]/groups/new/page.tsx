"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Layers,
    LayoutGrid,
    LayoutDashboard,
    Loader2,
    Plus,
    Search,
    X,
    Check,
    Filter,
    ChevronDown,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useCreateNewGroup } from "@/modules/ChartGroup/api/client/use-create-new-group";
import { parseSlug } from "@/utils/pathSlugsOps";
import { useGetAllChartsWithCollectionId } from "@/modules/Chart/api/client/use-chart";
import { LAYOUT_CAROUSEL, LAYOUT_GRID, LayoutOptionsType } from "@/constants";

export default function NewChartGroupPage() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { toast } = useToast();
    const { collection_slug } = useParams<{
        collection_slug: string;
    }>();
    const collection_id = parseSlug(collection_slug).id;

    const {
        data: chartsData,
        isLoading: isChartLoading,
        error: chartError,
    } = useGetAllChartsWithCollectionId(collection_id);

    const charts = useMemo(() => {
        if (!chartsData || isChartLoading || chartError) {
            return [];
        }
        return chartsData;
    }, [chartsData, isChartLoading, chartError]);

    // State for new group
    const [newGroup, setNewGroup] = useState({
        name: "",
        description: "",
        layout_type: LAYOUT_GRID as LayoutOptionsType,
        chart_ids: [] as string[],
    });

    // State for chart selection
    const [selectedChartIds, setSelectedChartIds] = useState<string[]>([]);
    const [chartSearchQuery, setChartSearchQuery] = useState("");
    const [selectedChartType, setSelectedChartType] = useState<string | null>(
        null
    );

    // Create group mutation
    const { mutate: createGroupMutation, isPending: isCreating } =
        useCreateNewGroup();

    // Filter charts based on search query and type
    const filteredCharts = charts.filter((chart) => {
        const matchesSearch =
            !chartSearchQuery.trim() ||
            chart.name.toLowerCase().includes(chartSearchQuery.toLowerCase()) ||
            chart.notion_database_name
                .toLowerCase()
                .includes(chartSearchQuery.toLowerCase());

        const matchesType =
            !selectedChartType || chart.type === selectedChartType;

        return matchesSearch && matchesType;
    });

    // Get unique chart types for filtering
    const chartTypes = [...new Set(charts.map((chart) => chart.type))];

    // Toggle chart selection
    const toggleChartSelection = (chartId: string) => {
        setSelectedChartIds((prev) =>
            prev.includes(chartId)
                ? prev.filter((id) => id !== chartId)
                : [...prev, chartId]
        );
    };

    // Handle create group
    const handleCreateGroup = () => {
        if (!newGroup.name?.trim()) {
            toast({
                title: "Error",
                description: "Group name is required",
                variant: "destructive",
            });
            return;
        }

        if (selectedChartIds.length === 0) {
            toast({
                title: "Error",
                description: "Please select at least one chart",
                variant: "destructive",
            });
            return;
        }

        createGroupMutation(
            {
                json: {
                    name: newGroup.name,
                    layout_type: newGroup.layout_type,
                    collection_id: collection_id,
                    chart_ids: selectedChartIds,
                },
            },
            {
                onSuccess: () => {
                    toast({
                        title: "Success",
                        description: "Chart group created successfully",
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["chart-groups", "all"],
                    });
                    router.push(
                        `/dashboard/collections/${collection_slug}/groups`
                    );
                },
                onError: (_error) => {
                    toast({
                        title: "Error",
                        description: "Failed to create chart group",
                        variant: "destructive",
                    });
                },
            }
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                            <Layers className="h-6 w-6 text-primary" />
                            Create Chart Group
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Create a new group to organize multiple charts
                            together
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
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">
                                Group Information
                            </h2>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Group Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Financial Dashboard"
                                    value={newGroup.name}
                                    onChange={(e) =>
                                        setNewGroup({
                                            ...newGroup,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="grid gap-4">
                                <Label>Layout Type</Label>
                                <RadioGroup
                                    value={newGroup.layout_type}
                                    onValueChange={(value) =>
                                        setNewGroup({
                                            ...newGroup,
                                            layout_type:
                                                value as LayoutOptionsType,
                                        })
                                    }
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value={LAYOUT_GRID}
                                            id="grid"
                                        />
                                        <Label
                                            htmlFor="grid"
                                            className="flex items-center gap-1.5"
                                        >
                                            <LayoutGrid className="h-4 w-4" />
                                            Grid Layout
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value={LAYOUT_CAROUSEL}
                                            id="carousel"
                                        />
                                        <Label
                                            htmlFor="carousel"
                                            className="flex items-center gap-1.5"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Carousel Layout
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    Select Charts
                                </h2>
                                <Badge variant="outline">
                                    {selectedChartIds.length} selected
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search charts..."
                                            className="pl-9"
                                            value={chartSearchQuery}
                                            onChange={(e) =>
                                                setChartSearchQuery(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="flex-shrink-0"
                                            >
                                                <Filter className="mr-2 h-4 w-4" />
                                                Chart Type
                                                <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {chartTypes.map((type) => (
                                                <DropdownMenuItem
                                                    key={type}
                                                    onClick={() =>
                                                        setSelectedChartType(
                                                            selectedChartType ===
                                                                type
                                                                ? null
                                                                : type
                                                        )
                                                    }
                                                    className="flex items-center gap-2"
                                                >
                                                    {selectedChartType ===
                                                        type && (
                                                        <Check className="h-4 w-4" />
                                                    )}
                                                    <span
                                                        className={
                                                            selectedChartType ===
                                                            type
                                                                ? "font-medium"
                                                                : ""
                                                        }
                                                    >
                                                        {type}
                                                    </span>
                                                </DropdownMenuItem>
                                            ))}
                                            {selectedChartType && (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setSelectedChartType(
                                                            null
                                                        )
                                                    }
                                                >
                                                    Clear Filter
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <Tabs defaultValue="all">
                                    <TabsList>
                                        <TabsTrigger value="all">
                                            All Charts ({charts.length})
                                        </TabsTrigger>
                                        <TabsTrigger value="selected">
                                            Selected ({selectedChartIds.length})
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="all" className="mt-4">
                                        <ScrollArea className="h-[400px] rounded-md border">
                                            {filteredCharts.length === 0 ? (
                                                <div className="flex h-full items-center justify-center p-4 text-center">
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            No charts found
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Try adjusting your
                                                            search or filter
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-4">
                                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                        {filteredCharts.map(
                                                            (chart) => (
                                                                <div
                                                                    key={
                                                                        chart.chartId
                                                                    }
                                                                    className={`flex items-start space-x-3 rounded-md border p-3 transition-colors ${
                                                                        selectedChartIds.includes(
                                                                            chart.chartId
                                                                        )
                                                                            ? "border-primary bg-primary/5"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <Checkbox
                                                                        id={`chart-${chart.chartId}`}
                                                                        checked={selectedChartIds.includes(
                                                                            chart.chartId
                                                                        )}
                                                                        onCheckedChange={() =>
                                                                            toggleChartSelection(
                                                                                chart.chartId
                                                                            )
                                                                        }
                                                                    />
                                                                    <div className="flex-1">
                                                                        <Label
                                                                            htmlFor={`chart-${chart.chartId}`}
                                                                            className="cursor-pointer text-sm font-medium"
                                                                        >
                                                                            {
                                                                                chart.name
                                                                            }
                                                                        </Label>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {
                                                                                chart.type
                                                                            }{" "}
                                                                            •{" "}
                                                                            {
                                                                                chart.notion_database_name
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </TabsContent>

                                    <TabsContent
                                        value="selected"
                                        className="mt-4"
                                    >
                                        <ScrollArea className="h-[400px] rounded-md border">
                                            {selectedChartIds.length === 0 ? (
                                                <div className="flex h-full items-center justify-center p-4 text-center">
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            No charts selected
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Select charts from
                                                            the All Charts tab
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-4">
                                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                        {selectedChartIds.map(
                                                            (chartId) => {
                                                                const chart =
                                                                    charts.find(
                                                                        (c) =>
                                                                            c.chartId ===
                                                                            chartId
                                                                    );
                                                                if (!chart) {
                                                                    return null;
                                                                }

                                                                return (
                                                                    <div
                                                                        key={
                                                                            chartId
                                                                        }
                                                                        className="flex items-start justify-between rounded-md border border-primary bg-primary/5 p-3"
                                                                    >
                                                                        <div className="flex items-start gap-3">
                                                                            <Checkbox
                                                                                id={`selected-chart-${chartId}`}
                                                                                checked={
                                                                                    true
                                                                                }
                                                                                onCheckedChange={() =>
                                                                                    toggleChartSelection(
                                                                                        chartId
                                                                                    )
                                                                                }
                                                                            />
                                                                            <div>
                                                                                <Label
                                                                                    htmlFor={`selected-chart-${chartId}`}
                                                                                    className="cursor-pointer text-sm font-medium"
                                                                                >
                                                                                    {
                                                                                        chart.name
                                                                                    }
                                                                                </Label>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    {
                                                                                        chart.type
                                                                                    }{" "}
                                                                                    •{" "}
                                                                                    {
                                                                                        chart.notion_database_name
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-6 w-6"
                                                                            onClick={() =>
                                                                                toggleChartSelection(
                                                                                    chartId
                                                                                )
                                                                            }
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                            <span className="sr-only">
                                                                                Remove
                                                                            </span>
                                                                        </Button>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold">
                                    Summary
                                </h2>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Group Name
                                    </h3>
                                    <p className="mt-1">
                                        {newGroup.name || "Not specified"}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Layout Type
                                    </h3>
                                    <p className="mt-1 flex items-center gap-1.5">
                                        {newGroup.layout_type ===
                                        LAYOUT_GRID ? (
                                            <LayoutGrid className="h-4 w-4" />
                                        ) : (
                                            <LayoutDashboard className="h-4 w-4" />
                                        )}
                                        {newGroup.layout_type
                                            .charAt(0)
                                            .toUpperCase() +
                                            newGroup.layout_type.slice(1)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Selected Charts
                                    </h3>
                                    <p className="mt-1">
                                        {selectedChartIds.length} charts
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2">
                                <Button
                                    className="w-full"
                                    onClick={handleCreateGroup}
                                    disabled={
                                        isCreating ||
                                        !newGroup.name?.trim() ||
                                        selectedChartIds.length === 0
                                    }
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Group
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    asChild
                                >
                                    <Link
                                        href={`/dashboard/collections/${collection_slug}/groups`}
                                    >
                                        Cancel
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
