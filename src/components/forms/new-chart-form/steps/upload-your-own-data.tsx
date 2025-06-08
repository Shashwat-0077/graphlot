"use client";

import { AlertCircle, Upload } from "lucide-react";
import { motion } from "framer-motion";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

export function UploadYourOwnData() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="mb-3 text-3xl font-bold tracking-tight">
                    Upload Your Own Data
                </h2>
                <p className="text-lg text-muted-foreground">
                    This feature is coming soon
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Alert className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Coming Soon</AlertTitle>
                    <AlertDescription>
                        This feature is currently under development. Please
                        check back later or use Notion as your data source.
                    </AlertDescription>
                </Alert>
            </motion.div>

            <motion.div
                className="flex justify-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <Card className="overflow-hidden border-muted/40 shadow-sm">
                    <CardContent className="p-8">
                        <div className="flex flex-col items-center justify-center gap-4 text-center">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                                <Upload className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">
                                    File Upload
                                </h3>
                                <p className="mt-2 text-muted-foreground">
                                    CSV, Excel, and Google Sheets integration
                                    coming soon
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
