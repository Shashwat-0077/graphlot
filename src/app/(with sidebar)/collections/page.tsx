import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/modules/auth";
import CollectionsPage from "@/modules/collection/pages";

export default async function Collections() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        redirect("/");
    }
    if (!session.user) {
        redirect("/");
    }

    return <CollectionsPage />;
}
