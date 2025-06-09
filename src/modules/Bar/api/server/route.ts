import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { authMiddleWare } from "@/modules/auth/middlewares/authMiddleware";
import {
    fetchBarChartById,
    fetchBarChartsByCollection,
    fetchFullBarChartById,
} from "@/modules/Bar/api/helpers/fetch-bar-charts";
import { FullBarUpdate } from "@/modules/Bar/schema";
import { updateBarChart } from "@/modules/Bar/api/helpers/update-bar-charts";

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

const barChartRoute = new Hono<{ Variables: AppVariables }>()

    // Get all bar charts by collection
    .get("/", zValidator("query", querySchema), async (c) => {
        const { collection_id } = c.req.valid("query");
        const result = await fetchBarChartsByCollection(collection_id);

        if (!result.ok) {
            return c.json({ error: result.error }, 500);
        }

        return c.json({ charts: result.charts }, 200);
    })
    // Get only the bar chart by id
    .get("/:id", zValidator("param", paramSchema), async (c) => {
        const { id } = c.req.valid("param");
        const result = await fetchBarChartById(id);
        if (!result.ok) {
            return c.json({ error: result.error }, 500);
        }
        return c.json({ chart: result.chart }, 200);
    })

    // Get a single bar chart by ID
    .get("/:id/full", zValidator("param", paramSchema), async (c) => {
        const { id } = c.req.valid("param");
        const result = await fetchFullBarChartById(id);

        if (!result.ok) {
            return c.json({ error: result.error }, 500);
        }

        return c.json({ chart: result.chart }, 200);
    })

    // Update an bar chart (auth required)
    .put(
        "/:id",
        authMiddleWare,
        zValidator("param", paramSchema),
        zValidator("json", FullBarUpdate),
        async (c) => {
            const { id } = c.req.valid("param");
            const data = c.req.valid("json");

            const result = await updateBarChart({ chartId: id, data });

            if (!result.ok) {
                return c.json({ error: result.error }, 500);
            }

            return c.json({ updated: true }, 200);
        }
    );

export default barChartRoute;
