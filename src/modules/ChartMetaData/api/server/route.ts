import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleWare } from "@/modules/auth/middlewares/authMiddleware";
import {
    fetchChartData,
    fetchChartMetadataByCollection,
    fetchChartMetadataById,
    fetchChartPropertiesById,
    fetchChartSchema,
    fetchFullChartById,
} from "@/modules/ChartMetaData/api/helper/fetch-chart";
import { createNewChart } from "@/modules/ChartMetaData/api/helper/create-new-chart";
import {
    updateChartMetadata,
    updateChartType,
} from "@/modules/ChartMetaData/api/helper/update-chart";
import { deleteChart } from "@/modules/ChartMetaData/api/helper/delete-chart";
import { CHART_TYPES } from "@/constants";
import { ChartMetadataSchema } from "@/modules/ChartMetaData/schema";

type variables = {
    userId: string;
};

const chartMetadataRoutes = new Hono<{ Variables: variables }>()
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

            const response =
                await fetchChartMetadataByCollection(collection_id);

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            const { charts } = response;
            return c.json({ charts }, 200);
        }
    )
    .get(
        "/:id",
        zValidator(
            "param",
            z.object({
                id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { id } = c.req.valid("param");

            const response = await fetchChartMetadataById(id);

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            const { chart } = response;

            return c.json({ chart }, 200);
        }
    )
    .get(
        "/:id/full",
        zValidator(
            "param",
            z.object({
                id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { id } = c.req.valid("param");
            const response = await fetchFullChartById(id);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            const { chart } = response;
            return c.json({ chart }, 200);
        }
    )
    .get(
        "/:id/properties",
        zValidator(
            "param",
            z.object({
                id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { id } = c.req.valid("param");
            const response = await fetchChartPropertiesById(id);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            const { properties } = response;
            return c.json({ properties: properties }, 200);
        }
    )
    .get(
        "/:id/get-table-schema",
        zValidator(
            "query",
            z.object({
                userId: z.string().nonempty(),
            })
        ),
        zValidator(
            "param",
            z.object({
                id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { id } = c.req.valid("param");
            const { userId } = c.req.valid("query");

            const response = await fetchChartSchema({
                chartId: id,
                userId,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            const { ok: _, ...rest } = response;

            return c.json(rest, 200);
        }
    )
    .get(
        "/:id/get-table-data",
        zValidator(
            "param",
            z.object({
                id: z.string().nonempty(),
            })
        ),
        zValidator(
            "query",
            z.object({
                userId: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { id } = c.req.valid("param");
            const { userId } = c.req.valid("query");
            const response = await fetchChartData({
                chartId: id,
                userId,
            });
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            const { data } = response;
            return c.json({ data }, 200);
        }
    )
    .post(
        "/create-chart",
        authMiddleWare,
        zValidator("json", ChartMetadataSchema.Insert),
        async (c) => {
            const chart = c.req.valid("json");
            const response = await createNewChart(chart);

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ chart: response.chart }, 200);
        }
    )
    .patch(
        "/change-type/:id",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                id: z.string().nonempty(),
            })
        ),
        zValidator(
            "query",
            z.object({
                type: z.enum(CHART_TYPES),
            })
        ),
        async (c) => {
            const { id } = c.req.valid("param");
            const { type } = c.req.valid("query");

            const response = await updateChartType({
                chartId: id,
                type,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ updated: true }, 200);
        }
    )
    .put(
        "/:id",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                id: z.string().nonempty(),
            })
        ),
        zValidator("json", ChartMetadataSchema.Update),
        async (c) => {
            const { id } = c.req.valid("param");
            const newChart = c.req.valid("json");

            const response = await updateChartMetadata({
                chartId: id,
                data: newChart,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            const { chartId } = response;

            return c.json({ updated: true, chartId }, 200);
        }
    )
    .delete(
        "/:id",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { id } = c.req.valid("param");

            const response = await deleteChart(id);

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ deleted: true }, 200);
        }
    );
export default chartMetadataRoutes;
