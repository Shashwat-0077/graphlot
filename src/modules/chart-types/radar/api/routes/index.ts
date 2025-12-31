import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import { fetchRadarChartById } from "@/modules/chart-types/radar/api/handlers/read";
import { RadarChartSchema } from "@/modules/chart-types/radar/schema/types";
import { updateRadarChart } from "@/modules/chart-types/radar/api/handlers/update";

const app = new Hono()
    .get("/:id",
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        async (c) => {
        const { id } = c.req.valid("param");
                    const result = await fetchRadarChartById(id);
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
        zValidator("json", RadarChartSchema.Update),
        async (c) => {
        const { id } = c.req.valid("param");
                    const newChart = c.req.valid("json");
        
                    const result = await updateRadarChart({
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
