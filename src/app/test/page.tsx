import { headers } from "next/headers";
import React from "react";

import { auth } from "@/modules/auth";

const page = async () => {
    const response = await auth.api.getAccessToken({
        body: {
            providerId: "notion",
        },
        headers: await headers(),
    });

    return <div>page</div>;
};

export default page;
