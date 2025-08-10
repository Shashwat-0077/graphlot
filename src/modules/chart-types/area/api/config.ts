"charts/area";
"hono-codegen";
"react-query-codegen";

import { z } from "zod";

import { defineRoute } from "@/utils/defineRoute"; // wherever you save it
import { fetchAreaChartById } from "@/modules/chart-types/area/api/handler/read";
import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import { updateAreaChart } from "@/modules/chart-types/area/api/handler/update";
import { AreaChartSchema } from "@/modules/chart-types/area/schema/types";

const areaRouteConfigs = [
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
            const result = await fetchAreaChartById(id);
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
            json: AreaChartSchema.Update,
        },
        handler: async (c) => {
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
        },
    }),
];

export default areaRouteConfigs;
