import {
    DatabaseObjectResponse,
    PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { getNotionClient } from "@/lib/notion";

export async function GetNotionTableData(id: string): Promise<
    | {
          ok: true;
          data:
              | PageObjectResponse["properties"]
              | DatabaseObjectResponse["properties"];
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

    const result = response.results[0];

    if (!("properties" in result)) {
        return {
            ok: false,
            error: "Invalid database id",
        };
    }
    const data = result.properties;

    return { ok: true, data: data };
}
