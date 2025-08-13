import Link from "next/link";
import { BarChart2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyCharts({ collection_slug }: { collection_slug: string }) {
    return (
        <div className="border-muted-foreground/25 bg-card/50 flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
            <div className="bg-primary/10 mb-4 rounded-full p-3">
                <BarChart2 className="text-primary h-8 w-8" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold">No Charts Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                Create your first chart to start visualizing your data
            </p>
            <Button asChild>
                <Link href={`/collections/${collection_slug}/new-chart`}>
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Chart
                </Link>
            </Button>
        </div>
    );
}
