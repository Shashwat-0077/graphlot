import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import { fetchHeatmapById } from "@/modules/chart-types/heatmap/api/handlers/read";
import { updateHeatmap } from "@/modules/chart-types/heatmap/api/handlers/update";
import { HeatmapSchema } from "@/modules/chart-types/heatmap/schema/types";

const app = new Hono()
    .get("/:id",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        async (c) => {
        const { id } = c.req.valid("param");
                    const result = await fetchHeatmapById(id);
                    if (!result.ok) {
                        return c.json(result.error, 500);
                    }
                    return c.json(result.chart, 200);
    }
    )
    .put("/:id",
        authMiddleWare,
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        zValidator("json", HeatmapSchema.Update),
        async (c) => {
        const { id } = c.req.valid("param");
                    const newChart = c.req.valid("json");
        
                    const result = await updateHeatmap({
                        chartId: id,
                        data: newChart,
                    });
                    if (!result.ok) {
                        return c.json(result.error, 500);
                    }
                    return c.json(result.chartId, 200);
    }
    );

export default app;
