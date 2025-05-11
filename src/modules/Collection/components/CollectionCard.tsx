import { MoveRight, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function CollectionCard({
    path,
    name,
    chartCount,
}: {
    path: string;
    name: string;
    chartCount: number;
}) {
    return (
        <Link
            href={path}
            className="group relative flex h-[280px] flex-col overflow-hidden rounded-2xl bg-card shadow-sm"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent" />

            {/* Decorative elements */}
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/5 transition-all group-hover:scale-110" />
            <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-primary/5 transition-all group-hover:scale-110" />
            <div className="absolute bottom-6 right-6 rotate-12 text-primary/10">
                <BarChart3 className="h-20 w-20 transition-all group-hover:scale-105" />
            </div>

            {/* Chart count badge */}
            <div className="absolute right-6 top-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary backdrop-blur-sm">
                <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{chartCount}</span>
                    <span className="text-xs font-medium">Charts</span>
                </div>
            </div>

            {/* Content */}
            <div className="z-10 mt-auto flex flex-col p-6">
                <h3 className="mb-2 line-clamp-2 text-2xl font-bold leading-tight">
                    {name}
                </h3>
                <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary">
                    <span>View collection</span>
                    <MoveRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                    />
                </div>
            </div>
        </Link>
    );
}
