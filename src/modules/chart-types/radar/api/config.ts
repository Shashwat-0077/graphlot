"charts/radar";
"hono-codegen";
"react-query-codegen";

import { z } from "zod";

import { defineRoute } from "@/utils"; // wherever you save it
import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import { fetchRadarChartById } from "@/modules/chart-types/radar/api/handlers/read";
import { RadarChartSchema } from "@/modules/chart-types/radar/schema/types";
import { updateRadarChart } from "@/modules/chart-types/radar/api/handlers/update";

const radarRouteConfigs = [
    defineRoute({
        path: "/:id",
        method: "GET",
        middlewares: [],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const result = await fetchRadarChartById(id);
            if (!result.ok) {
                return c.json({ error: result.error }, 500);
            }
            return c.json({ chart: result.chart }, 200);
        },
    }),

    defineRoute({
        path: "/:id",
        method: "PUT",
        middlewares: [authMiddleWare],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
            json: RadarChartSchema.Update,
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const newChart = c.req.valid("json");

            const result = await updateRadarChart({
                chartId: id,
                data: newChart,
            });
            if (!result.ok) {
                return c.json({ error: result.error }, 500);
            }
            return c.json({ updated: true, id: result.chartId }, 200);
        },
    }),
];

export default radarRouteConfigs;
