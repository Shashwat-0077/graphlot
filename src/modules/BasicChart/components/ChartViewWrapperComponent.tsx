"use client";
import React from "react";
// import { CheckCheck, SaveAll } from "lucide-react";

import { cn } from "@/lib/utils";
import { getRGBAString } from "@/utils/colors";
// import { Button } from "@/components/ui/button";

export const ChartViewWrapperComponent = ({
    children,
    bgColor,
    className,
}: {
    children: React.ReactNode;
    bgColor: { r: number; g: number; b: number; a: number };
    className?: string;
}) => {
    // const [saved, setSaved] = useState(false);
    // const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    return (
        <div
            className={cn(
                `relative flex flex-col items-center justify-center rounded-xl border`,
                className
            )}
            style={{
                backgroundColor: getRGBAString(bgColor, true),
            }}
        >
            {/* TODO : Add a tooltip here
            <Button
                className={cn(
                    `bri absolute right-10 top-5 m-0 border bg-transparent py-6 transition-all hover:scale-110 hover:bg-transparent [&_svg]:size-6`
                )}
                style={{
                    border: `1px solid ` + getRGBAString(invertRGBA(bgColor)),
                }}
                onClick={() => {
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }

                    setSaved(true);
                    timeoutRef.current = setTimeout(() => {
                        setSaved(false);
                    }, 2000);
                }}
            >
                {saved ? (
                    <CheckCheck
                        color={getRGBAString(invertRGBA(bgColor))}
                        size={32}
                    />
                ) : (
                    <SaveAll
                        color={getRGBAString(invertRGBA(bgColor))}
                        className="size-14"
                        size={32}
                    />
                )}
            </Button> */}

            {children}
        </div>
    );
};
