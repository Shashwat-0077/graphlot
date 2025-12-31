import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import { fetchNotionDatabases } from "@/modules/notion/api/helper/fetch-databases";
import { fetchNotionTableData } from "@/modules/notion/api/helper/fetch-table-data";
import { fetchNotionTableSchema } from "@/modules/notion/api/helper/fetch-table-schema";
import { fetchNotionTableMetaData } from "@/modules/notion/api/helper/fetch-table-metadata";

const app = new Hono()
    .get("/databases", authMiddleWare, async (c) => {
        const response = await fetchNotionDatabases();
        if (!response.ok) {
            return c.json(response.error, 500);
        }

        const { databases } = response;

        return c.json(databases, 200);
    })
    .get(
        ":notionTableId/table-data",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                notionTableId: z.string().uuid(),
            })
        ),
        async (c) => {
            const { notionTableId } = c.req.valid("param");

            const response = await fetchNotionTableData({
                databaseId: notionTableId,
            });

            if (!response.ok) {
                return c.json(response.error, 500);
            }

            const { data } = response;

            return c.json(data, 200);
        }
    )
    .get(
        ":notionTableId/table-schema",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                notionTableId: z.string().uuid(),
            })
        ),
        async (c) => {
            const { notionTableId } = c.req.valid("param");

            const response = await fetchNotionTableSchema({
                databaseId: notionTableId,
            });

            if (!response.ok) {
                return c.json(response.error, 500);
            }

            const { schema } = response;

            return c.json(schema, 200);
        }
    )
    .get(
        ":notionTableId/table-metadata",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                notionTableId: z.string().uuid(),
            })
        ),
        async (c) => {
            const { notionTableId } = c.req.valid("param");

            const response = await fetchNotionTableMetaData({
                databaseId: notionTableId,
            });

            if (!response.ok) {
                return c.json(response.error, 500);
            }

            const { data } = response;

            return c.json(data, 200);
        }
    );

export default app;
