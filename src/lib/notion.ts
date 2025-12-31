import { Client } from "@notionhq/client";
import { headers } from "next/headers";

import { auth } from "@/modules/auth";

type returnType =
    | { success: true; client: Client }
    | { success: false; error: string };

export const getNotionClient = async (userId?: string): Promise<returnType> => {
    const sessionResult = await auth.api.getSession({
        headers: await headers(),
    });

    let access_token = "";

    if (sessionResult) {
        const { session } = sessionResult;

        const response = await auth.api.getAccessToken({
            body: {
                providerId: "notion",
                userId: session.userId,
            },
            headers: await headers(),
        });

        access_token = response.accessToken;
    } else if (userId) {
        const response = await auth.api.getAccessToken({
            body: {
                providerId: "notion",
                userId,
            },
        });

        access_token = response.accessToken;
    } else {
        return { success: false, error: "No valid session or user ID found" };
    }

    return {
        success: true,
        client: new Client({ auth: access_token }),
    };
};
