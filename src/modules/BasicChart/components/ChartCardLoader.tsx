import { ChartSpline } from "lucide-react";
import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChartCardLoader() {
    return (
        <Card>
            <CardHeader className="grid animate-pulse place-content-center p-0 text-gray-500">
                <ChartSpline className="min-h-[270px]" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2 pt-10">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-52" />
            </CardContent>
        </Card>
    );
}
