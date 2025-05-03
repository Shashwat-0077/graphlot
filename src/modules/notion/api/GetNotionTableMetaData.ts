import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

import { getNotionClient } from "@/lib/notion";

export async function GetNotionTableMetaData({
    notion_table_id,
    user_id,
}: {
    notion_table_id: string;
    user_id: string;
}): Promise<
    | {
          ok: true;
          data: GetDatabaseResponse;
      }
    | { ok: false; error: string }
> {
    const notionClient = await getNotionClient(user_id);

    if (notionClient.success === false) {
        return {
            ok: false,
            error: notionClient.error,
        };
    }

    const response = await notionClient.client.databases.retrieve({
        database_id: notion_table_id,
    });

    if (!("title" in response)) {
        return {
            ok: false,
            error: "Invalid Response from Notion API, title is not defined",
        };
    }

    return { ok: true, data: response };
}
