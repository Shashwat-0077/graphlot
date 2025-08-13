"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DATABASE_NOTION, DATABASE_UPLOAD } from "@/constants";
import { Stepper } from "@/components/ui/stepper";
import { useChartFormStore } from "@/modules/chart-attributes/components/new-chart/store";
import { ChartTypeStep } from "@/modules/chart-attributes/components/new-chart/steps/chart-type";
import { DataSourceStep } from "@/modules/chart-attributes/components/new-chart/steps/data-source";
import { NotionConfigStep } from "@/modules/chart-attributes/components/new-chart/steps/notion-config";
import { UploadDataStep } from "@/modules/chart-attributes/components/new-chart/steps/upload-data";
import { parseSlug } from "@/utils";

export default function NewChartForm() {
    const { collection_slug } = useParams<{
        collection_slug: string;
    }>();

    const { id: collectionId, name: collectionName } = useMemo(() => {
        return parseSlug(collection_slug || "");
    }, [collection_slug]);

    const {
        currentStep,
        chartType,
        databaseSource: dataSource,
        nextStep,
        prevStep,
    } = useChartFormStore();

    const canProceedToNextStep = () => {
        switch (currentStep) {
            case 0:
                return chartType !== null;
            case 1:
                return dataSource !== null;
            default:
                return false;
        }
    };

    const isLastStep = () => {
        if (currentStep === 1 && dataSource === DATABASE_UPLOAD) {
            return true;
        }
        return currentStep === 2;
    };

    const getStepTitle = (step: number) => {
        switch (step) {
            case 0:
                return "Chart Type";
            case 1:
                return "Data Source";
            case 2:
                return "Configuration";
            default:
                return `Step ${step + 1}`;
        }
    };

    const steps = [0, 1, 2].map((step) => getStepTitle(step));

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <ChartTypeStep />;
            case 1:
                return <DataSourceStep />;
            case 2:
                return dataSource === DATABASE_NOTION ? (
                    <NotionConfigStep
                        collectionId={collectionId}
                        collectionName={collectionName}
                    />
                ) : (
                    <UploadDataStep />
                );
            default:
                return null;
        }
    };

    return (
        <Card className="border-muted/40 shadow-sm">
            <CardContent className="p-6 sm:p-8">
                <div className="mb-10">
                    <Stepper
                        steps={steps}
                        currentStep={currentStep}
                        className="mx-auto max-w-3xl"
                    />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>

                {!isLastStep() && (
                    <motion.div
                        className="mt-10 flex justify-between"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {currentStep > 0 ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                className="px-6"
                            >
                                Previous
                            </Button>
                        ) : (
                            <div></div> // Empty div to maintain flex spacing
                        )}

                        <Button
                            type="button"
                            onClick={nextStep}
                            disabled={!canProceedToNextStep()}
                            className="px-6"
                        >
                            Next
                        </Button>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
}
