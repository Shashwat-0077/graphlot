import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/modules/auth";
import { NewCollectionForm } from "@/modules/collection/pages/new-collection-form-page";

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

    return <NewCollectionForm />;
}
