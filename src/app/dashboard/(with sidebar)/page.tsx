import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/modules/auth";
import DashboardPage from "@/components/pages/Dashboard";
import { SimpleLoader } from "@/components/ui/Loader";

export default async function Dashboard() {
    const session = await auth();
    if (!session) {
        redirect("/");
    }
    if (!session.user) {
        redirect("/");
    }

    return (
        <Suspense
            fallback={
                <div className="flex h-full w-full items-center justify-center">
                    <SimpleLoader />
                </div>
            }
        >
            <DashboardPage />
        </Suspense>
    );
}
