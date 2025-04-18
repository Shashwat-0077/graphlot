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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useGetAllDatabases } from "@/modules/notion/api/client/useGetAllDatabases";
import { ChartSchema } from "@/modules/BasicChart/schema";
import { useCreateNewChart } from "@/modules/BasicChart/api/client/useCreateNewChart";
import { AREA, CHART_TYPES } from "@/constants";
import NewChartFormLoader from "@/modules/BasicChart/components/NewChartFormLoader";

const FormType = ChartSchema.Insert.pick({
    name: true,
    description: true,
    type: true,
    notion_database_id: true,
});

export function NewChartForm({ collection_Id }: { collection_Id: string }) {
    const { mutate: createNewChart } = useCreateNewChart();

    const form = useForm<Zod.infer<typeof FormType>>({
        resolver: zodResolver(FormType),
        defaultValues: {
            name: "",
            description: "",
            type: AREA,
            notion_database_id: "",
        },
    });

    const { data: databases, isLoading } = useGetAllDatabases();

    function onSubmit(data: z.infer<typeof FormType>) {
        createNewChart(
            { form: { ...data, collection_id: collection_Id } },
            {
                onError: (error) => {
                    form.setError(error.field, {
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Chart Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Your chart name"
                                    className="border-0 bg-input py-5"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    // disabled={isPending}
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Collection Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us a little bit about your collection"
                                    className="h-40 resize-none bg-input"
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
                            <FormLabel>Chart Type</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="bg-input">
                                        <SelectValue placeholder="Select the chart type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {CHART_TYPES.map((type) => (
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
                    name="notion_database_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Database</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="bg-input">
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
