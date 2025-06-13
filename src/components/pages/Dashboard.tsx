"use client";

import Link from "next/link";
import {
    BarChart2,
    GroupIcon as CollectionIcon,
    Plus,
    ChevronRight,
    Calendar,
    LayoutDashboard,
} from "lucide-react";
import {
    Line,
    LineChart,
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
    Legend,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CollectionSelect } from "@/modules/Collection/schema";
import { useCollections } from "@/modules/Collection/api/client/use-collections";
import { SimpleLoader } from "@/components/ui/Loader";

// Generate chart data based on collections
const generateChartData = (collections: CollectionSelect[]) => {
    // Limit to top 5 collections for better visualization
    return collections.slice(0, 5).map((collection) => ({
        name:
            collection.name.length > 12
                ? collection.name.substring(0, 12) + "..."
                : collection.name,
        charts: collection.chartCount,
        value: collection.chartCount, // For pie chart
    }));
};

// Generate monthly data for line chart
const generateMonthlyData = (collections: CollectionSelect[]) => {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const currentMonth = new Date().getMonth();

    return months.slice(0, currentMonth + 1).map((month, index) => {
        // Calculate a somewhat realistic growth pattern
        const total = collections.reduce((sum, collection) => {
            // Create a growth pattern based on collection creation date
            const collectionDate = new Date(collection.createdAt);
            const collectionMonth = collectionDate.getMonth();
            return sum + (collectionMonth <= index ? collection.chartCount : 0);
        }, 0);

        return {
            name: month,
            charts: total,
        };
    });
};

// Format relative time
const formatRelativeTime = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

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

