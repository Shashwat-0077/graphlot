import Link from "next/link";

import { getAllChartsWithCollectionId } from "@/modules/BasicChart/api/getCharts";
import { parseSlug } from "@/utils/pathSlugsOps";
import { Button } from "@/components/ui/button";
import { getCollectionById } from "@/modules/Collection/api/getCollections";
import { ChartGroupsPage } from "@/components/pages/ChartGroupsPage";

export default async function GroupsPage({
    params,
}: {
    params: { collection_slug: string };
}) {
    const { collection_slug } = params;
    const { id: collection_id } = parseSlug(collection_slug);

    if (!collection_slug) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="rounded-xl border bg-card p-8 text-center shadow-md">
                    <h2 className="mb-2 text-xl font-semibold">
                        Invalid Collection
                    </h2>
                    <p className="mb-6 text-muted-foreground">
                        The collection you&apos;re looking for doesn&apos;t
                        exist.
                    </p>
                    <Button asChild>
                        <Link href="/dashboard/collections">
                            Return to Collections
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const [chartsResponse, collectionResponse] = await Promise.all([
        getAllChartsWithCollectionId(collection_id),
        getCollectionById(collection_id),
    ]);

    if (!chartsResponse.ok || !collectionResponse.ok) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="rounded-xl border bg-card p-8 text-center shadow-md">
                    <h2 className="mb-2 text-xl font-semibold">
                        Failed to Load Data
                    </h2>
                    <p className="mb-6 text-muted-foreground">
                        There was an error loading the data for this collection.
                    </p>
                    <Button asChild>
                        <Link href="/dashboard/collections">
                            Return to Collections
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const { charts } = chartsResponse;
    const { collection } = collectionResponse;

    return (
        <ChartGroupsPage
            collection_slug={collection_slug}
            charts={charts}
            collection={collection}
        />
    );
}
