import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { authMiddleWare } from "@/modules/auth/middlewares/authMiddleware";
import {
    fetchAreaChartById,
    fetchAreaChartsByCollection,
    fetchFullAreaChartById,
} from "@/modules/Area/api/helper/fetch-area-charts";
import { updateAreaChart } from "@/modules/Area/api/helper/update-area-charts";
import { FullAreaUpdate } from "@/modules/Area/schema";

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

const areaChartRoute = new Hono<{ Variables: AppVariables }>()

    // Get all area charts by collection
    .get("/", zValidator("query", querySchema), async (c) => {
        const { collection_id } = c.req.valid("query");
        const result = await fetchAreaChartsByCollection(collection_id);

        if (!result.ok) {
            return c.json({ error: result.error }, 500);
        }

        return c.json({ charts: result.charts }, 200);
    })
    // Get only the area chart by id
    .get("/:id", zValidator("param", paramSchema), async (c) => {
        const { id } = c.req.valid("param");
        const result = await fetchAreaChartById(id);
        if (!result.ok) {
            return c.json({ error: result.error }, 500);
        }
        return c.json({ chart: result.chart }, 200);
    })

    // Get a single area chart by ID
    .get("/:id/full", zValidator("param", paramSchema), async (c) => {
        const { id } = c.req.valid("param");
        const result = await fetchFullAreaChartById(id);

        if (!result.ok) {
            return c.json({ error: result.error }, 500);
        }

        return c.json({ chart: result.chart }, 200);
    })

    // Update an area chart (auth required)
    .put(
        "/:id",
        authMiddleWare,
        zValidator("param", paramSchema),
        zValidator("json", FullAreaUpdate),
        async (c) => {
            const { id } = c.req.valid("param");
            const data = c.req.valid("json");

            const result = await updateAreaChart({ chartId: id, data });

            if (!result.ok) {
                return c.json({ error: result.error }, 500);
            }

            return c.json({ updated: true }, 200);
        }
    );

export default areaChartRoute;
