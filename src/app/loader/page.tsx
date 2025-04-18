import React from "react";

import { BoxLoader } from "@/components/ui/Loader";

const LoaderPage = () => {
    return (
        <div className="grid h-screen place-content-center overflow-hidden bg-background text-foreground">
            <BoxLoader />
        </div>
    );
};

export default LoaderPage;
