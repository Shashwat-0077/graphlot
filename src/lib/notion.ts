import { Client } from "@notionhq/client";

import { getNotionAccessToken } from "@/modules/auth/api/getNotionAccessToken";

type returnType =
    | { success: true; client: Client }
    | { success: false; error: string };

export const getNotionClient = async (user_id: string): Promise<returnType> => {
    const response = await getNotionAccessToken(user_id);

    if (!response.ok) {
        return { success: false, error: response.error };
    }

    const { access_token: notion_token } = response;

    return { success: true, client: new Client({ auth: notion_token }) };
};
