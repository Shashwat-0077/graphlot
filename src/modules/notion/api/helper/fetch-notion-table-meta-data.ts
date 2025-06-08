import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

import { getNotionClient } from "@/lib/notion";

export async function fetchNotionTableMetaData({
    notionTableId,
    userId,
}: {
    notionTableId: string;
    userId: string;
}): Promise<
    | {
          ok: true;
          data: GetDatabaseResponse;
      }
    | { ok: false; error: string }
> {
    const notionClient = await getNotionClient(userId);

    if (notionClient.success === false) {
        return {
            ok: false,
            error: notionClient.error,
        };
    }

    const response = await notionClient.client.databases.retrieve({
        database_id: notionTableId,
    });

    if (!("title" in response)) {
        return {
            ok: false,
            error: "Invalid Response from Notion API, title is not defined",
        };
    }

    return { ok: true, data: response };
}
