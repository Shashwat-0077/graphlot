import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { fetchChartAttribute, fetchChartData, fetchChartMetadata, fetchChartSchema, fetchMetadataByCollection } from "@/modules/chart-attributes/api/handler/read";
import { updateChartAttribute, updateChartMetadata } from "@/modules/chart-attributes/api/handler/update";
import { ChartBoxModelSchema, ChartColorSchema, ChartMetadataSchema, ChartTypographySchema, ChartVisualSchema } from "@/modules/chart-attributes/schema/types";
import { deleteChart } from "@/modules/chart-attributes/api/handler/delete";
import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import { createChart } from "@/modules/chart-attributes/api/handler/create";

const app = new Hono()
    .get("/",
        zValidator("query", z.object({
                collectionId: z.string().nonempty(),
            })),
        async (c) => {
        const { collectionId } = c.req.valid("query");
                    const response = await fetchMetadataByCollection(collectionId);
        
                    if (!response.ok) {
                        return c.json({ error: response.error }, 500);
                    }
                    return c.json(response.metadata, 200);
    }
    )
    .get("/:id",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        async (c) => {
        const { id } = c.req.valid("param");
                    const response = await fetchChartMetadata(id);
        
                    if (!response.ok) {
                        return c.json(response.error, 500);
                    }
                    return c.json(response.metadata, 200);
    }
    )
    .post("/",
        authMiddleWare,
        zValidator("json", ChartMetadataSchema.Insert),
        async (c) => {
        const data = c.req.valid("json");
                    const response = await createChart(data);
        
                    if (!response.ok) {
                        return c.json(response.error, 500);
                    }
                    return c.json(response.chart, 200);
    }
    )
    .put("/:id",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        zValidator("json", ChartMetadataSchema.Update),
        async (c) => {
        const { id } = c.req.valid("param");
                    const data = c.req.valid("json");
                    const response = await updateChartMetadata(id, data);
        
                    if (!response.ok) {
                        return c.json(response.error, 500);
                    }
        
                    return c.json(response.chartId, 200);
    }
    )
    .delete("/:id",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        async (c) => {
        const { id } = c.req.valid("param");
                    const response = await deleteChart(id);
                    if (!response.ok) {
                        return c.json(response.error, 500);
                    }
                    return c.json(response.chartId, 200);
    }
    )
    .get("/:id/table-schema",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        zValidator("query", z.object({
                userId: z.string().nonempty(),
            })),
        async (c) => {
        const { id } = c.req.valid("param");
                    const { userId } = c.req.valid("query");
        
                    const response = await fetchChartSchema({
                        chartId: id,
                        userId,
                    });
        
                    if (!response.ok) {
                        return c.json(response.error, 500);
                    }
        
                    const { ok: _, ...rest } = response;
        
                    return c.json(rest, 200);
    }
    )
    .get("/:id/table-data",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        zValidator("query", z.object({
                userId: z.string().nonempty(),
            })),
        async (c) => {
        const { id } = c.req.valid("param");
                    const { userId } = c.req.valid("query");
        
                    const response = await fetchChartData({
                        chartId: id,
                        userId,
                    });
        
                    if (!response.ok) {
                        return c.json(response.error, 500);
                    }
        
                    const { data } = response;
        
                    return c.json(data, 200);
    }
    )
    .get("/:id/visuals",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        async (c) => {
        const { id } = c.req.valid("param");
                    const response = await fetchChartAttribute(id, "visuals");
        
                    if (!response.ok) {
                        return c.json(response.error, 500);
                    }
        
                    return c.json(response.data, 200);
    }
    )
    .put("/:id/visuals",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        zValidator("json", ChartVisualSchema.Update),
        async (c) => {
        const { id } = c.req.valid("param");
                    const data = c.req.valid("json");
                    const response = await updateChartAttribute(id, "visuals", data);
        
                    if (!response.ok) {
                        return c.json(response.error, 500);
                    }
        
                    return c.json(response.chartId, 200);
    }
    )
    .get("/:id/typography",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        async (c) => {
        const { id } = c.req.valid("param");
                    const response = await fetchChartAttribute(id, "typography");
                    if (!response.ok) {
                        return c.json(response.error, 500);
                    }
                    return c.json(response.data, 200);
    }
    )
    .put("/:id/typography",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        zValidator("json", ChartTypographySchema.Update),
        async (c) => {
        const { id } = c.req.valid("param");
                    const data = c.req.valid("json");
                    const response = await updateChartAttribute(id, "typography", data);
                    if (!response.ok) {
                        return c.json(response.error, 500);
                    }
                    return c.json(response.chartId, 200);
    }
    )
    .get("/:id/box-model",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        async (c) => {
        const { id } = c.req.valid("param");
                    const response = await fetchChartAttribute(id, "boxModel");
                    if (!response.ok) {
                        return c.json(response.error, 500);
                    }
                    return c.json(response.data, 200);
    }
    )
    .put("/:id/box-model",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        zValidator("json", ChartBoxModelSchema.Update),
        async (c) => {
        const { id } = c.req.valid("param");
                    const data = c.req.valid("json");
                    const response = await updateChartAttribute(id, "boxModel", data);
                    if (!response.ok) {
                        return c.json(response.error, 500);
                    }
                    return c.json(response.chartId, 200);
    }
    )
    .get("/:id/colors",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        async (c) => {
        const { id } = c.req.valid("param");
                    const response = await fetchChartAttribute(id, "colors");
                    if (!response.ok) {
                        return c.json(response.error, 500);
                    }
                    return c.json(response.data, 200);
    }
    )
    .put("/:id/colors",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        zValidator("json", ChartColorSchema.Update),
        async (c) => {
        const { id } = c.req.valid("param");
                    const data = c.req.valid("json");
                    const response = await updateChartAttribute(id, "colors", data);
                    if (!response.ok) {
                        return c.json(response.error, 500);
                    }
                    return c.json(response.chartId, 200);
    }
    );

export default app;
