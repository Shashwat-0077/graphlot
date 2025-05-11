"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Layers,
    ArrowLeft,
    LayoutGrid,
    LayoutDashboard,
    Loader2,
} from "lucide-react";

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
import { Input } from "@/components/ui/input";
import type { ChartType } from "@/constants";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

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

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    layout_type: z.enum(["grid", "dashboard"]),
    chart_ids: z.array(z.string()).min(1, "Select at least one chart"),
});

export function NewChartGroupForm({
    collection_slug,
    collection_id,
    charts,
    collection,
}: {
    collection_slug: string;
    collection_id: string;
    charts: Chart[];
    collection: Collection;
}) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            layout_type: "grid",
            chart_ids: [],
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);

        try {
            // This would be replaced with your actual API call
            console.log("Creating chart group with values:", {
                ...values,
                collection_id,
            });

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast({
                title: "Success",
                description: "Chart group created successfully",
            });

            router.push(`/dashboard/collections/${collection_slug}/groups`);
        } catch (error) {
            console.error("Error creating chart group:", error);
            toast({
                title: "Error",
                description: "Failed to create chart group",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
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
                    <span className="text-sm font-medium">New Group</span>
                </div>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                            <Layers className="h-6 w-6 text-primary" />
                            Create Chart Group
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Organize multiple charts into a single view
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link
                            href={`/dashboard/collections/${collection_slug}`}
                        >
                            <ArrowLeft className="mr-1.5 h-4 w-4" />
                            Back to Collection
                        </Link>
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden border-0 bg-card/50 shadow-xl backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-8">
                    <CardTitle className="flex items-center gap-2">
                        <Layers className="h-5 w-5 text-primary" />
                        <span>Group Configuration</span>
                    </CardTitle>
                    <CardDescription>
                        Configure your chart group settings and select charts to
                        include
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
                                                Group Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Financial Overview"
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
                                    name="layout_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">
                                                Layout Type
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl border-muted bg-background/50 py-6 text-base shadow-sm backdrop-blur-sm focus-visible:ring-primary">
                                                        <SelectValue placeholder="Select layout type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="grid">
                                                        <div className="flex items-center gap-2">
                                                            <LayoutGrid className="h-4 w-4" />
                                                            <span>
                                                                Grid Layout
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="dashboard">
                                                        <div className="flex items-center gap-2">
                                                            <LayoutDashboard className="h-4 w-4" />
                                                            <span>
                                                                Dashboard Layout
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Choose how your charts will be
                                                arranged
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="chart_ids"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel className="text-base">
                                                Select Charts
                                            </FormLabel>
                                            <FormDescription>
                                                Choose the charts to include in
                                                this group
                                            </FormDescription>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {charts.map((chart) => (
                                                <FormField
                                                    key={chart.chart_id}
                                                    control={form.control}
                                                    name="chart_ids"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={
                                                                    chart.chart_id
                                                                }
                                                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(
                                                                            chart.chart_id
                                                                        )}
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) => {
                                                                            return checked
                                                                                ? field.onChange(
                                                                                      [
                                                                                          ...field.value,
                                                                                          chart.chart_id,
                                                                                      ]
                                                                                  )
                                                                                : field.onChange(
                                                                                      field.value?.filter(
                                                                                          (
                                                                                              value
                                                                                          ) =>
                                                                                              value !==
                                                                                              chart.chart_id
                                                                                      )
                                                                                  );
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <div className="space-y-1 leading-none">
                                                                    <FormLabel className="font-medium">
                                                                        {
                                                                            chart.name
                                                                        }
                                                                    </FormLabel>
                                                                    <FormDescription>
                                                                        {
                                                                            chart.type
                                                                        }{" "}
                                                                        •{" "}
                                                                        {
                                                                            chart.notion_database_name
                                                                        }
                                                                    </FormDescription>
                                                                </div>
                                                            </FormItem>
                                                        );
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isSubmitting}
                                    className="w-full rounded-xl py-6 text-base font-medium"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Creating Group...
                                        </>
                                    ) : (
                                        "Create Chart Group"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="bg-muted/20 px-6 py-4 text-center text-sm text-muted-foreground">
                    You can edit the group and rearrange charts after creation
                </CardFooter>
            </Card>
        </div>
    );
}
