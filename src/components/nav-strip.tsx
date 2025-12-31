"use client";
import React from "react";
import { ArrowLeft, Link } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

export const NavStrip = ({
    className,
    collection_slug,
    chartId,
    SaveButton,
}: {
    className?: string;
    collection_slug: string;
    chartId: string;
    SaveButton: React.ElementType;
}) => {
    const router = useRouter();

    return (
        <div className={cn("flex justify-between", className)}>
            <div>
                <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => {
                        router.push(`/collections/${collection_slug}`);
                    }}
                >
                    <ArrowLeft />
                </Button>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className="cursor-pointer">
                    <Link />
                </Button>
                <SaveButton chartId={chartId} />
            </div>
        </div>
    );
};
