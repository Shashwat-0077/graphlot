"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { useTransition, useRef, useCallback } from "react";
import { Sparkles, Loader2, FolderPlus, Info } from "lucide-react";
import { toast } from "sonner";

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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CollectionSchema } from "@/modules/collection/schema/types";
import { getSlug } from "@/utils";
import { useCreateCollection } from "@/modules/collection/api/client";

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

    const onSubmit = useCallback(
        (data: z.infer<typeof CollectionSchema.Insert>) => {
            createCollection(
                { json: data },
                {
                    onError: (error) => {
                        startTransition(() => {
                            toast("Error creating collection", {
                                description: error.message,
                            });
                        });
                    },
                    onSuccess: (collection) => {
                        startTransition(() => {
                            router.push(
                                `/collections/${getSlug({
                                    id: collection.id,
                                    name: collection.name,
                                })}`
                            );
                        });
                    },
                }
            );
        },
        [createCollection, router]
    );

    const isDisabled = isPending || isSubmitting;

    return (
        <div className="mt-10 ml-10 max-w-4xl space-y-8">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                    Create New Collection
                </h1>
                <p className="text-muted-foreground">
                    Organize your charts into collections for better management
                    and visualization
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-base font-semibold">
                        <FolderPlus className="text-primary h-5 w-5" />
                        Collection Information
                    </Label>
                    <p className="text-muted-foreground text-sm">
                        Provide basic details about your collection
                    </p>
                </div>

                <Form {...form}>
                    <form
                        ref={formRef}
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField
                                disabled={isDisabled}
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Collection Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Financial Analytics 2025"
                                                className="h-11"
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
                                    <FormItem className="md:col-span-2">
                                        <FormLabel className="text-sm font-medium">
                                            Collection Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe what this collection will contain and its purpose..."
                                                className="min-h-24 resize-none"
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
                        </div>

                        <div className="bg-muted/30 border-border/50 rounded-lg border p-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 mt-0.5 rounded-full p-1.5">
                                    <Info className="text-primary h-4 w-4" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium">
                                        What happens next?
                                    </h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        After creating your collection,
                                        you&apos;ll be able to add charts,
                                        organize your data visualizations, and
                                        share your insights with others. You can
                                        edit these details later from the
                                        collection settings.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isDisabled}
                                onClick={() => router.back()}
                                className="px-6"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isDisabled || !form.formState.isValid}
                                className="px-6"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Create Collection
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
