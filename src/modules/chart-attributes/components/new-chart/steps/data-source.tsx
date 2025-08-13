"use client";
import { Clock, Database, Upload } from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { DATABASE_NOTION, DATABASE_UPLOAD } from "@/constants";
import { cn } from "@/utils";
import { useChartFormStore } from "@/modules/chart-attributes/components/new-chart/store";

const dataSourceConfig = {
    [DATABASE_NOTION]: {
        icon: <Database className="h-12 w-12" />,
        title: "Notion Database",
        description:
            "Connect to your Notion workspace and visualize data from your databases",
        available: true,
    },
    [DATABASE_UPLOAD]: {
        icon: <Upload className="h-12 w-12" />,
        title: "Upload Your Own",
        description:
            "Upload CSV files or connect to Google Sheets for data visualization",
        available: false,
    },
};

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export function DataSourceStep() {
    const { databaseSource: dataSource, setDatabaseSource: setDataSource } =
        useChartFormStore();

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="mb-3 text-3xl font-bold tracking-tight">
                    Choose Data Source
                </h2>
                <p className="text-muted-foreground text-lg">
                    Where should we get your data from?
                </p>
            </div>

            <motion.div
                className="grid grid-cols-1 gap-6 md:grid-cols-2"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {Object.entries(dataSourceConfig).map(([source, config]) => (
                    <motion.div key={source} variants={item}>
                        <Card
                            className={cn(
                                "overflow-hidden transition-all duration-300 hover:shadow-lg",
                                config.available
                                    ? "cursor-pointer hover:scale-[1.02]"
                                    : "cursor-not-allowed",
                                dataSource === source
                                    ? "bg-primary/5 ring-primary ring-2"
                                    : config.available
                                      ? "hover:bg-accent/50"
                                      : "opacity-60"
                            )}
                            onClick={() =>
                                config.available &&
                                setDataSource(
                                    source as keyof typeof dataSourceConfig
                                )
                            }
                        >
                            <CardContent className="p-0">
                                <div className="flex flex-col p-6">
                                    <div
                                        className={cn(
                                            "bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors",
                                            dataSource === source
                                                ? "text-primary"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {config.icon}
                                    </div>
                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <h3 className="text-xl font-semibold">
                                                {config.title}
                                            </h3>
                                            {!config.available && (
                                                <Clock className="h-4 w-4 text-orange-500" />
                                            )}
                                        </div>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {config.description}
                                        </p>
                                        {!config.available && (
                                            <p className="mt-2 text-xs font-medium text-orange-600">
                                                Coming Soon
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
