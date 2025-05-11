import Link from "next/link";
import {
    BarChart2,
    Clock,
    ShoppingBasketIcon as Collection,
    FileBarChart,
    Layers,
    Plus,
    RefreshCw,
    Settings,
    Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/modules/auth";
import { getAllCollections } from "@/modules/Collection/api/getCollections";

// Mock data for recent activity
const recentActivity = [
    {
        id: "1",
        type: "chart_created",
        title: "Revenue Growth",
        collection: "Financial Overview",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
        id: "2",
        type: "collection_updated",
        title: "Marketing Analytics",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
        id: "3",
        type: "chart_group_created",
        title: "Q2 Performance",
        collection: "Sales Dashboard",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    },
    {
        id: "4",
        type: "chart_updated",
        title: "Customer Acquisition",
        collection: "Marketing Analytics",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
];

// Mock data for favorite charts
const favoriteCharts = [
    {
        id: "chart1",
        name: "Monthly Revenue",
        collection: "Financial Overview",
        collection_id: "col1",
        type: "AREA",
        last_updated: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
        id: "chart2",
        name: "Customer Growth",
        collection: "Marketing Analytics",
        collection_id: "col2",
        type: "LINE",
        last_updated: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
        id: "chart3",
        name: "Sales by Region",
        collection: "Sales Dashboard",
        collection_id: "col3",
        type: "PIE",
        last_updated: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
];

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="mt-2 text-red-500">You are not logged in.</p>
            </div>
        );
    }

    const { user } = session;

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="mt-2 text-red-500">User not found.</p>
            </div>
        );
    }

    const response = await getAllCollections({ userId: user.id || "" });

    if (!response.ok) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="mt-2 text-red-500">{response.error}</p>
            </div>
        );
    }

    const collections = response.collections;

    // Calculate total charts across all collections
    const totalCharts = collections.reduce(
        (sum, collection) => sum + collection.chart_count,
        0
    );

    // Calculate total chart groups (mock data for now)
    const totalChartGroups = 5;

    // Format relative time
    const formatRelativeTime = (timestamp: string) => {
        const now = new Date();
        const date = new Date(timestamp);
        const diffInSeconds = Math.floor(
            (now.getTime() - date.getTime()) / 1000
        );

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        } else if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        } else {
            return `${Math.floor(diffInSeconds / 86400)} days ago`;
        }
    };

    // Activity icon mapping
    const getActivityIcon = (type: string) => {
        switch (type) {
            case "chart_created":
                return <FileBarChart className="h-4 w-4 text-green-500" />;
            case "chart_updated":
                return <RefreshCw className="h-4 w-4 text-blue-500" />;
            case "collection_updated":
                return <Collection className="h-4 w-4 text-purple-500" />;
            case "chart_group_created":
                return <Layers className="h-4 w-4 text-amber-500" />;
            default:
                return <Clock className="h-4 w-4 text-muted-foreground" />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Dashboard Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Welcome back, {session?.user?.name || "User"}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild>
                        <Link href="/dashboard/new-collection">
                            <Plus className="mr-1.5 h-4 w-4" />
                            New Collection
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="overflow-hidden">
                    <CardHeader className="bg-primary/10 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Collections
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold">
                                {collections.length}
                            </div>
                            <Collection className="h-8 w-8 text-primary/60" />
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                            {collections.length > 0
                                ? `Last updated ${formatRelativeTime(
                                      collections
                                          .reduce((latest, col) => {
                                              const colDate = new Date(
                                                  col.created_at
                                              );
                                              const latestDate = new Date(
                                                  latest
                                              );
                                              return colDate > latestDate
                                                  ? col.created_at
                                                  : latest;
                                          }, collections[0].created_at)
                                          .toString()
                                  )}`
                                : "No collections yet"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden">
                    <CardHeader className="bg-blue-500/10 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Charts
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold">
                                {totalCharts}
                            </div>
                            <BarChart2 className="h-8 w-8 text-blue-500/60" />
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                            {collections.length > 0
                                ? `Across ${collections.length} collection${collections.length !== 1 ? "s" : ""}`
                                : "No charts yet"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden">
                    <CardHeader className="bg-amber-500/10 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Chart Groups
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold">
                                {totalChartGroups}
                            </div>
                            <Layers className="h-8 w-8 text-amber-500/60" />
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Organize your charts into groups
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Collections and Charts Overview */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="collections" className="h-full">
                        <TabsList className="mb-4 grid w-full grid-cols-3">
                            <TabsTrigger value="collections">
                                Collections
                            </TabsTrigger>
                            <TabsTrigger value="recent-charts">
                                Recent Charts
                            </TabsTrigger>
                            <TabsTrigger value="favorites">
                                Favorites
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value="collections"
                            className="h-[calc(100%-40px)]"
                        >
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>Your Collections</CardTitle>
                                    <CardDescription>
                                        Manage and organize your chart
                                        collections
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {collections.length === 0 ? (
                                        <div className="flex h-64 flex-col items-center justify-center p-6 text-center">
                                            <Collection className="mb-4 h-10 w-10 text-muted-foreground" />
                                            <h3 className="text-lg font-medium">
                                                No collections yet
                                            </h3>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Create your first collection to
                                                start organizing your charts
                                            </p>
                                            <Button asChild className="mt-4">
                                                <Link href="/dashboard/new-collection">
                                                    <Plus className="mr-1.5 h-4 w-4" />
                                                    Create Collection
                                                </Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="max-h-[500px] overflow-auto">
                                            <div className="divide-y">
                                                {collections.map(
                                                    (collection) => (
                                                        <Link
                                                            key={
                                                                collection.collection_id
                                                            }
                                                            href={`/dashboard/collections/${collection.collection_id}-${collection.name.toLowerCase().replace(/\s+/g, "-")}`}
                                                            className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                                                                    <Collection className="h-5 w-5 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {
                                                                            collection.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {
                                                                            collection.chart_count
                                                                        }{" "}
                                                                        chart
                                                                        {collection.chart_count !==
                                                                        1
                                                                            ? "s"
                                                                            : ""}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline">
                                                                {formatRelativeTime(
                                                                    collection.created_at.toString()
                                                                )}
                                                            </Badge>
                                                        </Link>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="border-t bg-muted/20 p-4">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Link href="/dashboard/collections">
                                            View All Collections
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent
                            value="recent-charts"
                            className="h-[calc(100%-40px)]"
                        >
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>Recent Charts</CardTitle>
                                    <CardDescription>
                                        Your recently created and updated charts
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="max-h-[500px] overflow-auto">
                                        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                                            {favoriteCharts.map((chart) => (
                                                <Card
                                                    key={chart.id}
                                                    className="overflow-hidden"
                                                >
                                                    <CardHeader className="bg-muted/30 p-4">
                                                        <CardTitle className="text-base">
                                                            {chart.name}
                                                        </CardTitle>
                                                        <CardDescription>
                                                            {chart.collection}
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="p-4">
                                                        <div className="flex aspect-video items-center justify-center rounded-md bg-muted/50">
                                                            <BarChart2 className="h-8 w-8 text-muted-foreground/50" />
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="flex items-center justify-between border-t bg-muted/20 p-3">
                                                        <Badge variant="outline">
                                                            {chart.type}
                                                        </Badge>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/dashboard/collections/${chart.collection_id}/charts/${chart.id}`}
                                                            >
                                                                View
                                                            </Link>
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t bg-muted/20 p-4">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Link href="/dashboard/collections">
                                            View All Charts
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent
                            value="favorites"
                            className="h-[calc(100%-40px)]"
                        >
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>Favorite Charts</CardTitle>
                                    <CardDescription>
                                        Your starred and frequently accessed
                                        charts
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="max-h-[500px] overflow-auto">
                                        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                                            {favoriteCharts.map((chart) => (
                                                <Card
                                                    key={chart.id}
                                                    className="overflow-hidden"
                                                >
                                                    <CardHeader className="bg-amber-500/10 p-4">
                                                        <div className="flex items-center justify-between">
                                                            <CardTitle className="text-base">
                                                                {chart.name}
                                                            </CardTitle>
                                                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                                        </div>
                                                        <CardDescription>
                                                            {chart.collection}
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="p-4">
                                                        <div className="flex aspect-video items-center justify-center rounded-md bg-muted/50">
                                                            <BarChart2 className="h-8 w-8 text-muted-foreground/50" />
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="flex items-center justify-between border-t bg-muted/20 p-3">
                                                        <Badge variant="outline">
                                                            {chart.type}
                                                        </Badge>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/dashboard/collections/${chart.collection_id}/charts/${chart.id}`}
                                                            >
                                                                View
                                                            </Link>
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t bg-muted/20 p-4">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Link href="/dashboard/collections">
                                            Manage Favorites
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Activity Feed */}
                <div>
                    <Card className="h-full">
                        <CardHeader>
                            {/* 
                                // TODO : user GA4 to track user activity and show it here
                            */}
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Your latest actions and updates
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-[500px] overflow-auto">
                                <div className="divide-y">
                                    {recentActivity.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="flex gap-4 p-4"
                                        >
                                            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium">
                                                        {activity.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatRelativeTime(
                                                            activity.timestamp
                                                        )}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {activity.type ===
                                                        "chart_created" &&
                                                        `Created a new chart in ${activity.collection}`}
                                                    {activity.type ===
                                                        "chart_updated" &&
                                                        `Updated chart in ${activity.collection}`}
                                                    {activity.type ===
                                                        "collection_updated" &&
                                                        "Updated collection details"}
                                                    {activity.type ===
                                                        "chart_group_created" &&
                                                        `Created a new chart group in ${activity.collection}`}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/20 p-4">
                            <Button variant="outline" className="w-full">
                                View All Activity
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common tasks and shortcuts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            <Button
                                variant="outline"
                                className="h-auto flex-col gap-2 p-4"
                                asChild
                            >
                                <Link href="/dashboard/new-collection">
                                    <Collection className="h-6 w-6" />
                                    <span>New Collection</span>
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-auto flex-col gap-2 p-4"
                                asChild
                            >
                                <Link href="/dashboard/collections">
                                    <FileBarChart className="h-6 w-6" />
                                    <span>New Chart</span>
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-auto flex-col gap-2 p-4"
                                asChild
                            >
                                <Link href="/dashboard/collections">
                                    <Layers className="h-6 w-6" />
                                    <span>New Group</span>
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-auto flex-col gap-2 p-4"
                                asChild
                            >
                                <Link href="/dashboard/settings">
                                    <Settings className="h-6 w-6" />
                                    <span>Settings</span>
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-auto flex-col gap-2 p-4"
                            >
                                <Star className="h-6 w-6" />
                                <span>Favorites</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
