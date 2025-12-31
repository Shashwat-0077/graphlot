import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/modules/auth";
import { NewChartForm } from "@/modules/chart-attributes/pages/new-chart";

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

    return <NewChartForm />;
}
