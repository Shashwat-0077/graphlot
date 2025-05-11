"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    Layers,
    ArrowLeft,
    X,
    Edit,
    Trash2,
    Check,
    LayoutGrid,
    LayoutDashboard,
    Save,
    Loader2,
    ChevronDown,
    Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyChartGroups } from "@/modules/chartGroups/components/EmptyChartGroups";
import type { ChartType } from "@/constants";

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

type ChartGroup = {
    group_id: string;
    name: string;
    description?: string;
    layout_type: "grid" | "dashboard";
    chart_ids: string[];
    chart_count: number;
    created_at: string;
    updated_at?: string;
};

export function ChartGroupsPage({
    collection_slug,
    charts,
    collection,
}: {
    collection_slug: string;
    charts: Chart[];
    collection: Collection;
}) {
    // State for groups
    const [groups, setGroups] = useState<ChartGroup[]>([
        {
            group_id: "1",
            name: "Financial Overview",
            description: "Key financial metrics and KPIs",
            layout_type: "grid",
            chart_ids: ["chart1", "chart2", "chart3", "chart4"],
            chart_count: 4,
            created_at: new Date().toISOString(),
        },
        {
            group_id: "2",
            name: "Marketing Analytics",
            description: "Marketing campaign performance",
            layout_type: "dashboard",
            chart_ids: ["chart5", "chart6", "chart7"],
            chart_count: 3,
            created_at: new Date().toISOString(),
        },
        {
            group_id: "3",
            name: "Sales Performance",
            description: "Sales metrics by region and product",
            layout_type: "grid",
            chart_ids: ["chart8", "chart9", "chart10", "chart11", "chart12"],
            chart_count: 5,
            created_at: new Date().toISOString(),
        },
    ]);

    // State for filtering and searching
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredGroups, setFilteredGroups] = useState<ChartGroup[]>(groups);
    const [isLoading, setIsLoading] = useState(false);

    // State for create/edit modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newGroup, setNewGroup] = useState<Partial<ChartGroup>>({
        name: "",
        description: "",
        layout_type: "grid",
        chart_ids: [],
    });

    // State for edit mode
    const [editingGroup, setEditingGroup] = useState<ChartGroup | null>(null);
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

    // State for delete confirmation
    const [groupToDelete, setGroupToDelete] = useState<ChartGroup | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // State for chart selection
    const [isChartSelectOpen, setIsChartSelectOpen] = useState(false);
    const [selectedChartIds, setSelectedChartIds] = useState<string[]>([]);
    const [chartSearchQuery, setChartSearchQuery] = useState("");
    const [selectedChartType, setSelectedChartType] = useState<string | null>(
        null
    );

    // Filter groups based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredGroups(groups);
            return;
        }

        const filtered = groups.filter(
            (group) =>
                group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (group.description &&
                    group.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()))
        );
        setFilteredGroups(filtered);
    }, [searchQuery, groups]);

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

    // Reset form state
    const resetFormState = () => {
        setNewGroup({
            name: "",
            description: "",
            layout_type: "grid",
            chart_ids: [],
        });
        setSelectedChartIds([]);
        setChartSearchQuery("");
        setSelectedChartType(null);
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

        setIsLoading(true);

        // Create new group with optimistic UI
        const newGroupData: ChartGroup = {
            group_id: uuidv4(), // Generate temporary ID
            name: newGroup.name!,
            description: newGroup.description,
            layout_type: newGroup.layout_type as "grid" | "dashboard",
            chart_ids: selectedChartIds,
            chart_count: selectedChartIds.length,
            created_at: new Date().toISOString(),
        };

        // Optimistically update UI
        setGroups((prevGroups) => [...prevGroups, newGroupData]);
        setIsCreateModalOpen(false);
        resetFormState();

        // Show success toast
        toast({
            title: "Success",
            description: "Chart group created successfully",
        });

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // In a real app, you would handle API errors here and potentially revert the optimistic update
        }, 1000);
    };

    // Handle edit group
    const handleEditGroup = (group: ChartGroup) => {
        setEditingGroup(group);
        setSelectedChartIds([...group.chart_ids]);
        setIsEditSheetOpen(true);
    };

    // Handle apply edit changes
    const handleApplyChanges = () => {
        if (!editingGroup) {
            return;
        }

        if (!editingGroup.name?.trim()) {
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

        setIsLoading(true);

        // Update group with optimistic UI
        const updatedGroup: ChartGroup = {
            ...editingGroup,
            chart_ids: selectedChartIds,
            chart_count: selectedChartIds.length,
            updated_at: new Date().toISOString(),
        };

        // Optimistically update UI
        setGroups((prevGroups) =>
            prevGroups.map((g) =>
                g.group_id === updatedGroup.group_id ? updatedGroup : g
            )
        );

        setIsEditSheetOpen(false);
        setEditingGroup(null);
        resetFormState();

        // Show success toast
        toast({
            title: "Success",
            description: "Chart group updated successfully",
        });

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // In a real app, you would handle API errors here and potentially revert the optimistic update
        }, 1000);
    };

    // Handle delete group
    const handleDeleteGroup = () => {
        if (!groupToDelete) {
            return;
        }

        setIsLoading(true);

        // Optimistically update UI
        setGroups((prevGroups) =>
            prevGroups.filter((g) => g.group_id !== groupToDelete.group_id)
        );

        setIsDeleteDialogOpen(false);
        setGroupToDelete(null);

        // Show success toast
        toast({
            title: "Success",
            description: "Chart group deleted successfully",
        });

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // In a real app, you would handle API errors here and potentially revert the optimistic update
        }, 1000);
    };

    // Toggle chart selection
    const toggleChartSelection = (chartId: string) => {
        setSelectedChartIds((prev) =>
            prev.includes(chartId)
                ? prev.filter((id) => id !== chartId)
                : [...prev, chartId]
        );
    };

    // Get chart by ID
    const getChartById = useCallback(
        (chartId: string) => {
            return charts.find((chart) => chart.chart_id === chartId);
        },
        [charts]
    );

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
                    <span className="text-sm font-medium">Groups</span>
                </div>
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
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                            <Plus className="mr-1.5 h-4 w-4" />
                            New Chart Group
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
                    <Badge variant="outline" className="px-3 py-1">
                        {filteredGroups.length} group
                        {filteredGroups.length !== 1 ? "s" : ""}
                    </Badge>
                </div>
            </div>

            {filteredGroups.length === 0 ? (
                <EmptyChartGroups
                    collection_slug={collection_slug}
                    onCreateClick={() => setIsCreateModalOpen(true)}
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
                                                    handleEditGroup(group)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Edit group
                                                </span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                                                onClick={() => {
                                                    setGroupToDelete(group);
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Delete group
                                                </span>
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-5">
                                        <h3 className="mb-1 truncate text-xl font-semibold">
                                            {group.name}
                                        </h3>
                                        {group.description && (
                                            <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                                                {group.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className="flex items-center gap-1.5 font-normal"
                                            >
                                                {group.layout_type ===
                                                "grid" ? (
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
                                                    ? `Updated: ${new Date(group.updated_at).toDateString()}`
                                                    : `Created: ${new Date(group.created_at).toDateString()}`}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 gap-1 text-xs"
                                                onClick={() =>
                                                    handleEditGroup(group)
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
                        <Button
                            variant="ghost"
                            className="group flex h-full min-h-[270px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/25 bg-card/50 p-6 text-center transition-all hover:border-primary/50 hover:bg-muted/50"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <div className="mb-3 rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                                <Plus className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-medium">
                                New Chart Group
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Create a new group to organize multiple charts
                            </p>
                        </Button>
                    </motion.div>
                </motion.div>
            )}

            {/* Create Group Modal */}
            <Dialog
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            >
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Create Chart Group</DialogTitle>
                        <DialogDescription>
                            Create a new group to organize multiple charts
                            together
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Group Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Financial Dashboard"
                                value={newGroup.name || ""}
                                onChange={(e) =>
                                    setNewGroup({
                                        ...newGroup,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">
                                Description (Optional)
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the purpose of this chart group..."
                                value={newGroup.description || ""}
                                onChange={(e) =>
                                    setNewGroup({
                                        ...newGroup,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Layout Type</Label>
                            <RadioGroup
                                value={newGroup.layout_type}
                                onValueChange={(value) =>
                                    setNewGroup({
                                        ...newGroup,
                                        layout_type: value as
                                            | "grid"
                                            | "dashboard",
                                    })
                                }
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="grid" id="grid" />
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
                                        value="dashboard"
                                        id="dashboard"
                                    />
                                    <Label
                                        htmlFor="dashboard"
                                        className="flex items-center gap-1.5"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard Layout
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label>Select Charts</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsChartSelectOpen(true)}
                                >
                                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                                    Add Charts
                                </Button>
                            </div>

                            {selectedChartIds.length === 0 ? (
                                <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                                    No charts selected. Click &quot;Add
                                    Charts&quot; to select charts for this
                                    group.
                                </div>
                            ) : (
                                <div className="rounded-md border p-2">
                                    <div className="mb-2 flex items-center justify-between px-2">
                                        <span className="text-sm font-medium">
                                            {selectedChartIds.length} charts
                                            selected
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-xs"
                                            onClick={() =>
                                                setSelectedChartIds([])
                                            }
                                        >
                                            Clear All
                                        </Button>
                                    </div>
                                    <ScrollArea className="h-[150px]">
                                        <div className="space-y-1 p-2">
                                            {selectedChartIds.map((chartId) => {
                                                const chart =
                                                    getChartById(chartId);
                                                if (!chart) {
                                                    return null;
                                                }

                                                return (
                                                    <div
                                                        key={chartId}
                                                        className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                                                    >
                                                        <div>
                                                            <p className="font-medium">
                                                                {chart.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {chart.type}
                                                            </p>
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
                                            })}
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCreateModalOpen(false);
                                resetFormState();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateGroup}
                            disabled={
                                isLoading ||
                                !newGroup.name?.trim() ||
                                selectedChartIds.length === 0
                            }
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Group"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Group Sheet */}
            <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                <SheetContent className="sm:max-w-[600px]" side="right">
                    <SheetHeader>
                        <SheetTitle>Edit Chart Group</SheetTitle>
                        <SheetDescription>
                            Make changes to your chart group
                        </SheetDescription>
                    </SheetHeader>

                    {editingGroup && (
                        <div className="mt-6 grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Group Name</Label>
                                <Input
                                    id="edit-name"
                                    placeholder="e.g., Financial Dashboard"
                                    value={editingGroup.name}
                                    onChange={(e) =>
                                        setEditingGroup({
                                            ...editingGroup,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">
                                    Description (Optional)
                                </Label>
                                <Textarea
                                    id="edit-description"
                                    placeholder="Describe the purpose of this chart group..."
                                    value={editingGroup.description || ""}
                                    onChange={(e) =>
                                        setEditingGroup({
                                            ...editingGroup,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Layout Type</Label>
                                <RadioGroup
                                    value={editingGroup.layout_type}
                                    onValueChange={(value) =>
                                        setEditingGroup({
                                            ...editingGroup,
                                            layout_type: value as
                                                | "grid"
                                                | "dashboard",
                                        })
                                    }
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="grid"
                                            id="edit-grid"
                                        />
                                        <Label
                                            htmlFor="edit-grid"
                                            className="flex items-center gap-1.5"
                                        >
                                            <LayoutGrid className="h-4 w-4" />
                                            Grid Layout
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="dashboard"
                                            id="edit-dashboard"
                                        />
                                        <Label
                                            htmlFor="edit-dashboard"
                                            className="flex items-center gap-1.5"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard Layout
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label>Manage Charts</Label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setIsChartSelectOpen(true)
                                        }
                                    >
                                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                                        Add Charts
                                    </Button>
                                </div>

                                {selectedChartIds.length === 0 ? (
                                    <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                                        No charts selected. Click &quot;Add
                                        Charts&quot; to select charts for this
                                        group.
                                    </div>
                                ) : (
                                    <div className="rounded-md border p-2">
                                        <div className="mb-2 flex items-center justify-between px-2">
                                            <span className="text-sm font-medium">
                                                {selectedChartIds.length} charts
                                                selected
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs"
                                                onClick={() =>
                                                    setSelectedChartIds([])
                                                }
                                            >
                                                Clear All
                                            </Button>
                                        </div>
                                        <ScrollArea className="h-[300px]">
                                            <div className="space-y-1 p-2">
                                                {selectedChartIds.map(
                                                    (chartId) => {
                                                        const chart =
                                                            getChartById(
                                                                chartId
                                                            );
                                                        if (!chart) {
                                                            return null;
                                                        }

                                                        return (
                                                            <div
                                                                key={chartId}
                                                                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                                                            >
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {
                                                                            chart.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {
                                                                            chart.type
                                                                        }
                                                                    </p>
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
                                        </ScrollArea>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <SheetFooter className="mt-6">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditSheetOpen(false);
                                setEditingGroup(null);
                                resetFormState();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApplyChanges}
                            disabled={
                                isLoading ||
                                !editingGroup?.name?.trim() ||
                                selectedChartIds.length === 0
                            }
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Apply Changes
                                </>
                            )}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Chart Selection Dialog */}
            <Dialog
                open={isChartSelectOpen}
                onOpenChange={setIsChartSelectOpen}
            >
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Select Charts</DialogTitle>
                        <DialogDescription>
                            Choose the charts to include in this group
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-2 flex flex-col gap-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search charts..."
                                    className="pl-9"
                                    value={chartSearchQuery}
                                    onChange={(e) =>
                                        setChartSearchQuery(e.target.value)
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
                                                    selectedChartType === type
                                                        ? null
                                                        : type
                                                )
                                            }
                                            className="flex items-center gap-2"
                                        >
                                            {selectedChartType === type && (
                                                <Check className="h-4 w-4" />
                                            )}
                                            <span
                                                className={
                                                    selectedChartType === type
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
                                                setSelectedChartType(null)
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
                                <ScrollArea className="h-[300px] rounded-md border">
                                    {filteredCharts.length === 0 ? (
                                        <div className="flex h-full items-center justify-center p-4 text-center">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    No charts found
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Try adjusting your search or
                                                    filter
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4">
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                {filteredCharts.map((chart) => (
                                                    <div
                                                        key={chart.chart_id}
                                                        className={`flex items-start space-x-3 rounded-md border p-3 transition-colors ${
                                                            selectedChartIds.includes(
                                                                chart.chart_id
                                                            )
                                                                ? "border-primary bg-primary/5"
                                                                : ""
                                                        }`}
                                                    >
                                                        <Checkbox
                                                            id={`chart-${chart.chart_id}`}
                                                            checked={selectedChartIds.includes(
                                                                chart.chart_id
                                                            )}
                                                            onCheckedChange={() =>
                                                                toggleChartSelection(
                                                                    chart.chart_id
                                                                )
                                                            }
                                                        />
                                                        <div className="flex-1">
                                                            <Label
                                                                htmlFor={`chart-${chart.chart_id}`}
                                                                className="cursor-pointer text-sm font-medium"
                                                            >
                                                                {chart.name}
                                                            </Label>
                                                            <p className="text-xs text-muted-foreground">
                                                                {chart.type} •{" "}
                                                                {
                                                                    chart.notion_database_name
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </ScrollArea>
                            </TabsContent>

                            <TabsContent value="selected" className="mt-4">
                                <ScrollArea className="h-[300px] rounded-md border">
                                    {selectedChartIds.length === 0 ? (
                                        <div className="flex h-full items-center justify-center p-4 text-center">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    No charts selected
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Select charts from the All
                                                    Charts tab
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4">
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                {selectedChartIds.map(
                                                    (chartId) => {
                                                        const chart =
                                                            getChartById(
                                                                chartId
                                                            );
                                                        if (!chart) {
                                                            return null;
                                                        }

                                                        return (
                                                            <div
                                                                key={chartId}
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
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsChartSelectOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={() => setIsChartSelectOpen(false)}>
                            Done ({selectedChartIds.length})
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Chart Group</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this chart group?
                            This action cannot be undone. The charts in this
                            group will not be deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteGroup}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isLoading ? (
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
    );
}
