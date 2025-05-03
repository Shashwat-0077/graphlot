import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { GetAllNotionDatabases } from "@/modules/notion/api/GetAllNotionDatabases";
import { GetNotionTableData } from "@/modules/notion/api/GetNotionTableData";
import { GetNotionTableSchema } from "@/modules/notion/api/GetNotionTableSchema";
import { GetNotionTableMetaData } from "@/modules/notion/api/GetNotionTableMetaData";

// HACK : For now i cant see any other response type other than what notion sends us, and the type definitions from notion are not correct, this may cause an error but at the moment their is no way to know what type of error it will cause, we can maybe make the user let us know what type of error it is by submitting a form

// NOTE : We don't support Files and media from notion

const app = new Hono()
    .get(
        "/get-databases",
        zValidator(
            "query",
            z.object({
                user_id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { user_id } = c.req.valid("query");
            if (!user_id) {
                return c.json({ ok: false, error: "User ID is required" }, 400);
            }

            const response = await GetAllNotionDatabases({ user_id });
            if (!response.ok) {
                return c.json({ ok: false, error: response.error }, 500);
            }

            const { databases } = response;

            return c.json({ ok: true, databases: databases }, 200);
        }
    )
    .get(
        "/:notion_table_id/get-table-data",
        zValidator(
            "param",
            z.object({
                notion_table_id: z.string().nonempty(),
            })
        ),
        zValidator(
            "query",
            z.object({
                user_id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { notion_table_id } = c.req.valid("param");
            const { user_id } = c.req.valid("query");

            if (!user_id) {
                return c.json({ ok: false, error: "User ID is required" }, 400);
            }

            const response = await GetNotionTableData({
                database_id: notion_table_id,
                user_id,
            });

            if (!response.ok) {
                return c.json({ ok: false, error: response.error }, 500);
            }

            const { data } = response;

            return c.json({ ok: true, data }, 200);
        }
    )
    .get(
        "/:notion_table_id/get-table-schema",
        zValidator(
            "param",
            z.object({
                notion_table_id: z.string().nonempty(),
            })
        ),
        zValidator(
            "query",
            z.object({
                user_id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { notion_table_id } = c.req.valid("param");
            const { user_id } = c.req.valid("query");

            if (!user_id) {
                return c.json({ ok: false, error: "User ID is required" }, 400);
            }

            const response = await GetNotionTableSchema({
                database_id: notion_table_id,
                user_id,
            });

            if (!response.ok) {
                return c.json({ ok: false, error: response.error }, 500);
            }

            const { schema } = response;

            return c.json({ ok: true, schema }, 200);
        }
    )
    .get(
        "/:notion_table_id/get-table-metadata",
        zValidator(
            "param",
            z.object({
                notion_table_id: z.string().nonempty(),
            })
        ),
        zValidator(
            "query",
            z.object({
                user_id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { notion_table_id } = c.req.valid("param");
            const { user_id } = c.req.valid("query");
            if (!user_id) {
                return c.json({ ok: false, error: "User ID is required" }, 400);
            }
            const response = await GetNotionTableMetaData({
                notion_table_id,
                user_id,
            });

            if (!response.ok) {
                return c.json({ ok: false, error: response.error }, 500);
            }

            return c.json({ ok: true, data: response.data }, 200);
        }
    );

export default app;
