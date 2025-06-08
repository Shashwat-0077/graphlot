import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { fetchAllNotionDatabases } from "@/modules/notion/api/helper/fetch-all-notion-databases";
import { fetchNotionTableData } from "@/modules/notion/api/helper/fetch-notion-table-data";
import { fetchNotionTableSchema } from "@/modules/notion/api/helper/fetch-notion-table-schema";
import { fetchNotionTableMetaData } from "@/modules/notion/api/helper/fetch-notion-table-meta-data";

// HACK : For now i cant see any other response type other than what notion sends us, and the type definitions from notion are not correct, this may cause an error but at the moment their is no way to know what type of error it will cause, we can maybe make the user let us know what type of error it is by submitting a form

// NOTE : We don't support Files and media from notion

const app = new Hono()
    .get(
        "/get-databases",
        zValidator(
            "query",
            z.object({
                userId: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { userId } = c.req.valid("query");
            if (!userId) {
                return c.json({ ok: false, error: "User ID is required" }, 400);
            }

            const response = await fetchAllNotionDatabases(userId);
            if (!response.ok) {
                return c.json({ ok: false, error: response.error }, 500);
            }

            const { databases } = response;

            return c.json({ ok: true, databases: databases }, 200);
        }
    )
    .get(
        "/:notionTableId/get-table-data",
        zValidator(
            "param",
            z.object({
                notionTableId: z.string().nonempty(),
            })
        ),
        zValidator(
            "query",
            z.object({
                userId: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { notionTableId } = c.req.valid("param");
            const { userId } = c.req.valid("query");

            if (!userId) {
                return c.json({ ok: false, error: "User ID is required" }, 400);
            }

            const response = await fetchNotionTableData({
                databaseId: notionTableId,
                userId: userId,
            });

            if (!response.ok) {
                return c.json({ ok: false, error: response.error }, 500);
            }

            const { data } = response;

            return c.json({ ok: true, data }, 200);
        }
    )
    .get(
        "/:notionTableId/get-table-schema",
        zValidator(
            "param",
            z.object({
                notionTableId: z.string().nonempty(),
            })
        ),
        zValidator(
            "query",
            z.object({
                userId: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { notionTableId } = c.req.valid("param");
            const { userId } = c.req.valid("query");

            if (!userId) {
                return c.json({ ok: false, error: "User ID is required" }, 400);
            }

            const response = await fetchNotionTableSchema({
                databaseId: notionTableId,
                userId: userId,
            });

            if (!response.ok) {
                return c.json({ ok: false, error: response.error }, 500);
            }

            const { schema } = response;

            return c.json({ ok: true, schema }, 200);
        }
    )
    .get(
        "/:notionTableId/get-table-metadata",
        zValidator(
            "param",
            z.object({
                notionTableId: z.string().nonempty(),
            })
        ),
        zValidator(
            "query",
            z.object({
                userId: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { notionTableId } = c.req.valid("param");
            const { userId } = c.req.valid("query");
            if (!userId) {
                return c.json({ ok: false, error: "User ID is required" }, 400);
            }
            const response = await fetchNotionTableMetaData({
                notionTableId,
                userId,
            });

            if (!response.ok) {
                return c.json({ ok: false, error: response.error }, 500);
            }

            return c.json({ ok: true, data: response.data }, 200);
        }
    );

export default app;
