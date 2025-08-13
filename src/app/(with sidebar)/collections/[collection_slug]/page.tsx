import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/modules/auth";
import SingleCollectionPage from "@/page-components/collections/SingleCollectionPage";

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
