"use client";

import { Check } from "lucide-react";

import { cn } from "@/utils";

interface StepperProps {
    steps: string[];
    currentStep: number;
    className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
    return (
        <div className={cn("w-full", className)}>
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="relative flex items-center justify-center">
                            <div
                                className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200",
                                    index < currentStep
                                        ? "text-primary-foreground border-primary bg-primary"
                                        : index === currentStep
                                          ? "border-primary bg-background text-primary"
                                          : "border-muted-foreground/30 bg-background text-muted-foreground"
                                )}
                            >
                                {index < currentStep ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        "absolute top-1/2 left-10 h-0.5 w-[calc(100%-2.5rem)] -translate-y-1/2 transition-colors",
                                        index < currentStep
                                            ? "bg-primary"
                                            : "bg-muted-foreground/30"
                                    )}
                                />
                            )}
                        </div>
                        <span
                            className={cn(
                                "mt-2 text-center text-xs font-medium transition-colors sm:text-sm",
                                index <= currentStep
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            {step}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
