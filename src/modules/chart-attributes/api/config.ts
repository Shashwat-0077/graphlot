"charts";
"hono-codegen";
"react-query-codegen";

import z from "zod";

import { defineRoute } from "@/utils/defineRoute";
import {
    fetchChartAttribute,
    fetchChartMetadata,
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

const chartRouteConfig = [
    // chart metadata
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
                return c.json({ error: response.error });
            }
            return c.json({ chart: response.metadata });
        },
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
                return c.json({ error: response.error });
            }

            return c.json({ chartId: response.chartId });
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
                return c.json({ error: response.error });
            }
            return c.json({ chartId: response.chartId });
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
                return c.json({ error: response.error });
            }

            return c.json({ visuals: response.data });
        },
    }),
    defineRoute({
        path: "/:id/visuals",
        method: "POST",
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
                return c.json({ error: response.error });
            }

            return c.json({ chartId: response.chartId });
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
                return c.json({ error: response.error });
            }
            return c.json({ typography: response.data });
        },
    }),
    defineRoute({
        path: "/:id/typography",
        method: "POST",
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
                return c.json({ error: response.error });
            }
            return c.json({ chartId: response.chartId });
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
                return c.json({ error: response.error });
            }
            return c.json({ boxModel: response.data });
        },
    }),
    defineRoute({
        path: "/:id/box-model",
        method: "POST",
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
                return c.json({ error: response.error });
            }
            return c.json({ chartId: response.chartId });
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
                return c.json({ error: response.error });
            }
            return c.json({ colors: response.data });
        },
    }),
    defineRoute({
        path: "/:id/colors",
        method: "POST",
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
                return c.json({ error: response.error });
            }
            return c.json({ chartId: response.chartId });
        },
    }),
];

export default chartRouteConfig;
