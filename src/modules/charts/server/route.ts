import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleWare } from "@/modules/auth/middlewares/authMiddleware";
import { GetNotionTableMetaData } from "@/modules/notion/api/GetNotionTableMetaData";
import {
    getAllChartsWithCollectionId,
    getChartWithIdAndCollectionId,
} from "@/modules/charts/api/getCharts";
import { BasicChartSchema, ChartsTypesSchema } from "@/modules/charts/schema";
import { createNewChart } from "@/modules/charts/api/createNewChart";
import { deleteChart } from "@/modules/charts/api/deleteChart";
import {
    moveChartBetweenCollections,
    updateChart,
    updateChartType,
} from "@/modules/charts/api/updateChart";

type variables = {
    userId: string;
};

const app = new Hono<{ Variables: variables }>()
    .get(
        "/all",
        zValidator(
            "query",
            z.object({
                collection_id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { collection_id } = c.req.valid("query");

            const response = await getAllChartsWithCollectionId(collection_id);

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            const { charts } = response;
            return c.json({ charts }, 200);
        }
    )
    .get(
        "/:chart_id",
        zValidator(
            "param",
            z.object({
                chart_id: z.string().nonempty(),
            })
        ),
        zValidator(
            "query",
            z.object({
                collection_id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { chart_id } = c.req.valid("param");
            const { collection_id } = c.req.valid("query");

            const response = await getChartWithIdAndCollectionId({
                chart_id,
                collection_id,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            const { chart } = response;

            return c.json({ chart }, 200);
        }
    )
    .post(
        "/create-chart",
        authMiddleWare,
        zValidator(
            "form",
            BasicChartSchema.Insert.omit({ notion_database_name: true })
        ),
        async (c) => {
            const chart = c.req.valid("form");

            const tableMetaData = await GetNotionTableMetaData(
                chart.notion_database_id
            );

            if (!tableMetaData.ok) {
                return c.json(
                    {
                        error: tableMetaData.error,
                        field: "notion_database_id" as
                            | keyof Zod.infer<typeof BasicChartSchema.Insert>
                            | "root",
                    },
                    500
                );
            }

            if (!("title" in tableMetaData.data)) {
                return c.json(
                    {
                        error: "Invalid Response from Notion API, title is not defined",
                        field: "notion_database_id" as
                            | keyof Zod.infer<typeof BasicChartSchema.Insert>
                            | "root",
                    },
                    500
                );
            }

            const databaseName = tableMetaData.data.title[0]["plain_text"];

            const response = await createNewChart({
                chart: {
                    ...chart,
                    notion_database_name: databaseName,
                },
            });

            if (!response.ok) {
                return c.json(
                    { error: response.error, field: response.field },
                    500
                );
            }

            const { newChart } = response;

            return c.json({ newChart }, 200);
        }
    )
    .patch(
        "/change-type/:chart_id",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                chart_id: z.string().nonempty(),
            })
        ),
        zValidator(
            "query",
            z.object({
                type: ChartsTypesSchema,
            })
        ),
        async (c) => {
            const { chart_id } = c.req.valid("param");
            const { type } = c.req.valid("query");
            const user_id = c.get("userId");

            const response = await updateChartType({ user_id, chart_id, type });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ updated: true }, 200);
        }
    )
    .patch(
        "move-chart/:chart_id",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                chart_id: z.string().nonempty(),
            })
        ),
        zValidator(
            "query",
            z.object({
                new_collection_id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { chart_id } = c.req.valid("param");
            const { new_collection_id } = c.req.valid("query");
            const user_id = c.get("userId");

            const response = await moveChartBetweenCollections({
                user_id,
                chart_id,
                new_collection_id,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ moved: true }, 200);
        }
    )
    .put(
        "/:chart_id",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                chart_id: z.string().nonempty(),
            })
        ),
        zValidator("form", BasicChartSchema.Update),
        async (c) => {
            const { chart_id } = c.req.valid("param");
            const newChart = c.req.valid("form");
            const user_id = c.get("userId");

            const response = await updateChart({
                newChart,
                chart_id,
                user_id,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ updated: true }, 200);
        }
    )
    .delete(
        "/:chart_id",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                chart_id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { chart_id } = c.req.valid("param");
            const user_id = c.get("userId");

            const response = await deleteChart({ user_id, chart_id });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ deleted: true }, 200);
        }
    );

export default app;
