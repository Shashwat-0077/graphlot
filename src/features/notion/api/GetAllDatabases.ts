import { getNotionClient } from "@/lib/notion";

export async function GetAllDatabases(): Promise<
    | {
          ok: true;
          databases: {
              id: string;
              title: string;
          }[];
      }
    | {
          ok: false;
          error: Error;
      }
> {
    const notionClient = await getNotionClient();

    if (notionClient.success === false) {
        return { ok: false, error: new Error(notionClient.error) };
    }

    const response = await notionClient.client.search({
        filter: {
            value: "database",
            property: "object",
        },
    });

    const databases = response.results.map((result) => {
        return {
            id: result.id,
            // @ts-expect-error - The API response does not have all the types defined however they are included in the API response
            title: result.title[0].plain_text as string,
        };
    });

    return { ok: true, databases: databases };
}
