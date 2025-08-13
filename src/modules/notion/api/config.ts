"notion";
"hono-codegen";
"react-query-codegen";

import z from "zod";

import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import { fetchDatabases } from "@/modules/notion/api/helper/fetch-databases";
import { fetchTableData } from "@/modules/notion/api/helper/fetch-table-data";
import { defineRoute } from "@/utils/defineRoute";
import { fetchTableSchema } from "@/modules/notion/api/helper/fetch-table-schema";
import { fetchTableMetaData } from "@/modules/notion/api/helper/fetch-table-metadata";

const notionRoutes = [
    defineRoute({
        path: "/databases",
        method: "GET",
        queryHookName: "useNotionDatabases",
        middlewares: [authMiddleWare],
        validators: {},
        handler: async (c) => {
            const response = await fetchDatabases();
            if (!response.ok) {
                return c.json(response.error, 500);
            }

            const { databases } = response;

            return c.json(databases, 200);
        },
    }),
    defineRoute({
        path: ":notionTableId/table-data",
        method: "GET",
        queryHookName: "useNotionTableData",
        middlewares: [authMiddleWare],
        validators: {
            params: z.object({
                notionTableId: z.string().uuid(),
            }),
        },
        handler: async (c) => {
            const { notionTableId } = c.req.valid("param");

            const response = await fetchTableData({
                databaseId: notionTableId,
            });

            if (!response.ok) {
                return c.json(response.error, 500);
            }

            const { data } = response;

            return c.json(data, 200);
        },
    }),

    defineRoute({
        path: ":notionTableId/table-schema",
        method: "GET",
        queryHookName: "useNotionTableSchema",
        middlewares: [authMiddleWare],
        validators: {
            params: z.object({
                notionTableId: z.string().uuid(),
            }),
        },
        handler: async (c) => {
            const { notionTableId } = c.req.valid("param");

            const response = await fetchTableSchema({
                databaseId: notionTableId,
            });

            if (!response.ok) {
                return c.json(response.error, 500);
            }

            const { schema } = response;

            return c.json(schema, 200);
        },
    }),

    defineRoute({
        path: ":notionTableId/table-metadata",
        method: "GET",
        queryHookName: "useNotionTableMetadata",
        middlewares: [authMiddleWare],
        validators: {
            params: z.object({
                notionTableId: z.string().uuid(),
            }),
        },
        handler: async (c) => {
            const { notionTableId } = c.req.valid("param");

            const response = await fetchTableMetaData({
                databaseId: notionTableId,
            });

            if (!response.ok) {
                return c.json(response.error, 500);
            }

            const { data } = response;

            return c.json(data, 200);
        },
    }),
];

export default notionRoutes;
