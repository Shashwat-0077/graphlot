import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import { fetchRadialChartById } from "@/modules/chart-types/radial/api/handlers/read";
import { RadialChartSchema } from "@/modules/chart-types/radial/schema/types";
import { updateRadialChart } from "@/modules/chart-types/radial/api/handlers/update";

const app = new Hono()
    .get("/:id",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        async (c) => {
        const { id } = c.req.valid("param");
                    const result = await fetchRadialChartById(id);
                    if (!result.ok) {
                        return c.json({ error: result.error }, 500);
                    }
                    return c.json({ chart: result.chart }, 200);
    }
    )
    .put("/:id",
        authMiddleWare,
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        zValidator("json", RadialChartSchema.Update),
        async (c) => {
        const { id } = c.req.valid("param");
                    const newChart = c.req.valid("json");
        
                    const result = await updateRadialChart({
                        chartId: id,
                        data: newChart,
                    });
                    if (!result.ok) {
                        return c.json({ error: result.error }, 500);
                    }
                    return c.json({ updated: true, id: result.chartId }, 200);
    }
    );

export default app;
