"charts/heatmap";
"hono-codegen";
"react-query-codegen";

import { z } from "zod";

import { defineRoute } from "@/utils"; // wherever you save it
import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import { fetchHeatmapById } from "@/modules/chart-types/heatmap/api/handlers/read";
import { updateHeatmap } from "@/modules/chart-types/heatmap/api/handlers/update";
import { HeatmapSchema } from "@/modules/chart-types/heatmap/schema/types";
import { getQueryClient } from "@/lib/query-client";

const heatmapRouteConfigs = [
    defineRoute({
        path: "/:id",
        method: "GET",
        middlewares: [],
        queryKey: ["heatmap-chart"],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const result = await fetchHeatmapById(id);
            if (!result.ok) {
                return c.json(result.error, 500);
            }
            return c.json(result.chart, 200);
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
            json: HeatmapSchema.Update,
        },
        handler: async (c) => {
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
        },
        includeOnSuccess: () => {
            const queryClient = getQueryClient();
            queryClient.invalidateQueries({
                queryKey: ["heatmap-chart"],
            });
        },
    }),
];

export default heatmapRouteConfigs;
