"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useTransition, useRef, useCallback } from "react";

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
import { CollectionSchema } from "@/modules/collections/schema";
import { useCreateCollection } from "@/modules/collections/api/client/use-create-collection";

export function NewCollectionForm() {
    // BUG : This component is throwing a error because of the form errors

    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);
    const { mutate: createCollection, isPending: isSubmitting } =
        useCreateCollection();

    const form = useForm<z.infer<typeof CollectionSchema.Insert>>({
        resolver: zodResolver(CollectionSchema.Insert),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const handleError = useCallback(
        (error: { field: string; message: string }) => {
            startTransition(() => {
                form.setError(
                    error.field as keyof z.infer<
                        typeof CollectionSchema.Insert
                    >,
                    {
                        type: "server",
                        message: error.message,
                    }
                );
            });
        },
        [form]
    );

    const handleSuccess = useCallback(
        ({
            newCollection,
        }: {
            newCollection: { id: string; name: string };
        }) => {
            startTransition(() => {
                router.push(
                    `/dashboard/collections/${encodeForUrl({
                        path: newCollection.id,
                        name: newCollection.name,
                    })}`
                );
            });
        },
        [router]
    );

    const onSubmit = useCallback(
        (data: z.infer<typeof CollectionSchema.Insert>) => {
            createCollection(
                { form: data },
                {
                    onError: handleError,
                    onSuccess: handleSuccess,
                }
            );
        },
        [createCollection, handleError, handleSuccess]
    );

    const isDisabled = isPending || isSubmitting;

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
            >
                <FormField
                    disabled={isDisabled}
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
                    disabled={isDisabled}
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

                <Button type="submit" disabled={isDisabled}>
                    {isSubmitting ? "Creating..." : "Create"}
                </Button>
            </form>
        </Form>
    );
}
