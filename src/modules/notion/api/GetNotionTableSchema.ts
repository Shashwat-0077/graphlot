import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

import { getNotionClient } from "@/lib/notion";

export async function GetNotionTableSchema({
    database_id,
    user_id,
}: {
    database_id: string;
    user_id: string;
}): Promise<
    | {
          ok: true;
          schema: GetDatabaseResponse["properties"];
      }
    | { ok: false; error: string }
> {
    const notionClient = await getNotionClient(user_id);

    if (notionClient.success === false) {
        return { ok: false, error: notionClient.error };
    }

    const data = await notionClient.client.databases.retrieve({
        database_id: database_id,
    });

    const schema = data.properties;

    return { ok: true, schema };
}
