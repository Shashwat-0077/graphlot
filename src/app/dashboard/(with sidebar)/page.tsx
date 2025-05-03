import { redirect } from "next/navigation";

import { auth } from "@/modules/auth";

export default async function Dashboard() {
    const session = await auth();
    if (!session) {
        redirect("/");
    }
    if (!session.user) {
        redirect("/");
    }

    return <div>Dashboard</div>;
}
