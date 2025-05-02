import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

import CollectionCard from "@/modules/Collection/components/CollectionCard";
import { getAllCollections } from "@/modules/Collection/api/getCollections";
import { getSlug } from "@/utils/pathSlugsOps";
import { BoxLoader } from "@/components/ui/Loader";
import { auth } from "@/modules/auth";

export default async function Dashboard() {
    const cardSize = 150;

    const session = await auth();

    if (!session) {
        redirect("/");
    }

    const { user } = session;

    if (!user || !user.id) {
        redirect("/");
    }

    const response = await getAllCollections({ userId: user.id });

    if (!response.ok) {
        return <div>{response.error}</div>;
    }

    const { collections } = response;

    return (
        // TODO : Add a search bar for Collection search
        <Suspense
            fallback={
                <div className="flex h-screen w-full items-center justify-center">
                    <BoxLoader />
                </div>
            }
        >
            <div className="grid grid-cols-1 gap-x-20 gap-y-14 md:grid-cols-1 break900:grid-cols-2 break1200:grid-cols-3">
                {collections.map((collection) => (
                    <CollectionCard
                        key={collection.collection_id}
                        name={collection.name}
                        path={`/dashboard/collections/${getSlug({ id: collection.collection_id, name: collection.name })}`}
                        size={cardSize}
                        chartCount={collection.chart_count}
                    />
                ))}
                <Link
                    href="/dashboard/new-collection"
                    className="relative grid cursor-pointer place-content-center rounded-md border font-play-write"
                    style={{ height: cardSize * 1.3 }}
                >
                    <Plus />
                </Link>
            </div>
        </Suspense>
    );
}
