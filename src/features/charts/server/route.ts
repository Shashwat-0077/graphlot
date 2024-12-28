import { Hono } from "hono";

import { getNotionClient } from "@/lib/notion";

// HACK : For now i cant see any other response type other than what notion sends us, and the type definitions from notion are not correct, this may cause an error but at the moment their is no way to know what type of error it will cause, we can maybe make the user let us know what type of error it is by submitting a form

// NOTE : We currently don't support Files and media from notion

const app = new Hono()
    .get("/get-databases", async (c) => {
        const notionClient = await getNotionClient();

        if (notionClient.success === false) {
            return c.json({ success: false, error: notionClient.error }, 500);
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
                title: result.title[0].plain_text,
            };
        });

        return c.json({ success: true, databases: databases }, 200);
    })
    .get("/:id/get-table-data", async (c) => {
        // TODO : Remove this ----> 1534edf4-c844-80e2-8104-c3a8017b216c
        const { id } = c.req.param();

        const notionClient = await getNotionClient();

        if (notionClient.success === false) {
            return c.json({ success: false, error: notionClient.error }, 500);
        }

        const data = await notionClient.client.databases.query({
            database_id: id,
        });

        const parsedData = data.results.map((item) => {
            // @ts-expect-error - The API response does not have all the types defined however they are included in the API response
            const properties = item.properties;

            for (const key in properties) {
                properties[key] = properties[key][properties[key].type];
            }

            return properties;
        });

        return c.json({ success: true, parsedData }, 200);
    })
    .get("/:id/get-table-schema", async (c) => {
        const { id } = c.req.param();

        const notionClient = await getNotionClient();

        if (notionClient.success === false) {
            return c.json({ success: false, error: notionClient.error }, 500);
        }

        const data = await notionClient.client.databases.retrieve({
            database_id: id,
        });

        const schema = data.properties;

        return c.json({ success: true, schema }, 200);
    });
export default app;
