import React, { useState } from "react";
import { Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { useChartFormStore } from "@/modules/chart-attributes/pages/new-chart/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ToggleSwitch from "@/components/ui/toggle-switch";
import { COLUMN_SELECT_TYPES, ColumnMapSelectOptions } from "@/constants";
import { cn } from "@/utils";
import { NumberConfiguration } from "@/modules/chart-attributes/components/configure/number";
import { DateConfiguration } from "@/modules/chart-attributes/components/configure/date";
import { SelectConfiguration } from "@/modules/chart-attributes/components/configure/select";
import { MultiSelectConfiguration } from "@/modules/chart-attributes/components/configure/multi-select";

export const ColumnConfigureCard = ({ header }: { header: string }) => {
    const ANIMATION_DURATION = 0.5;
    const [configureOpen, setConfigureOpen] = useState(false);

    const updateHeaderType = useChartFormStore(
        (state) => state.updateHeaderType
    );
    const getHeaderMapping = useChartFormStore(
        (state) => state.getHeaderMapping
    );
    const toggleSkipColumn = useChartFormStore(
        (state) => state.toggleSkipColumn
    );
    const getSampleData = useChartFormStore((state) => state.getSampleData);
    const headerConfig = getHeaderMapping(header);
    const sampleData = getSampleData(header);

    return (
        <div
            className={cn(
                "relative min-h-62.5 overflow-hidden rounded-xl",
                "shadow-[inset_0_0_0_1px_var(--border)]"
            )}
        >
            <AnimatePresence mode="popLayout">
                {configureOpen ? (
                    <motion.div
                        key="configure"
                        layout
                        initial={{ x: "100%", opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0.5 }}
                        transition={{
                            duration: ANIMATION_DURATION,
                            ease: "easeInOut",
                            layout: { duration: ANIMATION_DURATION },
                        }}
                        className="absolute inset-0 h-full w-full p-4"
                    >
                        <div className="h-full overflow-hidden">
                            <div className="flex h-full flex-col justify-between">
                                {headerConfig?.type === "Number" ? (
                                    <NumberConfiguration />
                                ) : headerConfig?.type === "Date" ? (
                                    <DateConfiguration />
                                ) : headerConfig?.type === "Select" ? (
                                    <SelectConfiguration />
                                ) : headerConfig?.type === "Multi-select" ? (
                                    <MultiSelectConfiguration />
                                ) : null}
                                {/* Add a back button or close button */}
                                <div className="p-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setConfigureOpen(false)}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="main"
                        layout
                        initial={{ x: "-100%", opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0.5 }}
                        transition={{
                            duration: ANIMATION_DURATION,
                            ease: "easeInOut",
                            layout: { duration: ANIMATION_DURATION },
                        }}
                        className="absolute inset-0 h-full w-full p-4"
                    >
                        <div className="flex h-full flex-col justify-between">
                            <div className="flex flex-col gap-1">
                                <div className="flex w-full items-center justify-between">
                                    <div
                                        className={cn(
                                            "flex items-center gap-2",
                                            headerConfig?.skipColumn &&
                                                "opacity-50"
                                        )}
                                    >
                                        <h3 className="text-xl font-medium">
                                            {headerConfig?.displayName}
                                        </h3>
                                        <Badge variant={"outline"}>
                                            {headerConfig?.type}
                                        </Badge>
                                    </div>
                                    <Button
                                        variant={"ghost"}
                                        size={"sm"}
                                        className="cursor-pointer"
                                        disabled={
                                            headerConfig?.skipColumn ||
                                            headerConfig?.type === "None"
                                        }
                                        onClick={() => setConfigureOpen(true)}
                                    >
                                        <Settings /> Configure
                                    </Button>
                                </div>
                                <div
                                    className={cn(
                                        "text-muted-foreground mt-2 line-clamp-1 flex items-center gap-2 text-xs",
                                        headerConfig?.skipColumn && "opacity-50"
                                    )}
                                >
                                    <p className="shrink-0">Sample Values : </p>
                                    <div className="flex flex-wrap gap-1">
                                        {sampleData.map((value, index) => (
                                            <Badge
                                                key={index}
                                                variant={"secondary"}
                                            >
                                                {value.length > 10
                                                    ? value.slice(0, 10) + "…"
                                                    : value}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex w-full items-center justify-between">
                                    <Select
                                        defaultValue={headerConfig?.type}
                                        onValueChange={(
                                            value: ColumnMapSelectOptions
                                        ) => {
                                            updateHeaderType(header, value);
                                        }}
                                        disabled={headerConfig?.skipColumn}
                                    >
                                        <SelectTrigger className="w-45">
                                            <SelectValue placeholder="Select a Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(
                                                COLUMN_SELECT_TYPES
                                            ).map((type) => (
                                                <SelectItem
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <div className="item-center flex gap-2">
                                        <Label className="shrink-0">
                                            Skip :{" "}
                                        </Label>
                                        <ToggleSwitch
                                            checked={
                                                headerConfig?.skipColumn ??
                                                false
                                            }
                                            onCheckedChange={() => {
                                                toggleSkipColumn(header);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
