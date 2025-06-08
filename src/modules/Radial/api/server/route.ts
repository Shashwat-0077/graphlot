import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { authMiddleWare } from "@/modules/auth/middlewares/authMiddleware";
import { FullRadialUpdate } from "@/modules/Radial/schema";
import {
    fetchFullRadialChartById,
    fetchRadialChartById,
    fetchRadialChartsByCollection,
} from "@/modules/Radial/api/helper/fetch-radial-chart";
import { updateRadialChart } from "@/modules/Radial/api/helper/update-radial-chart";

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

const radialChartRoute = new Hono<{ Variables: AppVariables }>()

    // Get all radial charts by collection
    .get("/", zValidator("query", querySchema), async (c) => {
        const { collection_id } = c.req.valid("query");
        const result = await fetchRadialChartsByCollection(collection_id);

        if (!result.ok) {
            return c.json({ error: result.error }, 500);
        }

        return c.json({ charts: result.charts }, 200);
    })

    // Get radial chart by id
    .get("/:id", zValidator("param", paramSchema), async (c) => {
        const { id } = c.req.valid("param");
        const result = await fetchRadialChartById(id);

        if (!result.ok) {
            return c.json({ error: result.error }, 500);
        }

        return c.json({ chart: result.chart }, 200);
    })

    // Get full radial chart by id
    .get("/:id/full", zValidator("param", paramSchema), async (c) => {
        const { id } = c.req.valid("param");
        const result = await fetchFullRadialChartById(id);

        if (!result.ok) {
            return c.json({ error: result.error }, 500);
        }

        return c.json({ chart: result.chart }, 200);
    })

    // Update radial chart (auth required)
    .put(
        "/:id",
        authMiddleWare,
        zValidator("param", paramSchema),
        zValidator("json", FullRadialUpdate),
        async (c) => {
            const { id } = c.req.valid("param");
            const data = c.req.valid("json");

            const result = await updateRadialChart({ chartId: id, data });

            if (!result.ok) {
                return c.json({ error: result.error }, 500);
            }

            return c.json({ updated: true }, 200);
        }
    );

export default radialChartRoute;
