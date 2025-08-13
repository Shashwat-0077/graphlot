"charts";
"hono-codegen";
"react-query-codegen";

import z from "zod";

import { defineRoute } from "@/utils/defineRoute";
import {
    fetchChartAttribute,
    fetchChartMetadata,
    fetchMetadataByCollection,
} from "@/modules/chart-attributes/api/handler/read";
import {
    updateChartAttribute,
    updateChartMetadata,
} from "@/modules/chart-attributes/api/handler/update";
import {
    ChartBoxModelSchema,
    ChartColorSchema,
    ChartMetadataSchema,
    ChartTypographySchema,
    ChartVisualSchema,
} from "@/modules/chart-attributes/schema/types";
import { deleteChart } from "@/modules/chart-attributes/api/handler/delete";
import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import { createChart } from "@/modules/chart-attributes/api/handler/create";

const chartRouteConfig = [
    // chart metadata
    defineRoute({
        path: "/:collection_id",
        queryHookName: "useGetChartByCollection",
        method: "GET",
        middlewares: [],
        validators: {
            params: z.object({
                collection_id: z.string().nonempty(),
            }),
        },
        handler: async (c) => {
            const { collection_id } = c.req.valid("param");
            const response = await fetchMetadataByCollection(collection_id);

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json(response.metadata, 200);
        },
    }),
    defineRoute({
        path: "/:id",
        method: "GET",
        middlewares: [],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const response = await fetchChartMetadata(id);

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json(response.metadata, 200);
        },
    }),
    defineRoute({
        path: "/",
        method: "POST",
        middlewares: [authMiddleWare],
        validators: {
            json: ChartMetadataSchema.Insert,
        },
        handler: async (c) => {
            const data = c.req.valid("json");
            const response = await createChart(data);

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json(response.chart, 200);
        },
        includeOnSuccess: true,
        includeOnError: true,
    }),
    defineRoute({
        path: "/:id",
        method: "PUT",
        middlewares: [],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
            json: ChartMetadataSchema.Update,
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const data = c.req.valid("json");
            const response = await updateChartMetadata(id, data);

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json(response.chartId, 200);
        },
    }),
    defineRoute({
        path: "/:id",
        method: "DELETE",
        middlewares: [],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const response = await deleteChart(id);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json(response.chartId, 200);
        },
    }),

    // chart visuals
    defineRoute({
        path: "/:id/visuals",
        method: "GET",
        middlewares: [],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const response = await fetchChartAttribute(id, "visuals");

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json(response.data, 200);
        },
    }),
    defineRoute({
        path: "/:id/visuals",
        method: "PUT",
        middlewares: [],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
            json: ChartVisualSchema.Update,
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const data = c.req.valid("json");
            const response = await updateChartAttribute(id, "visuals", data);

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json(response.chartId, 200);
        },
    }),

    // chart typography
    defineRoute({
        path: "/:id/typography",
        method: "GET",
        middlewares: [],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const response = await fetchChartAttribute(id, "typography");
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json(response.data, 200);
        },
    }),
    defineRoute({
        path: "/:id/typography",
        method: "PUT",
        middlewares: [],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
            json: ChartTypographySchema.Update,
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const data = c.req.valid("json");
            const response = await updateChartAttribute(id, "typography", data);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json(response.chartId, 200);
        },
    }),

    // chart box model
    defineRoute({
        path: "/:id/box-model",
        method: "GET",
        middlewares: [],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const response = await fetchChartAttribute(id, "boxModel");
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json(response.data, 200);
        },
    }),
    defineRoute({
        path: "/:id/box-model",
        method: "PUT",
        middlewares: [],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
            json: ChartBoxModelSchema.Update,
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const data = c.req.valid("json");
            const response = await updateChartAttribute(id, "boxModel", data);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json(response.chartId, 200);
        },
    }),

    // chart colors
    defineRoute({
        path: "/:id/colors",
        method: "GET",
        middlewares: [],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const response = await fetchChartAttribute(id, "colors");
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json(response.data, 200);
        },
    }),
    defineRoute({
        path: "/:id/colors",
        method: "PUT",
        middlewares: [],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
            json: ChartColorSchema.Update,
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const data = c.req.valid("json");
            const response = await updateChartAttribute(id, "colors", data);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json(response.chartId, 200);
        },
    }),
];

export default chartRouteConfig;
