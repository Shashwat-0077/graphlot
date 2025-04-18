import { Client } from "@notionhq/client";

import { createClient } from "@/lib/supabase/server";

type returnType =
    | { success: true; client: Client }
    | { success: false; error: string };

export const getNotionClient = async (): Promise<returnType> => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        return { success: false, error: error.message };
    }

    if (data.user === null) {
        return { success: false, error: "No user found" };
    }

    const notion_token = data.user.user_metadata?.provider_token;

    if (!notion_token) {
        return {
            success: false,
            error: "Notion token not found or invalid",
        };
    }

    return { success: true, client: new Client({ auth: notion_token }) };
};
