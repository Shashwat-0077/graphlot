import React from "react";

import { BoxLoader } from "@/components/ui/Loader";

const LoadingPage = () => {
    return (
        <div className="grid h-screen place-content-center overflow-hidden bg-background text-foreground">
            <BoxLoader />
        </div>
    );
};

export default LoadingPage;
