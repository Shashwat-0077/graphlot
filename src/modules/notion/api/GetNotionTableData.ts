import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { getNotionClient } from "@/lib/notion";

export async function GetNotionTableData(id: string): Promise<
    | {
          ok: true;
          data: PageObjectResponse["properties"][];
      }
    | { ok: false; error: string }
> {
    const notionClient = await getNotionClient();

    if (notionClient.success === false) {
        return {
            ok: false,
            error: notionClient.error,
        };
    }

    const response = await notionClient.client.databases.query({
        database_id: id,
    });

    const result = response.results;

    const data = [];

    for (const entry of result) {
        if ("properties" in entry && entry.object === "page") {
            data.push(entry.properties);
        }
    }

    return { ok: true, data: data };
}
