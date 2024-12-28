import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import ProjectCard from "@/features/projects/components/ProjectCard";

export default async function Dashboard() {
    const cardSize = 150;

    return (
        // TODO : Add a search bar for project search

        <div className="grid grid-cols-1 gap-x-20 gap-y-14 md:grid-cols-1 break900:grid-cols-2 break1200:grid-cols-3">
            <ProjectCard path="/dashboard/projects/sample" size={cardSize} />
            <ProjectCard path="/dashboard/projects/sample" size={cardSize} />
            <ProjectCard path="/dashboard/projects/sample" size={cardSize} />
            <ProjectCard path="/dashboard/projects/sample" size={cardSize} />
            <Link
                href="/dashboard/new-project"
                className="relative grid cursor-pointer place-content-center rounded-md border font-play-write"
                style={{ height: cardSize * 1.3 }}
            >
                <Plus />
            </Link>
        </div>
    );
}
