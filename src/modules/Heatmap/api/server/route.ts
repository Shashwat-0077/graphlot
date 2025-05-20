import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { authMiddleWare } from "@/modules/auth/middlewares/authMiddleware";
import {
    fetchFullHeatmapById,
    fetchHeatmapById,
    fetchHeatmapsByCollection,
} from "@/modules/Heatmap/api/helper/fetch-heatmap";
import { FullHeatmapSchema } from "@/modules/Heatmap/schema";
import { updateHeatmap } from "@/modules/Heatmap/api/helper/update-heatmap";

type AppVariables = {
    userId: string;
};

const querySchema = z.object({
    collection_id: z.string().nonempty(),
});

const paramSchema = z.object({
    id: z.string().nonempty(),
});

const heatmapChartRoute = new Hono<{ Variables: AppVariables }>()
    // All heatmaps in a collection
    .get("/", zValidator("query", querySchema), async (c) => {
        const { collection_id } = c.req.valid("query");
        const result = await fetchHeatmapsByCollection(collection_id);

        if (!result.ok) {
            return c.json({ error: result.error }, 500);
        }
        return c.json({ charts: result.charts }, 200);
    })

    // Single heatmap by ID (basic)
    .get("/:id", zValidator("param", paramSchema), async (c) => {
        const { id } = c.req.valid("param");
        const result = await fetchHeatmapById(id);

        if (!result.ok) {
            return c.json({ error: result.error }, 500);
        }
        return c.json({ chart: result.chart }, 200);
    })

    // Single heatmap by ID (full—data + metadata)
    .get("/:id/full", zValidator("param", paramSchema), async (c) => {
        const { id } = c.req.valid("param");
        const result = await fetchFullHeatmapById(id);

        if (!result.ok) {
            return c.json({ error: result.error }, 500);
        }
        return c.json({ chart: result.chart }, 200);
    })

    // Update heatmap (auth required)
    .put(
        "/:id",
        authMiddleWare,
        zValidator("param", paramSchema),
        zValidator("json", FullHeatmapSchema.Update),
        async (c) => {
            const { id } = c.req.valid("param");
            const data = c.req.valid("json");

            const result = await updateHeatmap({ chartId: id, data });

            if (!result.ok) {
                return c.json({ error: result.error }, 500);
            }
            return c.json({ updated: true }, 200);
        }
    );

export default heatmapChartRoute;
