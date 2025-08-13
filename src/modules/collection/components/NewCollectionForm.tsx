"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { useTransition, useRef, useCallback } from "react";
import { BookOpen, Sparkles, Loader2 } from "lucide-react";
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
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
        <div className="mx-auto max-w-3xl px-4 py-12">
            <div className="mb-8 text-center">
                <div className="bg-primary/10 mb-4 inline-flex rounded-full p-2">
                    <BookOpen className="text-primary h-6 w-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Create New Collection
                </h1>
                <p className="text-muted-foreground mt-2">
                    Organize your charts into collections for better management
                    and visualization
                </p>
            </div>

            <Card className="bg-card/50 overflow-hidden border-0 backdrop-blur-sm">
                <CardHeader className="from-primary/10 to-primary/5 bg-gradient-to-r py-8">
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-primary h-5 w-5" />
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
                                                className="border-muted bg-background/50 focus-visible:ring-primary rounded-xl py-6 text-base shadow-sm backdrop-blur-sm"
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
                                                className="border-muted bg-background/50 focus-visible:ring-primary min-h-32 rounded-xl text-base shadow-sm backdrop-blur-sm"
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
                                    className="w-full cursor-pointer rounded-xl py-6 text-base font-medium"
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
                <CardFooter className="bg-muted/20 text-muted-foreground px-6 py-4 text-center text-sm">
                    You can edit these details later from the collection
                    settings
                </CardFooter>
            </Card>
        </div>
    );
}
