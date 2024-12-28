"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { chartSchema, chartTypes } from "@/features/charts/schema";

import { useGetAllDatabases } from "../api/useGetAllDatabases";

import NewChartFormLoader from "./NewChartFormLoader";

export function NewChartForm() {
    const form = useForm<z.infer<typeof chartSchema>>({
        resolver: zodResolver(chartSchema),
    });

    const { data: databases, isLoading } = useGetAllDatabases();

    function onSubmit(data: z.infer<typeof chartSchema>) {
        data.databaseTitle = databases?.find(
            ({ id }) => id === data.databaseID
        )?.title;
        console.log(data);
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
                                    {chartTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Chart types determine how data is visually
                                represented in your project. You can customize
                                this further in your chart settings.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="databaseID"
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
