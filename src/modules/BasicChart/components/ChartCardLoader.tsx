import { BarChart2 } from "lucide-react";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ChartCardLoader() {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                <div className="flex h-[180px] items-center justify-center bg-muted/30">
                    <BarChart2 className="h-16 w-16 animate-pulse text-muted-foreground/30" />
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
            <CardFooter className="border-t bg-muted/30 px-5 py-3">
                <div className="flex w-full items-center justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-7 w-16" />
                </div>
            </CardFooter>
        </Card>
    );
}
