import { Client } from "@notionhq/client";

import { createClient } from "@/utils/supabase/server";

type returnType =
    | { success: true; client: Client }
    | { success: false; error: string };

export const getNotionClient = async (): Promise<returnType> => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        return { success: false, error: error.message };
    }

    if (data.session === null) {
        return { success: false, error: "No session found" };
    }

    const notion_token = data.session?.provider_token;

    // BUG : Notion token keeps getting unavailable
    if (!notion_token) {
        return {
            success: false,
            error: "Notion token not found or invalid",
        };
    }

    return { success: true, client: new Client({ auth: notion_token }) };
};