// Custom tooltip for charts
// eslint-disable-next-line
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg bg-muted p-3 shadow-lg">
                <p className="font-medium text-white">{`${label}`}</p>
                <p className="text-sm text-[#F2545B]">{`Charts: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

// Custom tooltip for pie chart
// eslint-disable-next-line
const PieCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg bg-muted p-3 shadow-lg">
                <p className="font-medium text-white">{`${payload[0].name}`}</p>
                <p className="text-sm text-[#F2545B]">{`Charts: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

export default function DashboardContent({ username }: { username: string }) {
    // Fetch collections using the provided hook
    const { data: collections = [], isLoading, error } = useCollections();

    // If loading, show a loading state
    if (isLoading) {
        return (
            <div className="container mx-auto grid h-full place-content-center px-4 py-6">
                <SimpleLoader />
            </div>
        );
    }

    // If error, show an error state
    if (error) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="rounded-lg bg-red-50 p-4">
                    <h1 className="text-xl font-semibold text-red-800">
                        Unable to load dashboard
                    </h1>
                    <p className="mt-2 text-red-700">
                        Failed to load collections. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    // Calculate total charts across all collections
    const totalCharts = collections.reduce(
        (sum, collection) => sum + collection.chartCount,
        0
    );

    // Generate chart data
    const chartData = generateChartData(collections);
    const monthlyData = generateMonthlyData(collections);
    const COLORS = [
        "#F2545B", // base red-pink
        "#F28D8F", // tint of base
        "#F27B69", // lighter red-orange
        "#F26B4F", // orange-coral tone
        "#F2C14E", // golden-yellow
        "#F29E4C", // warm orange
        "#F2E394", // pale yellow
        "#9B54F2", // violet (triadic)
        "#5BA3F2", // soft blue (complementary)
        "#54D1F2", // bright sky blue (analogous to above)
        "#54F2B2", // aqua-mint tone
        "#54F278", // light green
        "#F2549E", // pink-magenta variant
        "#B154F2", // lavender-purple
        "#F274AC", // rose pink
    ];

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Dashboard Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2545B]/10">
                        <LayoutDashboard className="h-6 w-6 text-[#F2545B]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Welcome back, {username || "User"}
                        </p>
                    </div>
                </div>
                <Button
                    asChild
                    className="bg-[#F2545B] text-white hover:bg-[#d94850]"
                >
                    <Link href="/dashboard/new-collection">
                        <Plus className="mr-1.5 h-4 w-4" />
                        New Collection
                    </Link>
                </Button>
            </div>

            {/* Summary Section */}
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="pb-2 text-sm font-medium text-muted-foreground">
                                    Collections
                                </div>
                                <div>
                                    <div className="text-3xl font-bold">
                                        {collections.length}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {collections.length > 0 &&
                                            `Last updated ${formatRelativeTime(
                                                collections.reduce(
                                                    (latest, col) =>
                                                        Math.max(
                                                            latest,
                                                            col.updatedAt
                                                        ),
                                                    0
                                                )
                                            )}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex size-14 items-center justify-center rounded-full bg-[#F2545B]/10">
                                <CollectionIcon className="size-7 text-[#F2545B]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Charts */}
                <Card className="shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="pb-2 text-sm font-medium text-muted-foreground">
                                    Total Charts
                                </div>
                                <div>
                                    <div className="text-3xl font-bold">
                                        {totalCharts}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {collections.length > 0 &&
                                            `Across ${collections.length} collection${collections.length !== 1 ? "s" : ""}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex size-14 items-center justify-center rounded-full bg-[#F2545B]/10">
                                <BarChart2 className="size-7 text-[#F2545B]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Last Activity */}
                <Card className="shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="pb-2 text-sm font-medium text-muted-foreground">
                                    Last Activity
                                </div>
                                <div>
                                    <div className="text-3xl font-bold">
                                        {collections.length > 0
                                            ? formatRelativeTime(
                                                  collections.reduce(
                                                      (latest, col) =>
                                                          Math.max(
                                                              latest,
                                                              col.updatedAt
                                                          ),
                                                      0
                                                  )
                                              ).split(" ")[0]
                                            : "0"}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {collections.length > 0
                                            ? formatRelativeTime(
                                                  collections.reduce(
                                                      (latest, col) =>
                                                          Math.max(
                                                              latest,
                                                              col.updatedAt
                                                          ),
                                                      0
                                                  )
                                              ).split(" ")[1]
                                            : "days ago"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex size-14 items-center justify-center rounded-full bg-[#F2545B]/10">
                                <Calendar className="size-7 text-[#F2545B]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="mb-8">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Charts Growth</CardTitle>
                        <CardDescription>
                            Monthly chart creation trend
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {collections.length === 0 ? (
                            <div className="flex h-[300px] flex-col items-center justify-center text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                    <BarChart2 className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="mt-4 text-lg font-medium">
                                    No data available
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Create your first collection to start
                                    tracking chart growth
                                </p>
                            </div>
                        ) : (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={monthlyData}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 20,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#505050"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: "#888" }}
                                        />
                                        <YAxis tick={{ fill: "#888" }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="charts"
                                            name="Charts"
                                            stroke="#F2545B"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: "#F2545B" }}
                                            activeDot={{
                                                r: 6,
                                                fill: "#F2545B",
                                            }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Collections List */}
                <Card className="shadow-sm lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Your Collections</CardTitle>
                                <CardDescription>
                                    Manage and organize your chart collections
                                </CardDescription>
                            </div>
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="text-[#F2545B] hover:bg-[#F2545B]/5 hover:text-[#F2545B]"
                            >
                                <Link href="/dashboard/collections">
                                    View All
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {collections.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center p-6 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                    <CollectionIcon className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="mt-4 text-lg font-medium">
                                    No collections yet
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Create your first collection to start
                                    organizing your charts
                                </p>
                                <Button
                                    asChild
                                    className="mt-6 bg-[#F2545B] text-white hover:bg-[#d94850]"
                                >
                                    <Link href="/dashboard/new-collection">
                                        <Plus className="mr-1.5 h-4 w-4" />
                                        Create Collection
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="max-h-[400px] overflow-auto">
                                <div className="divide-y">
                                    {collections.map((collection) => (
                                        <Link
                                            key={collection.collectionId}
                                            href={`/dashboard/collections/${collection.collectionId}-${collection.name.toLowerCase().replace(/\s+/g, "-")}`}
                                            className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2545B]/10">
                                                    <CollectionIcon className="h-5 w-5 text-[#F2545B]" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {collection.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {collection.chartCount}{" "}
                                                        chart
                                                        {collection.chartCount !==
                                                        1
                                                            ? "s"
                                                            : ""}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-[#F2545B]/5 text-[#F2545B] hover:bg-[#F2545B]/10"
                                                >
                                                    {formatRelativeTime(
                                                        collection.updatedAt
                                                    )}
                                                </Badge>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Collection Distribution */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Collection Distribution</CardTitle>
                        <CardDescription>Charts per collection</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {collections.length === 0 ? (
                            <div className="flex h-[300px] flex-col items-center justify-center text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                    <BarChart2 className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="mt-4 text-lg font-medium">
                                    No data available
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Create collections to see distribution
                                </p>
                            </div>
                        ) : (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart
                                        margin={{
                                            top: 0,
                                            right: 0,
                                            bottom: 0,
                                            left: 0,
                                        }}
                                    >
                                        <Pie
                                            data={chartData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            label={({ name, percent }) =>
                                                `${name.slice(0, 10)}: ${(percent * 100).toFixed(0)}%`
                                            }
                                            labelLine={false}
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={<PieCustomTooltip />}
                                        />
                                        <Legend
                                            layout="vertical"
                                            verticalAlign="bottom"
                                            align="center"
                                        />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
