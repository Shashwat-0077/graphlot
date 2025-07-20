"use client";

import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SaveReminderProps {
    onSave: () => void;
    isLoading: boolean;
}

export function SaveReminder({ onSave, isLoading }: SaveReminderProps) {
    return (
        <Card className="border-dashed">
            <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        Press{" "}
                        <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">
                            Ctrl+S
                        </kbd>{" "}
                        to save quickly
                    </span>
                </div>
                <Button variant="outline" onClick={onSave} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </CardContent>
        </Card>
    );
}
