"charts/bar";
"hono-codegen";
"react-query-codegen";

import { z } from "zod";

import { defineRoute } from "@/utils"; // wherever you save it
import { fetchBarChartById } from "@/modules/chart-types/bar/api/handler/read";
import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import { updateBarChart } from "@/modules/chart-types/bar/api/handler/update";
import { BarChartSchema } from "@/modules/chart-types/bar/schema/types";

const barRouteConfigs = [
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
            const result = await fetchBarChartById(id);
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
            json: BarChartSchema.Update,
        },
        handler: async (c) => {
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
        },
    }),
];

export default barRouteConfigs;
