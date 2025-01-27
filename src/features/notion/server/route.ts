import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { authMiddleWare } from "@/features/auth/middlewares/authMiddleware";

import { GetAllDatabases } from "../api/GetAllDatabases";
import { GetNotionTableData } from "../api/GetNotionTableData";
import { GetTableSchema } from "../api/GetTableSchema";

// HACK : For now i cant see any other response type other than what notion sends us, and the type definitions from notion are not correct, this may cause an error but at the moment their is no way to know what type of error it will cause, we can maybe make the user let us know what type of error it is by submitting a form

// NOTE : We currently don't support Files and media from notion

const app = new Hono()
    .get("/get-databases", authMiddleWare, async (c) => {
        const response = await GetAllDatabases();

        if (!response.ok) {
            return c.json({ ok: false, error: response.error }, 500);
        }

        const { databases } = response;

        return c.json({ ok: true, databases: databases }, 200);
    })
    .get(
        "/:id/get-table-data",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { id } = c.req.valid("param");
            const response = await GetNotionTableData(id);

            if (!response.ok) {
                return c.json({ ok: false, error: response.error }, 500);
            }

            const { data } = response;

            return c.json({ ok: true, data }, 200);
        }
    )
    .get(
        "/:id/get-table-schema",
        zValidator(
            "param",
            z.object({
                id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { id } = c.req.param();

            const response = await GetTableSchema(id);

            if (!response.ok) {
                return c.json({ ok: false, error: response.error }, 500);
            }

            const { schema } = response;

            return c.json({ ok: true, schema }, 200);
        }
    );

export default app;
