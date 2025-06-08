"use client";

import type React from "react";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { BarChart2, Database, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getSlug, parseSlug } from "@/utils/pathSlugsOps";
import { toast } from "@/hooks/use-toast";
import { useAuthSession } from "@/hooks/use-auth-session";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChartMetadataSchema } from "@/modules/Chart/schema";
import { useCreateNewChart } from "@/modules/Chart/api/client/use-create-chart";
import { CHART_TYPE_AREA, CHART_TYPES, DATABASE_NOTION } from "@/constants";
import { useNotionDatabases } from "@/modules/notion/api/client/use-notion-databases";

const FormType = ChartMetadataSchema.Insert.pick({
    name: true,
    description: true,
    type: true,
    databaseId: true,
});

const chartTypeIcons: Record<string, React.ReactNode> = {
    CHART_TYPE_AREA: <BarChart2 className="h-4 w-4" />,
    CHART_TYPE_BAR: <BarChart2 className="h-4 w-4" />,
};

export function NewChartForm({ collection_slug }: { collection_slug: string }) {
    const { mutate: createNewChart } = useCreateNewChart();
    const { id: collection_Id } = parseSlug(collection_slug);
    const router = useRouter();

    const form = useForm<z.infer<typeof FormType>>({
        resolver: zodResolver(FormType),
        defaultValues: {
            name: "",
            description: "",
            type: CHART_TYPE_AREA,
            databaseId: "",
        },
    });

    const {
        session,
        isLoading: isAuthLoading,
        isAuthenticated,
    } = useAuthSession();
    const userId = session ? session.user?.id : undefined;

    const {
        data: databases,
        isLoading: isDatabasesLoading,
        error,
    } = useNotionDatabases(userId);

    function onSubmit(data: z.infer<typeof FormType>) {
        createNewChart(
            {
                json: {
                    ...data,
                    collectionId: collection_Id,
                    databaseProvider: DATABASE_NOTION,
                },
            },
            {
                onError: (error) => {
                    toast({
                        title: "Error",
                        description: JSON.stringify(error.message),
                        variant: "destructive",
                    });
                },
                onSuccess: (data) => {
                    router.push(
                        `/dashboard/collections/${collection_slug}/${getSlug({
                            id: data.chart.id,
                            name: data.chart.name,
                        })}`
                    );
                },
            }
        );
    }

    if (isAuthLoading) {
        return (
            <div className="flex h-[70vh] w-full items-center justify-center">
                <div className="space-y-4 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">
                        Loading your session...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !isAuthenticated || !session || !session.user) {
        return (
            <div className="flex h-[70vh] w-full items-center justify-center">
                <Card className="w-full max-w-md border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive">
                            Authentication Error
                        </CardTitle>
                        <CardDescription>
                            There was a problem authenticating your session.
                            Please try logging in again.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button
                            variant="outline"
                            onClick={() => router.push("/")}
                        >
                            Return to Home
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-12">
            <div className="mb-8 text-center">
                <div className="mb-4 inline-flex rounded-full bg-primary/10 p-2">
                    <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Create New Chart
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Design a custom chart to visualize your Notion database data
                </p>
            </div>

            <Card className="overflow-hidden border-0 bg-card/50 shadow-xl backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-8">
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span>Chart Configuration</span>
                    </CardTitle>
                    <CardDescription>
                        Configure your chart settings and connect to your Notion
                        database
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pt-8">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <div className="grid gap-8 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">
                                                Chart Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Monthly Revenue"
                                                    className="rounded-xl border-muted bg-background/50 py-6 text-base shadow-sm backdrop-blur-sm focus-visible:ring-primary"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">
                                                Chart Type
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl border-muted bg-background/50 py-6 text-base shadow-sm backdrop-blur-sm focus-visible:ring-primary">
                                                        <SelectValue placeholder="Select chart type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {CHART_TYPES.map((type) => (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {chartTypeIcons[
                                                                    type
                                                                ] || (
                                                                    <BarChart2 className="h-4 w-4" />
                                                                )}
                                                                <span>
                                                                    {type}
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Choose how your data will be
                                                visualized
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            Chart Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe what this chart will show and its purpose..."
                                                className="min-h-24 rounded-xl border-muted bg-background/50 text-base shadow-sm backdrop-blur-sm focus-visible:ring-primary"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="rounded-xl border border-muted bg-muted/20 p-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <Database className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-medium">
                                        Data Source
                                    </h3>
                                </div>

                                {isDatabasesLoading ? (
                                    <div className="space-y-4 py-2">
                                        <Skeleton className="h-4 w-1/3 rounded-md bg-muted" />
                                        <Skeleton className="h-12 w-full rounded-md bg-muted" />
                                        <Skeleton className="h-4 w-2/3 rounded-md bg-muted" />
                                    </div>
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name="databaseId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">
                                                    Notion Database
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-xl border-muted bg-background/50 py-6 text-base shadow-sm backdrop-blur-sm focus-visible:ring-primary">
                                                            <SelectValue placeholder="Select a database" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {databases?.map(
                                                            ({ id, title }) => (
                                                                <SelectItem
                                                                    key={id}
                                                                    value={id}
                                                                >
                                                                    {title}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Connect to a Notion database
                                                    to visualize its data
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full rounded-xl py-6 text-base font-medium"
                                >
                                    {form.formState.isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Creating Chart...
                                        </>
                                    ) : (
                                        "Create Chart"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="bg-muted/20 px-6 py-4 text-center text-sm text-muted-foreground">
                    You can customize the chart visualization after creation
                </CardFooter>
            </Card>
        </div>
    );
}
