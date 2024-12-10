import { MoveRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import { cn } from "@/lib/utils";

export default function ProjectCard({
    path,
    size = 150,
}: {
    path: string;
    size?: number;
}) {
    const circleSize = size;
    return (
        <Link
            href={path}
            className="relative flex cursor-pointer rounded-2xl bg-gradient-to-br from-[#E44048] from-20% to-[#ABABAB] font-play-write"
            style={{ height: size * 1.3 }}
        >
            {/* Body */}
            <div className="flex h-full flex-col justify-between p-3">
                <span className="flex items-center gap-2">
                    <span className="text-xs">View</span>
                    <MoveRight size={10} className="mt-1" />
                </span>
                <h1>Your project name</h1>
            </div>
            {/* Circle */}
            <div
                className={cn(
                    "absolute right-0 top-0 aspect-square rounded-full bg-background"
                )}
                style={{
                    width: circleSize,
                    transform: `translate(${circleSize / 4}px, -${circleSize / 4}px)`,
                }}
            >
                <div className="absolute left-1/2 top-1/2 grid h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 place-content-center rounded-full border-2 border-primary text-2xl">
                    4
                </div>
            </div>
        </Link>
    );
}
