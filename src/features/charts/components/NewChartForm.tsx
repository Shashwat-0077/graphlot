"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

import { useGetAllDatabases } from "../../notion/api/useGetAllDatabases";
import { BasicChartSchema, ChartType } from "../schema";
import { useCreateNewChart } from "../api/client/use-create-new-chart";

import NewChartFormLoader from "./NewChartFormLoader";

export function NewChartForm() {
    const { mutate: createNewChart } = useCreateNewChart();

    const form = useForm<z.infer<typeof BasicChartSchema.Insert>>({
        resolver: zodResolver(BasicChartSchema.Insert),
        defaultValues: {
            name: "",
            description: "",
            type: "",
            notion_database_name: "",
            notion_database_url: "",
            collection_id: "",
        },
    });

    const { data: databases, isLoading } = useGetAllDatabases();

    function onSubmit(data: z.infer<typeof BasicChartSchema.Insert>) {
        createNewChart(
            { form: data },
            {
                onError: (error) => {
                    form.setError("root", {
                        type: "value",
                        message: error.message,
                    });
                },
            }
        );
    }

    if (isLoading) {
        // HACK : Right now we are using if statement, see how can we use loader.tsx of nextjs for the loader to show up while loading
        return <NewChartFormLoader />;
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
            >
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select the chart type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {ChartType.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Chart types determine how data is visually
                                represented in your Collections. You can
                                customize this further in your chart settings.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Database</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select the Database" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {databases?.map(({ id, title }) => (
                                        <SelectItem key={id} value={id}>
                                            {title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                The selected database will be used as the source
                                for generating your chart data.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
