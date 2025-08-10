import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { fetchBarChartById } from "@/modules/chart-types/bar/api/handler/read";
import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import { updateBarChart } from "@/modules/chart-types/bar/api/handler/update";
import { BarChartSchema } from "@/modules/chart-types/bar/schema/types";

const app = new Hono()
    .get("/:id",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        async (c) => {
        const { id } = c.req.valid("param");
                    const result = await fetchBarChartById(id);
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
        zValidator("json", BarChartSchema.Update),
        async (c) => {
        const { id } = c.req.valid("param");
                    const newChart = c.req.valid("json");
        
                    const result = await updateBarChart({
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
