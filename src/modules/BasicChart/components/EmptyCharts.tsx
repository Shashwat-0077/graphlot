import Link from "next/link";
import { BarChart2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyCharts({ collection_slug }: { collection_slug: string }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/25 bg-card/50 p-12 text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
                <BarChart2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold">No Charts Yet</h2>
            <p className="mb-6 max-w-md text-muted-foreground">
                Create your first chart to start visualizing your data
            </p>
            <Button asChild>
                <Link
                    href={`/dashboard/collections/${collection_slug}/new-chart`}
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Chart
                </Link>
            </Button>
        </div>
    );
}
