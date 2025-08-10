import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { fetchAreaChartById } from "@/modules/chart-types/area/api/handler/read";
import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import { updateAreaChart } from "@/modules/chart-types/area/api/handler/update";
import { AreaChartSchema } from "@/modules/chart-types/area/schema/types";

const app = new Hono()
    .get("/:id",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        async (c) => {
        const { id } = c.req.valid("param");
                    const result = await fetchAreaChartById(id);
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
        zValidator("json", AreaChartSchema.Update),
        async (c) => {
        const { id } = c.req.valid("param");
                    const newChart = c.req.valid("json");
        
                    const result = await updateAreaChart({
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
