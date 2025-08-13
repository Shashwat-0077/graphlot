import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/modules/auth";
import { DashboardPage } from "@/page-components/dashboard";

export default async function Dashboard() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        redirect("/");
    }
    if (!session.user) {
        redirect("/");
    }

    return <DashboardPage username={session.user.name || "Guest"} />;
}
