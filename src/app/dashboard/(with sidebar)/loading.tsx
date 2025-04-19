import React from "react";

import { BoxLoader } from "@/components/ui/Loader";

const LoadingPage = () => {
    return (
        <div className="flex h-screen items-center justify-center">
            <BoxLoader />
        </div>
    );
};

export default LoadingPage;
