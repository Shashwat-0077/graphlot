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
            className="group bg-card relative flex h-70 flex-col overflow-hidden rounded-2xl shadow-sm"
        >
            {/* Background gradient */}
            <div className="from-primary/5 via-primary/10 absolute inset-0 bg-linear-to-br to-transparent" />

            {/* Decorative elements */}
            <div className="bg-primary/5 absolute -top-16 -right-16 h-32 w-32 rounded-full transition-all group-hover:scale-110" />
            <div className="bg-primary/5 absolute -bottom-8 -left-8 h-24 w-24 rounded-full transition-all group-hover:scale-110" />
            <div className="text-primary/10 absolute right-6 bottom-6 rotate-12">
                <BarChart3 className="h-20 w-20 transition-all group-hover:scale-105" />
            </div>

            {/* Chart count badge */}
            <div className="bg-primary/10 text-primary absolute top-6 right-6 flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm">
                <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{chartCount}</span>
                    <span className="text-xs font-medium">Charts</span>
                </div>
            </div>

            {/* Content */}
            <div className="z-10 mt-auto flex flex-col p-6">
                <h3 className="mb-2 line-clamp-2 text-2xl leading-tight font-bold">
                    {name}
                </h3>
                <div className="text-primary mt-2 flex items-center gap-1.5 text-sm font-medium">
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
