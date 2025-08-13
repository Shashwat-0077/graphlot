"use client";

import { z } from "zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCreateChart } from "@/modules/chart-attributes/api/client";
import { getSlug } from "@/utils";
import { useChartFormStore } from "@/modules/chart-attributes/components/new-chart/store";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNotionDatabases } from "@/modules/notion/api/client";

const notionConfigSchema = z.object({
    chartName: z.string().min(1, "Chart name is required"),
    chartDescription: z.string().optional(),
    databaseId: z.string().min(1, "Please select a database"),
});

type NotionConfigValues = z.infer<typeof notionConfigSchema>;

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

export function NotionConfigStep({
    collectionId,
    collectionName,
}: {
    collectionId: string;
    collectionName: string;
}) {
    const router = useRouter();

    const {
        mutate: createNewChart,
        isPending: isSubmitting,
        isSuccess: isSuccessCreateChart,
    } = useCreateChart({
        onSuccess: (chart) => {
            toast("Chart Created", {
                description: "Your chart has been created successfully.",
            });
            router.push(
                `/collections/${getSlug({ id: collectionId, name: collectionName })}/${getSlug(
                    {
                        id: chart.id,
                        name: chart.name,
                    }
                )}`
            );
        },
        onError: (error) => {
            toast("Error", {
                description:
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred. Please try again.",
            });
        },
    });

    const {
        data: databases,
        isLoading: isLoadingDatabases,
        isError: isErrorDatabases,
        error: errorDatabases,
    } = useNotionDatabases();

    const { notionConfig, setNotionConfig, prevStep, getFormData } =
        useChartFormStore();

    const form = useForm<NotionConfigValues>({
        resolver: zodResolver(notionConfigSchema),
        defaultValues: {
            chartName: notionConfig?.chartName || "",
            chartDescription: notionConfig?.chartDescription || "",
            databaseId: notionConfig?.databaseId || "",
        },
        mode: "onChange",
    });

    // Watch individual form values instead of the entire object
    const chartName = form.watch("chartName");
    const chartDescription = form.watch("chartDescription");
    const databaseId = form.watch("databaseId");

    // Update store whenever form values change
    useEffect(() => {
        const selectedDatabase = databases?.find((db) => db.id === databaseId);

        setNotionConfig({
            chartName: chartName || "",
            chartDescription: chartDescription || "",
            databaseId: databaseId || "",
            databaseTitle: selectedDatabase?.title || "",
        });
    }, [chartName, chartDescription, databaseId, databases, setNotionConfig]);

    // Trigger form validation when databases load and we have form values
    useEffect(() => {
        if (databases && (chartName || chartDescription || databaseId)) {
            form.trigger();
        }
    }, [databases, form, chartName, chartDescription, databaseId]);

    const handleDatabaseChange = (selectedDatabaseId: string) => {
        // Find the selected database to get both id and title
        const selectedDatabase = databases?.find(
            (db) => db.id === selectedDatabaseId
        );

        // Update the form field and trigger validation
        form.setValue("databaseId", selectedDatabaseId, {
            shouldValidate: true,
            shouldDirty: true,
        });

        // Update the store with both id and title
        setNotionConfig({
            chartName: chartName || "",
            chartDescription: chartDescription || "",
            databaseId: selectedDatabaseId,
            databaseTitle: selectedDatabase?.title || "",
        });
    };

    const handleSubmit = async () => {
        try {
            const formData = getFormData();
            if (!formData) {
                throw new Error("Form data is not valid");
            }

            if (formData.type === null) {
                throw new Error("Chart type is not selected");
            }

            if (formData.databaseSource !== "notion") {
                throw new Error("Invalid data source");
            }

            if (formData.notionConfig === null) {
                throw new Error("Notion configuration is not set");
            }

            createNewChart({
                json: {
                    name: formData.notionConfig.chartName,
                    description: formData.notionConfig.chartDescription,
                    databaseId: formData.notionConfig.databaseId,
                    databaseProvider: formData.databaseSource,
                    type: formData.type,
                    collectionId: collectionId,
                    databaseName: formData.notionConfig.databaseTitle, // Use database title
                },
            });
        } catch (error) {
            toast("Error", {
                description:
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred. Please try again.",
            });
        }
    };

    const isFormValid =
        form.formState.isValid && chartName?.trim() && databaseId;

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="mb-3 text-3xl font-bold tracking-tight">
                    Notion Configuration
                </h2>
                <p className="text-muted-foreground text-lg">
                    Configure your chart settings
                </p>
            </div>

            <Card className="border-muted/40 overflow-hidden shadow-sm">
                <CardContent className="p-6 sm:p-8">
                    <Form {...form}>
                        <motion.div
                            className="space-y-6"
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            <motion.div variants={item}>
                                <FormField
                                    control={form.control}
                                    name="chartName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-medium">
                                                Chart Name{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Monthly Sales Performance"
                                                    className="text-base"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Give your chart a descriptive
                                                name that explains what it shows
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div variants={item}>
                                <FormField
                                    control={form.control}
                                    name="chartDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-medium">
                                                Chart Description
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="This chart visualizes our monthly sales performance across different regions..."
                                                    className="resize-none text-base"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Optional: Provide additional
                                                context about what this chart
                                                represents
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            {isLoadingDatabases || !databases ? (
                                <>
                                    <Skeleton className="h-5 w-28" />
                                    <Skeleton className="h-10 w-full" />
                                </>
                            ) : isErrorDatabases ? (
                                <motion.div
                                    className="text-red-500"
                                    variants={item}
                                >
                                    {errorDatabases instanceof Error
                                        ? errorDatabases.message
                                        : "An unexpected error occurred. Please try again."}
                                </motion.div>
                            ) : databases.length === 0 ? (
                                <motion.div
                                    className="text-red-500"
                                    variants={item}
                                >
                                    No databases found in your Notion workspace.
                                    Please create a database in Notion and try
                                    again.
                                </motion.div>
                            ) : (
                                <motion.div variants={item}>
                                    <FormField
                                        control={form.control}
                                        name="databaseId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-medium">
                                                    Notion Database{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        handleDatabaseChange
                                                    } // Use custom handler
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="text-base">
                                                            <SelectValue placeholder="Select a database from your Notion workspace" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {databases.map((db) => (
                                                            <SelectItem
                                                                key={db.id}
                                                                value={db.id}
                                                            >
                                                                {db.title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Choose the Notion database
                                                    that contains the data for
                                                    your chart
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    </Form>
                </CardContent>
            </Card>

            <motion.div
                className="mt-10 flex justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="px-6"
                >
                    Previous
                </Button>

                <Button
                    onClick={handleSubmit}
                    disabled={
                        isSubmitting || !isFormValid || isSuccessCreateChart
                    }
                    className="px-6"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Chart...
                        </>
                    ) : (
                        "Create Chart"
                    )}
                </Button>
            </motion.div>
        </div>
    );
}
