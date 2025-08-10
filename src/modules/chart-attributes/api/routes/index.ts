import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { fetchChartAttribute, fetchChartMetadata } from "@/modules/chart-attributes/api/handler/read";
import { updateChartAttribute, updateChartMetadata } from "@/modules/chart-attributes/api/handler/update";
import { ChartBoxModelSchema, ChartColorSchema, ChartMetadataSchema, ChartTypographySchema, ChartVisualSchema } from "@/modules/chart-attributes/schema/types";
import { deleteChart } from "@/modules/chart-attributes/api/handler/delete";

const app = new Hono()
    .get("/:id",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        async (c) => {
        const { id } = c.req.valid("param");
                    const response = await fetchChartMetadata(id);
        
                    if (!response.ok) {
                        return c.json({ error: response.error });
                    }
                    return c.json({ chart: response.metadata });
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
                        return c.json({ error: response.error });
                    }
        
                    return c.json({ chartId: response.chartId });
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
                        return c.json({ error: response.error });
                    }
                    return c.json({ chartId: response.chartId });
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
                        return c.json({ error: response.error });
                    }
        
                    return c.json({ visuals: response.data });
    }
    )
    .post("/:id/visuals",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        zValidator("json", ChartVisualSchema.Update),
        async (c) => {
        const { id } = c.req.valid("param");
                    const data = c.req.valid("json");
                    const response = await updateChartAttribute(id, "visuals", data);
        
                    if (!response.ok) {
                        return c.json({ error: response.error });
                    }
        
                    return c.json({ chartId: response.chartId });
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
                        return c.json({ error: response.error });
                    }
                    return c.json({ typography: response.data });
    }
    )
    .post("/:id/typography",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        zValidator("json", ChartTypographySchema.Update),
        async (c) => {
        const { id } = c.req.valid("param");
                    const data = c.req.valid("json");
                    const response = await updateChartAttribute(id, "typography", data);
                    if (!response.ok) {
                        return c.json({ error: response.error });
                    }
                    return c.json({ chartId: response.chartId });
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
                        return c.json({ error: response.error });
                    }
                    return c.json({ boxModel: response.data });
    }
    )
    .post("/:id/box-model",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        zValidator("json", ChartBoxModelSchema.Update),
        async (c) => {
        const { id } = c.req.valid("param");
                    const data = c.req.valid("json");
                    const response = await updateChartAttribute(id, "boxModel", data);
                    if (!response.ok) {
                        return c.json({ error: response.error });
                    }
                    return c.json({ chartId: response.chartId });
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
                        return c.json({ error: response.error });
                    }
                    return c.json({ colors: response.data });
    }
    )
    .post("/:id/colors",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        zValidator("json", ChartColorSchema.Update),
        async (c) => {
        const { id } = c.req.valid("param");
                    const data = c.req.valid("json");
                    const response = await updateChartAttribute(id, "colors", data);
                    if (!response.ok) {
                        return c.json({ error: response.error });
                    }
                    return c.json({ chartId: response.chartId });
    }
    );

export default app;
