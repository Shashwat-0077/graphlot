import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import ProjectCard from "@/features/projects/components/ProjectCard";

// import { createClient } from "@/utils/supabase/server";

export default async function Dashboard() {
    // const supabase = await createClient();

    // const user = await supabase.auth.getUser();

    const cardSize = 150;

    return (
        <div>
            <div className="grid grid-cols-1 gap-x-20 gap-y-14 md:grid-cols-1 break900:grid-cols-2 break1200:grid-cols-3">
                <ProjectCard
                    path="/dashboard/projects/sample"
                    size={cardSize}
                />
                <ProjectCard
                    path="/dashboard/projects/sample"
                    size={cardSize}
                />
                <ProjectCard
                    path="/dashboard/projects/sample"
                    size={cardSize}
                />
                <ProjectCard
                    path="/dashboard/projects/sample"
                    size={cardSize}
                />
                <Link
                    href="/dashboard/new-project"
                    className="relative grid cursor-pointer place-content-center rounded-md border font-play-write"
                    style={{ height: cardSize * 1.3 }}
                >
                    <Plus />
                </Link>
            </div>
        </div>
    );
}
