import { BarChart2 } from "lucide-react";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function ChartCardLoader() {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                <div className="bg-muted/30 flex h-[180px] items-center justify-center">
                    <BarChart2 className="text-muted-foreground/30 h-16 w-16 animate-pulse" />
                </div>
            </CardHeader>
            <CardContent className="p-5">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Separator orientation="vertical" className="h-4" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t px-5 py-3">
                <div className="flex w-full items-center justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-7 w-16" />
                </div>
            </CardFooter>
        </Card>
    );
}
