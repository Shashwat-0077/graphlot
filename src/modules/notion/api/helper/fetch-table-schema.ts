import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

import { getNotionClient } from "@/lib/notion";

export async function fetchTableSchema({
    databaseId,
}: {
    databaseId: string;
}): Promise<
    | {
          ok: true;
          schema: GetDatabaseResponse["properties"];
      }
    | { ok: false; error: string }
> {
    const notionClient = await getNotionClient();

    if (notionClient.success === false) {
        return { ok: false, error: notionClient.error };
    }

    const data = await notionClient.client.databases.retrieve({
        database_id: databaseId,
    });

    const schema = data.properties;

    return { ok: true, schema };
}
