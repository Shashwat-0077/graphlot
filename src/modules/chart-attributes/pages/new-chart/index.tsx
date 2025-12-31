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
    CheckCircle,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useParams, usePathname, useRouter } from "next/navigation";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    CHART_TYPE_AREA,
    CHART_TYPE_BAR,
    CHART_TYPE_HEATMAP,
    CHART_TYPE_RADAR,
    CHART_TYPE_RADIAL,
    COLUMN_SELECT_TYPES,
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
import { useNotionChart } from "@/modules/chart-attributes/api/client";
import { Badge } from "@/components/ui/badge";
import { useChartFormStore } from "@/modules/chart-attributes/pages/new-chart/store";

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
                isSelected ? "border-primary/10! bg-primary/10!" : ""
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
    const fileData = useChartFormStore((s) => s.fileData);
    const setChartFormData = useChartFormStore((s) => s.setChartFormData);
    const addHeaderMapping = useChartFormStore((s) => s.addHeaderMapping);
    const resetFileData = useChartFormStore((s) => s.resetFileData);

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isProcessingFile, setIsProcessingFile] = useState(false);

    const { data: databases, isLoading: isLoadingDatabases } =
        useNotionDatabases();

    async function parseData(file: File): // eslint-disable-next-line
    Promise<{ headers: string[]; data: any[] }> {
        const fileExtension = file.name.split(".").pop()?.toLowerCase();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const data = event.target?.result;

                if (!data) {
                    reject(new Error("Failed to read file"));
                    return;
                }

                try {
                    let parsedData;
                    let jsonData;

                    switch (fileExtension) {
                        case "csv":
                            parsedData = Papa.parse(data as string, {
                                header: true,
                                skipEmptyLines: true,
                                dynamicTyping: true,
                                delimitersToGuess: [",", "\t", "|", ";"],
                            });

                            // Clean headers by trimming whitespace
                            const cleanHeaders = (
                                parsedData.meta.fields || []
                            ).map((header: string) => header.trim());

                            resolve({
                                headers: cleanHeaders,
                                data: parsedData.data || [],
                            });
                            break;

                        case "xlsx":
                        case "xls":
                            const workbook = XLSX.read(data, {
                                type: "binary",
                            });
                            const sheetName = workbook.SheetNames[0];

                            if (!sheetName) {
                                reject(
                                    new Error("No sheets found in Excel file")
                                );
                                return;
                            }

                            const worksheet = workbook.Sheets[sheetName];
                            jsonData = XLSX.utils.sheet_to_json(worksheet);

                            const excelHeaders =
                                jsonData.length > 0
                                    ? Object.keys(jsonData[0] as object).map(
                                          (header) => header.trim()
                                      )
                                    : [];

                            resolve({
                                headers: excelHeaders,
                                data: jsonData,
                            });
                            break;

                        case "json":
                            jsonData = JSON.parse(data as string);
                            const headers =
                                Array.isArray(jsonData) && jsonData.length > 0
                                    ? Object.keys(jsonData[0]).map((header) =>
                                          header.trim()
                                      )
                                    : [];

                            resolve({
                                headers,
                                data: Array.isArray(jsonData)
                                    ? jsonData
                                    : [jsonData],
                            });
                            break;

                        default:
                            reject(
                                new Error(
                                    `Unsupported file type: ${fileExtension}`
                                )
                            );
                    }
                } catch (error) {
                    reject(
                        new Error(
                            `Failed to parse ${fileExtension?.toUpperCase()} file: ${error instanceof Error ? error.message : "Unknown error"}`
                        )
                    );
                }
            };

            reader.onerror = () => {
                reject(new Error("Failed to read file"));
            };

            // Read file based on type
            if (fileExtension === "xlsx" || fileExtension === "xls") {
                reader.readAsBinaryString(file);
            } else {
                reader.readAsText(file);
            }
        });
    }

    function validateFileUpload(file: File) {
        const allowedTypes = ["csv", "xlsx", "xls", "json"];
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!fileExtension || !allowedTypes.includes(fileExtension)) {
            return {
                isValid: false,
                message:
                    "Please upload a CSV, Excel (.xlsx/.xls), or JSON file",
            };
        }

        if (file.size > maxSize) {
            return {
                isValid: false,
                message: "File size too large. Maximum size is 10MB",
            };
        }

        return { isValid: true };
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) {
            resetFileData();
            setUploadedFile(null);
            return;
        }

        const validationResult = validateFileUpload(file);

        if (!validationResult.isValid) {
            resetFileData();
            setUploadedFile(null);
            toast.error(validationResult.message);
            // Reset the input
            e.target.value = "";
            return;
        }

        setIsProcessingFile(true);

        try {
            const parsedData = await parseData(file);

            setChartFormData("fileData", {
                fileName: file.name,
                fileSize: file.size,
                headers: {},
                data: parsedData.data,
                rowCount: parsedData.data.length,
            });

            for (const header of parsedData.headers) {
                addHeaderMapping(header, {
                    type: COLUMN_SELECT_TYPES["NONE"],
                    displayName: header,
                    skipColumn: false,
                    removeNullEntries: false,
                });
            }

            setUploadedFile(file);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to parse file"
            );
            resetFileData();
            setUploadedFile(null);
            // Reset the input
            e.target.value = "";
        } finally {
            setIsProcessingFile(false);
        }
    }

    function removeUploadedFile() {
        setUploadedFile(null);
        resetFileData();
    }

    const headersArray = Object.keys(fileData.headers);

    return (
        <div className="h-[calc(100svh+200px)] max-w-5xl space-y-8">
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
                            resetFileData();
                            setUploadedFile(null);
                        }}
                        icon={<Database size={24} />}
                    />
                    <SelectTile
                        disabled
                        title="Upload File"
                        isSelected={dataSource === DATABASE_UPLOAD}
                        onClick={() => {
                            setChartFormData("dataSource", DATABASE_UPLOAD);
                            setChartFormData("notionDatabaseId", "");
                            setChartFormData("databaseName", "");
                        }}
                        icon={<Upload size={24} />}
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
                                                        "notionDatabaseId",
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
                                    <div className="space-y-4">
                                        {/* Animated File Upload States */}
                                        <AnimatePresence mode="wait">
                                            {!uploadedFile ? (
                                                <motion.div
                                                    key="upload-area"
                                                    initial={{
                                                        height: 0,
                                                    }}
                                                    animate={{
                                                        height: "auto",
                                                    }}
                                                    exit={{
                                                        height: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.4,
                                                        ease: "easeInOut",
                                                    }}
                                                    className="relative overflow-hidden"
                                                >
                                                    <div className="border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/10 hover:bg-muted/20 rounded-lg border-2 border-dashed p-8 text-center transition-colors duration-200">
                                                        <div className="flex flex-col items-center space-y-4">
                                                            <div className="bg-primary/10 rounded-full p-3">
                                                                <CloudUpload className="text-primary h-8 w-8" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <h3 className="text-lg font-medium">
                                                                    {isProcessingFile
                                                                        ? "Processing file..."
                                                                        : "Upload your file"}
                                                                </h3>
                                                                <p className="text-muted-foreground text-sm">
                                                                    {isProcessingFile
                                                                        ? "Please wait while we process your file"
                                                                        : "Drag and drop your CSV, Excel, or JSON file here, or click to browse"}
                                                                </p>
                                                            </div>
                                                            <div className="text-muted-foreground flex items-center space-x-2 text-xs">
                                                                <span>
                                                                    Supported
                                                                    formats:
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
                                                                disabled={
                                                                    isProcessingFile
                                                                }
                                                            >
                                                                <Upload className="mr-2 h-4 w-4" />
                                                                {isProcessingFile
                                                                    ? "Processing..."
                                                                    : "Choose File"}
                                                            </Button>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                                            accept=".csv,.xlsx,.xls,.json"
                                                            onChange={
                                                                handleFileUpload
                                                            }
                                                            disabled={
                                                                isProcessingFile
                                                            }
                                                        />
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="success-state"
                                                    initial={{
                                                        height: 0,
                                                    }}
                                                    animate={{
                                                        height: "auto",
                                                    }}
                                                    exit={{
                                                        height: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.4,
                                                        ease: "easeInOut",
                                                    }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="flex items-start justify-between rounded-2xl border-2 border-emerald-500/20 bg-emerald-500/5 p-6 shadow-lg backdrop-blur-sm">
                                                        <div className="flex items-start space-x-4">
                                                            <motion.div
                                                                className="rounded-2xl bg-emerald-500/20 p-3"
                                                                initial={{
                                                                    scale: 0,
                                                                    rotate: -180,
                                                                }}
                                                                animate={{
                                                                    scale: 1,
                                                                    rotate: 0,
                                                                }}
                                                                transition={{
                                                                    delay: 0.2,
                                                                    duration: 0.5,
                                                                    type: "spring",
                                                                }}
                                                            >
                                                                <CheckCircle className="h-6 w-6 text-emerald-400" />
                                                            </motion.div>
                                                            <motion.div
                                                                className="flex-1 space-y-3"
                                                                initial={{
                                                                    opacity: 0,
                                                                    x: -20,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    x: 0,
                                                                }}
                                                                transition={{
                                                                    delay: 0.3,
                                                                    duration: 0.4,
                                                                }}
                                                            >
                                                                <h4 className="text-lg font-semibold text-emerald-400">
                                                                    File
                                                                    uploaded
                                                                    successfully
                                                                </h4>
                                                                <p className="text-base font-medium text-emerald-300">
                                                                    {
                                                                        fileData.fileName
                                                                    }{" "}
                                                                    •{" "}
                                                                    {Math.round(
                                                                        fileData.fileSize /
                                                                            1024
                                                                    )}{" "}
                                                                    KB
                                                                </p>
                                                                <div className="flex items-center space-x-6 text-sm text-emerald-200">
                                                                    <span className="flex items-center gap-1">
                                                                        <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                                                                        {
                                                                            fileData.rowCount
                                                                        }{" "}
                                                                        rows
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                                                                        {
                                                                            headersArray.length
                                                                        }{" "}
                                                                        columns
                                                                    </span>
                                                                </div>
                                                                {fileData.headers &&
                                                                    headersArray.length >
                                                                        0 && (
                                                                        <motion.div
                                                                            className="mt-4"
                                                                            initial={{
                                                                                opacity: 0,
                                                                                y: 10,
                                                                            }}
                                                                            animate={{
                                                                                opacity: 1,
                                                                                y: 0,
                                                                            }}
                                                                            transition={{
                                                                                delay: 0.5,
                                                                                duration: 0.3,
                                                                            }}
                                                                        >
                                                                            <p className="mb-3 text-sm font-medium text-emerald-300">
                                                                                Columns
                                                                                detected:
                                                                            </p>
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {headersArray
                                                                                    .slice(
                                                                                        0,
                                                                                        6
                                                                                    )
                                                                                    .map(
                                                                                        (
                                                                                            header: string,
                                                                                            index: number
                                                                                        ) => (
                                                                                            <motion.div
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                initial={{
                                                                                                    opacity: 0,
                                                                                                    scale: 0.8,
                                                                                                }}
                                                                                                animate={{
                                                                                                    opacity: 1,
                                                                                                    scale: 1,
                                                                                                }}
                                                                                                transition={{
                                                                                                    delay:
                                                                                                        0.6 +
                                                                                                        index *
                                                                                                            0.1,
                                                                                                    duration: 0.3,
                                                                                                }}
                                                                                            >
                                                                                                <Badge className="rounded-sm border-emerald-500/30 bg-emerald-500/20 text-emerald-200 transition-colors duration-200 hover:bg-emerald-500/30">
                                                                                                    {
                                                                                                        header
                                                                                                    }
                                                                                                </Badge>
                                                                                            </motion.div>
                                                                                        )
                                                                                    )}
                                                                                {headersArray.length >
                                                                                    6 && (
                                                                                    <motion.span
                                                                                        className="px-2 py-1 text-sm font-medium text-emerald-300"
                                                                                        initial={{
                                                                                            opacity: 0,
                                                                                        }}
                                                                                        animate={{
                                                                                            opacity: 1,
                                                                                        }}
                                                                                        transition={{
                                                                                            delay: 1.2,
                                                                                        }}
                                                                                    >
                                                                                        +
                                                                                        {headersArray.length -
                                                                                            6}{" "}
                                                                                        more
                                                                                    </motion.span>
                                                                                )}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                            </motion.div>
                                                        </div>
                                                        <motion.div
                                                            whileHover={{
                                                                scale: 1.1,
                                                            }}
                                                            whileTap={{
                                                                scale: 0.9,
                                                            }}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={
                                                                    removeUploadedFile
                                                                }
                                                                className="rounded-xl text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </motion.div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
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
    const notionDatabaseId = useChartFormStore((s) => s.notionDatabaseId);
    const databaseName = useChartFormStore((s) => s.databaseName);
    const fileData = useChartFormStore((s) => s.fileData);
    const reset = useChartFormStore((s) => s.reset);
    const pathname = usePathname();

    const { collection_slug } = useParams<{
        collection_slug: string;
    }>();
    const router = useRouter();

    const { id: collectionId } = parseSlug(collection_slug);

    const { mutate: createNotionChart, isPending } = useNotionChart({
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
        const isNotionData =
            dataSource === DATABASE_NOTION && notionDatabaseId && databaseName;
        const isFileData =
            dataSource === DATABASE_UPLOAD &&
            fileData &&
            fileData.data &&
            fileData.data.length > 0;

        if (isNotionData && chartType && dataSource && chartName && chartDesc) {
            createNotionChart({
                json: {
                    collectionId: collectionId,
                    databaseId: notionDatabaseId,
                    databaseName: isNotionData
                        ? databaseName
                        : fileData?.fileName,
                    databaseProvider: dataSource,
                    description: chartDesc,
                    name: chartName,
                    type: chartType,
                },
            });
        } else if (
            isFileData &&
            chartType &&
            dataSource &&
            chartName &&
            chartDesc
        ) {
            router.push(pathname + "/map-columns");
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

    const isNotionDataValid =
        dataSource === DATABASE_NOTION && notionDatabaseId && databaseName;
    const isFileDataValid =
        dataSource === DATABASE_UPLOAD &&
        fileData &&
        fileData.data &&
        fileData.data.length > 0;

    const isDisabled =
        !chartType ||
        !dataSource ||
        !chartName ||
        !chartDesc ||
        (!isNotionDataValid && !isFileDataValid);

    return (
        <div className="flex justify-end gap-3 border-t pt-4">
            <Button
                disabled={isDisabled}
                className="relative w-32 cursor-pointer overflow-hidden"
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
                                    className="flex shrink-0 items-center justify-center"
                                    style={{ width: "24px" }}
                                >
                                    <IconComponent size={24} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Text with smooth transitions */}
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={dataSource + String(isPending)} // ensures re-animation on text change
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                            }}
                        >
                            {dataSource === DATABASE_UPLOAD
                                ? "Map Columns"
                                : isPending
                                  ? "Creating..."
                                  : "Create Chart"}
                        </motion.span>
                    </AnimatePresence>
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
