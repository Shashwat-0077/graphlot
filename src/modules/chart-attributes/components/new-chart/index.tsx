"use client";

import {
    AreaChart,
    Donut,
    Grid2x2,
    Database,
    Upload,
    CloudUpload,
    ChartColumnIncreasing,
    Pentagon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChartFormStore } from "@/modules/chart-attributes/components/new-chart/store";
import {
    CHART_TYPE_AREA,
    CHART_TYPE_BAR,
    CHART_TYPE_HEATMAP,
    CHART_TYPE_RADAR,
    CHART_TYPE_RADIAL,
    DATABASE_NOTION,
    DATABASE_UPLOAD,
} from "@/constants";
import { cn, getSlug, parseSlug } from "@/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNotionDatabases } from "@/modules/notion/api/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateChart } from "@/modules/chart-attributes/api/client";

function SelectTile({
    title,
    icon,
    isSelected = false,
    onClick,
    disabled = false,
}: {
    title: string;
    icon: React.ReactNode;
    isSelected?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}) {
    return (
        <Button
            variant="outline"
            onClick={onClick}
            className={cn(
                `hover:border-primary hover:bg-primary/5 relative flex min-w-32 cursor-pointer gap-2 py-7 transition-all duration-200 hover:shadow-md`,
                isSelected ? "!border-primary/10 !bg-primary/10" : ""
            )}
            disabled={disabled}
        >
            <div
                className={`transition-colors ${isSelected ? "text-primary" : "text-muted-foreground"}`}
            >
                {icon}
            </div>
            <span className="text-sm font-medium">{title}</span>
        </Button>
    );
}

