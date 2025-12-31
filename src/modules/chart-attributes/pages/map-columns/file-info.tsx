"use client";
import { FileText, Database, Hash } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useChartFormStore } from "@/modules/chart-attributes/pages/new-chart/store";

export function FileInfo() {
    const router = useRouter();
    const data = useChartFormStore((s) => s.fileData);
    const headersArray = Object.keys(data.headers);
    useEffect(() => {
        if (
            data.fileName === "" ||
            data.fileSize === 0 ||
            headersArray.length === 0 ||
            data.rowCount === 0
        ) {
            router.back();
        }
    }, [data, router, headersArray]);

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
            " " +
            sizes[i]
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    File Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="flex items-center gap-2">
                        <FileText className="text-muted-foreground h-4 w-4" />
                        <div>
                            <p className="text-sm font-medium">
                                {data.fileName}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                {formatFileSize(data.fileSize)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Database className="text-muted-foreground h-4 w-4" />
                        <div>
                            <p className="text-sm font-medium">
                                {data.rowCount.toLocaleString()} rows
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Total records
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Hash className="text-muted-foreground h-4 w-4" />
                        <div>
                            <p className="text-sm font-medium">
                                {headersArray.length} columns
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Data fields
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {headersArray.slice(0, 3).map((header) => (
                            <Badge
                                key={header}
                                variant="secondary"
                                className="text-xs"
                            >
                                {header}
                            </Badge>
                        ))}
                        {headersArray.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{headersArray.length - 3} more
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
