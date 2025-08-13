import { Client } from "@notionhq/client";
import { headers } from "next/headers";

import { auth } from "@/modules/auth";

type returnType =
    | { success: true; client: Client }
    | { success: false; error: string };

export const getNotionClient = async (): Promise<returnType> => {
    const sessionResult = await auth.api.getSession({
        headers: await headers(),
    });

    if (!sessionResult) {
        return { success: false, error: "Session not found" };
    }

    const { session } = sessionResult;

    const response = await auth.api.getAccessToken({
        body: {
            providerId: "notion",
            userId: session.userId,
        },
        headers: await headers(),
    });

    const access_token = response.accessToken;

    return {
        success: true,
        client: new Client({ auth: access_token }),
    };
};
