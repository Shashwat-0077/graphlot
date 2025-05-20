import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import {
    fetchFullRadarChartById,
    fetchRadarChartById,
    fetchRadarChartsByCollection,
} from "@/modules/Radar/api/helper/fetch-radar-chart";
import { authMiddleWare } from "@/modules/auth/middlewares/authMiddleware";
import { FullRadarUpdate } from "@/modules/Radar/schema";
import { updateRadarChart } from "@/modules/Radar/api/helper/update-radar-chart";

// App-scoped variables (injected by middleware)
type AppVariables = {
    userId: string;
};

// Zod schemas for validation
const querySchema = z.object({
    collection_id: z.string().nonempty(),
});

const paramSchema = z.object({
    id: z.string().nonempty(),
});

const radarChartRoute = new Hono<{ Variables: AppVariables }>()

    // Get all radar charts by collection
    .get("/", zValidator("query", querySchema), async (c) => {
        const { collection_id } = c.req.valid("query");
        const result = await fetchRadarChartsByCollection(collection_id);

        if (!result.ok) {
            return c.json({ error: result.error }, 500);
        }

        return c.json({ charts: result.charts }, 200);
    })

    // Get only the radar chart by id
    .get("/:id", zValidator("param", paramSchema), async (c) => {
        const { id } = c.req.valid("param");
        const result = await fetchRadarChartById(id);

        if (!result.ok) {
            return c.json({ error: result.error }, 500);
        }

        return c.json({ chart: result.chart }, 200);
    })

    // Get a full radar chart by ID
    .get("/:id/full", zValidator("param", paramSchema), async (c) => {
        const { id } = c.req.valid("param");
        const result = await fetchFullRadarChartById(id);

        if (!result.ok) {
            return c.json({ error: result.error }, 500);
        }

        return c.json({ chart: result.chart }, 200);
    })

    // Update a radar chart (auth required)
    .put(
        "/:id",
        authMiddleWare,
        zValidator("param", paramSchema),
        zValidator("json", FullRadarUpdate),
        async (c) => {
            const { id } = c.req.valid("param");
            const data = c.req.valid("json");

            const result = await updateRadarChart({ chartId: id, data });

            if (!result.ok) {
                return c.json({ error: result.error }, 500);
            }

            return c.json({ updated: true }, 200);
        }
    );

export default radarChartRoute;
