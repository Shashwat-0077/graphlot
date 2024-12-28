import React from "react";

import ProjectLoader from "@/features/projects/components/ProjectLoader";

export default function projectLoader() {
    return (
        <div className="grid grid-cols-1 gap-x-20 gap-y-14 md:grid-cols-1 break900:grid-cols-2 break1200:grid-cols-3">
            <ProjectLoader />
            <ProjectLoader />
            <ProjectLoader />
        </div>
    );
}
