"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

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
import { Textarea } from "@/components/ui/textarea";
import { encodeForUrl } from "@/utils/pathSerialization";

import { CollectionSchema } from "../schema";
import { useCreateCollection } from "../api/client/use-create-collection";

export function NewCollectionForm() {
    const router = useRouter();
    const { mutate, isPending } = useCreateCollection();

    const form = useForm<z.infer<typeof CollectionSchema.Insert>>({
        resolver: zodResolver(CollectionSchema.Insert),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    function onSubmit(data: z.infer<typeof CollectionSchema.Insert>) {
        mutate(
            { form: data },
            {
                onError: (error) => {
                    form.setError("name", {
                        type: "value",
                        message: error.message,
                    });
                },
                onSuccess: ({ name, id }) => {
                    router.push(
                        `/dashboard/collections/${encodeForUrl({ path: id, name: name })}`
                    );
                },
            }
        );
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
            >
                <FormField
                    disabled={isPending}
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Collection Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Your collection name"
                                    className="max-w-xl border-0 bg-input py-5"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This will be your collection name, This can be
                                changed later.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    disabled={isPending}
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
                            <FormDescription>
                                This will be your collection description, This
                                can be changed later.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Create</Button>
            </form>
        </Form>
    );
}
