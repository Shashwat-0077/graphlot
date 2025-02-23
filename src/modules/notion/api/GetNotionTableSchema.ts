import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

import { getNotionClient } from "@/lib/notion";

export async function GetNotionTableSchema(id: string): Promise<
    | {
          ok: true;
          schema: GetDatabaseResponse["properties"];
      }
    | { ok: false; error: Error }
> {
    const notionClient = await getNotionClient();

    if (notionClient.success === false) {
        return { ok: false, error: new Error(notionClient.error) };
    }

    const data = await notionClient.client.databases.retrieve({
        database_id: id,
    });

    const schema = data.properties;

    return { ok: true, schema };
}
