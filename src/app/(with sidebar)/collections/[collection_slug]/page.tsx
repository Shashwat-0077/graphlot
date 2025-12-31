import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/modules/auth";
import SingleCollectionPage from "@/modules/collection/pages/single-collection-page";

export default async function CollectionPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        redirect("/");
    }
    if (!session.user) {
        redirect("/");
    }
    return <SingleCollectionPage />;
}