export const NewChartForm = () => {
    const chartType = useChartFormStore((s) => s.chartType);
    const dataSource = useChartFormStore((s) => s.dataSource);
    const setChartFormData = useChartFormStore((s) => s.setChartFormData);

    const { data: databases, isLoading: isLoadingDatabases } =
        useNotionDatabases();

    return (
        <div className="mt-10 ml-10 max-w-5xl space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                    Create New Chart
                </h1>
                <p className="text-muted-foreground">
                    Choose your chart type, data source, and provide basic
                    information to get started.
                </p>
            </div>

            {/* Data Source Selection */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-base font-semibold">
                        Data Source
                    </Label>
                    <p className="text-muted-foreground text-sm">
                        Choose how you want to import your data
                    </p>
                </div>
                <div className="grid max-w-md grid-cols-1 gap-4 md:grid-cols-2">
                    <SelectTile
                        title="Notion"
                        isSelected={dataSource === DATABASE_NOTION}
                        onClick={() => {
                            setChartFormData("dataSource", DATABASE_NOTION);
                        }}
                        icon={<Database size={24} />}
                    />
                    <SelectTile
                        title="Upload File"
                        isSelected={dataSource === DATABASE_UPLOAD}
                        onClick={() => {
                            setChartFormData("dataSource", DATABASE_UPLOAD);
                        }}
                        icon={<Upload size={24} />}
                        disabled
                    />
                </div>
            </div>

            {/* Chart Type Selection */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-base font-semibold">
                        Chart Type
                    </Label>
                    <p className="text-muted-foreground text-sm">
                        Select the visualization that best represents your data
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <SelectTile
                        title="Area"
                        isSelected={chartType === CHART_TYPE_AREA}
                        onClick={() => {
                            setChartFormData("chartType", CHART_TYPE_AREA);
                        }}
                        icon={<AreaChart size={24} />}
                    />
                    <SelectTile
                        title="Bar"
                        isSelected={chartType === CHART_TYPE_BAR}
                        onClick={() => {
                            setChartFormData("chartType", CHART_TYPE_BAR);
                        }}
                        icon={<ChartColumnIncreasing size={24} />}
                    />
                    <SelectTile
                        title="Radar"
                        isSelected={chartType === CHART_TYPE_RADAR}
                        onClick={() => {
                            setChartFormData("chartType", CHART_TYPE_RADAR);
                        }}
                        icon={<Pentagon size={24} />}
                    />
                    <SelectTile
                        title="Radial"
                        isSelected={chartType === CHART_TYPE_RADIAL}
                        onClick={() => {
                            setChartFormData("chartType", CHART_TYPE_RADIAL);
                        }}
                        icon={<Donut size={24} />}
                    />
                    <SelectTile
                        title="Heatmap"
                        isSelected={chartType === CHART_TYPE_HEATMAP}
                        onClick={() => {
                            setChartFormData("chartType", CHART_TYPE_HEATMAP);
                        }}
                        icon={<Grid2x2 size={24} />}
                    />
                </div>
            </div>

            {/* Chart Information */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-base font-semibold">
                        Chart Information
                    </Label>
                    <p className="text-muted-foreground text-sm">
                        Provide basic details about your chart
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label
                            htmlFor="chart-name"
                            className="text-sm font-medium"
                        >
                            Chart Name
                        </Label>
                        <Input
                            id="chart-name"
                            placeholder="e.g., Monthly Sales Report"
                            className="h-11"
                            onChange={(e) =>
                                setChartFormData("chartName", e.target.value)
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="chart-description"
                            className="text-sm font-medium"
                        >
                            Description
                        </Label>
                        <Input
                            id="chart-description"
                            placeholder="Brief description of your chart"
                            className="h-11"
                            onChange={(e) =>
                                setChartFormData("chartDesc", e.target.value)
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Animated Data Source Configuration */}
            <AnimatePresence mode="wait">
                {dataSource && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="space-y-4 overflow-hidden"
                    >
                        <div className="space-y-2">
                            <Label className="text-base font-semibold">
                                {dataSource === DATABASE_NOTION
                                    ? "Select your database"
                                    : "Upload your data"}
                            </Label>
                            <p className="text-muted-foreground text-sm">
                                {dataSource === DATABASE_NOTION
                                    ? "Select the Notion database you want to use for your chart"
                                    : "Upload a file containing your data for visualization"}
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={dataSource}
                                layout
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                transition={{
                                    duration: 0.4,
                                    ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                            >
                                {dataSource === DATABASE_NOTION ? (
                                    <div className="space-y-3">
                                        {isLoadingDatabases ? (
                                            <Skeleton className="h-8 w-full" />
                                        ) : (
                                            <Select
                                                onValueChange={(value) => {
                                                    const [id, title] =
                                                        value.split(
                                                            "<separator>"
                                                        );
                                                    setChartFormData(
                                                        "databaseId",
                                                        id
                                                    );
                                                    setChartFormData(
                                                        "databaseName",
                                                        title
                                                    );
                                                }}
                                            >
                                                <SelectTrigger className="w-full text-base">
                                                    <SelectValue placeholder="Select a database from your Notion workspace" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {databases?.map((db) => (
                                                        <SelectItem
                                                            key={db.id}
                                                            value={
                                                                db.id +
                                                                "<separator>" +
                                                                db.title
                                                            }
                                                        >
                                                            {db.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                        <p className="text-muted-foreground flex items-center gap-1 text-xs">
                                            <Database className="h-3 w-3" />
                                            Connected to your Notion workspace
                                        </p>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/10 hover:bg-muted/20 rounded-lg border-2 border-dashed p-8 text-center transition-colors duration-200">
                                            <div className="flex flex-col items-center space-y-4">
                                                <div className="bg-primary/10 rounded-full p-3">
                                                    <CloudUpload className="text-primary h-8 w-8" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-medium">
                                                        Upload your file
                                                    </h3>
                                                    <p className="text-muted-foreground text-sm">
                                                        Drag and drop your CSV,
                                                        Excel, or JSON file
                                                        here, or click to browse
                                                    </p>
                                                </div>
                                                <div className="text-muted-foreground flex items-center space-x-2 text-xs">
                                                    <span>
                                                        Supported formats:
                                                    </span>
                                                    <span className="bg-muted rounded px-2 py-1 font-mono text-xs">
                                                        .csv
                                                    </span>
                                                    <span className="bg-muted rounded px-2 py-1 font-mono text-xs">
                                                        .xlsx
                                                    </span>
                                                    <span className="bg-muted rounded px-2 py-1 font-mono text-xs">
                                                        .json
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="mt-4"
                                                >
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    Choose File
                                                </Button>
                                            </div>
                                            <input
                                                type="file"
                                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                                accept=".csv,.xlsx,.xls,.json"
                                                onChange={(e) => {
                                                    // Handle file upload
                                                    console.log(
                                                        "File selected:",
                                                        e.target.files?.[0]
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            <SubmitButton />
        </div>
    );
};

function SubmitButton() {
    const chartType = useChartFormStore((s) => s.chartType);
    const dataSource = useChartFormStore((s) => s.dataSource);
    const chartName = useChartFormStore((s) => s.chartName);
    const chartDesc = useChartFormStore((s) => s.chartDesc);
    const databaseId = useChartFormStore((s) => s.databaseId);
    const databaseName = useChartFormStore((s) => s.databaseName);
    const reset = useChartFormStore((s) => s.reset);

    const { collection_slug } = useParams<{
        collection_slug: string;
    }>();
    const router = useRouter();

    const { id: collectionId } = parseSlug(collection_slug);

    const { mutate: createChart, isPending } = useCreateChart({
        onSuccess: ({ id, name }) => {
            reset();
            toast.success("Chart created successfully");
            router.push(
                `/collections/${collection_slug}/${getSlug({
                    id,
                    name,
                })}`
            );
        },
        onError: (error) => {
            toast.error(`Error creating chart : ${error.message}`);
        },
    });

    function handleSubmit() {
        if (
            chartType &&
            dataSource &&
            chartName &&
            chartDesc &&
            databaseId &&
            databaseName
        ) {
            createChart({
                json: {
                    collectionId: collectionId,
                    databaseId: databaseId,
                    databaseName: databaseName,
                    databaseProvider: dataSource,
                    description: chartDesc,
                    name: chartName,
                    type: chartType,
                },
            });
        }
    }

    const iconMap = {
        [CHART_TYPE_BAR]: ChartColumnIncreasing,
        [CHART_TYPE_AREA]: AreaChart,
        [CHART_TYPE_RADIAL]: Donut,
        [CHART_TYPE_RADAR]: Pentagon,
        [CHART_TYPE_HEATMAP]: Grid2x2,
    };

    const IconComponent = chartType ? iconMap[chartType] : null;

    const isDisabled =
        !chartType ||
        !dataSource ||
        !chartName ||
        !chartDesc ||
        !databaseId ||
        !databaseName;

    return (
        <div className="flex justify-end gap-3 border-t pt-4">
            <Button
                disabled={isDisabled}
                className="relative w-32 overflow-hidden"
                onClick={handleSubmit}
            >
                <motion.div
                    className="flex items-center justify-center gap-2"
                    layout
                    transition={{
                        layout: {
                            duration: 0.3,
                            ease: "easeInOut",
                        },
                    }}
                >
                    {/* Icon container with fixed width to prevent layout shift */}
                    <motion.div
                        className="flex items-center justify-center overflow-hidden"
                        animate={{
                            width: chartType ? "16px" : "0px",
                        }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {IconComponent && (
                                <motion.div
                                    key={chartType}
                                    initial={{
                                        x: -24,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        x: 0,
                                        opacity: 1,
                                    }}
                                    exit={{
                                        x: 24,
                                        opacity: 0,
                                    }}
                                    transition={{
                                        duration: 0.25,
                                        ease: "easeInOut",
                                    }}
                                    className="flex flex-shrink-0 items-center justify-center"
                                    style={{ width: "24px" }}
                                >
                                    <IconComponent size={24} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Text with smooth transitions */}
                    <motion.span
                        layout
                        animate={{
                            x: 0,
                        }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                        }}
                    >
                        {isPending ? "Creating..." : "Create Chart"}
                    </motion.span>
                </motion.div>

                {/* Loading state overlay */}
                <AnimatePresence>
                    {isPending && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex items-center justify-center bg-inherit"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Button>
        </div>
    );
}
