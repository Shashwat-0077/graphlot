import Link from "next/link";
import { Plus } from "lucide-react";

import CollectionCard from "@/features/collections/components/CollectionCard";
import { getAllCollections } from "@/features/collections/api/getAllCollections";
import { createClient } from "@/utils/supabase/server";

export default async function Dashboard() {
    const cardSize = 150;

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return <div>Unauthorized</div>;
    }

    const response = await getAllCollections({ userId: user.id });

    if (!response.ok) {
        return <div>{response.error}</div>;
    }

    const { collections } = response;

    return (
        // TODO : Add a search bar for Collection search

        <div className="grid grid-cols-1 gap-x-20 gap-y-14 md:grid-cols-1 break900:grid-cols-2 break1200:grid-cols-3">
            {collections.map((collection) => (
                <CollectionCard
                    key={collection.id}
                    name={collection.name}
                    path={`/dashboard/collections/${collection.id}`}
                    size={cardSize}
                    chartCount={collection.chartCount}
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
    );
}
