"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { useTransition, useRef, useCallback } from "react";
import { BookOpen, Sparkles, Loader2 } from "lucide-react";

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
import { useCreateCollection } from "@/modules/Collection/api/client/use-create-collection";
import { CollectionSchema } from "@/modules/Collection/schema";
import { getSlug } from "@/utils/pathSlugsOps";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function NewCollectionForm() {
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
                    `/dashboard/collections/${getSlug({
                        id: newCollection.id,
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
        <div className="mx-auto max-w-3xl px-4 py-12">
            <div className="mb-8 text-center">
                <div className="mb-4 inline-flex rounded-full bg-primary/10 p-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Create New Collection
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Organize your charts into collections for better management
                    and visualization
                </p>
            </div>

            <Card className="overflow-hidden border-0 bg-card/50 shadow-xl backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-8">
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span>Collection Details</span>
                    </CardTitle>
                    <CardDescription>
                        Fill in the information below to create your new
                        collection
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pt-8">
                    <Form {...form}>
                        <form
                            ref={formRef}
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                disabled={isDisabled}
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            Collection Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Financial Analytics 2025"
                                                className="rounded-xl border-muted bg-background/50 py-6 text-base shadow-sm backdrop-blur-sm focus-visible:ring-primary"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Choose a descriptive name that
                                            reflects the purpose of your
                                            collection
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
                                        <FormLabel className="text-base">
                                            Collection Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe what this collection will contain and its purpose..."
                                                className="min-h-32 rounded-xl border-muted bg-background/50 text-base shadow-sm backdrop-blur-sm focus-visible:ring-primary"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Add details about the types of
                                            charts and data this collection will
                                            contain
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={isDisabled}
                                    size="lg"
                                    className="w-full rounded-xl py-6 text-base font-medium"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Creating Collection...
                                        </>
                                    ) : (
                                        "Create Collection"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="bg-muted/20 px-6 py-4 text-center text-sm text-muted-foreground">
                    You can edit these details later from the collection
                    settings
                </CardFooter>
            </Card>
        </div>
    );
}
