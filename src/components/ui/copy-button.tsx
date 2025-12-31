"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils"; // adjust this path based on your project structure

export function CopyButton({
    textToCopy,
    className,
}: {
    textToCopy: string;
    className?: string;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            throw new Error("Failed to copy text: " + err);
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handleCopy}
            className={cn("relative", className)}
        >
            <span className="truncate">
                {copied ? "Copied!" : "Copy Embed Link"}
            </span>
            <span className="sr-only">Copy Link</span>
        </Button>
    );
}
