"charts/radial";
"hono-codegen";
"react-query-codegen";

import { z } from "zod";

import { defineRoute } from "@/utils"; // wherever you save it
import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import { fetchRadialChartById } from "@/modules/chart-types/radial/api/handlers/read";
import { RadialChartSchema } from "@/modules/chart-types/radial/schema/types";
import { updateRadialChart } from "@/modules/chart-types/radial/api/handlers/update";
import { getQueryClient } from "@/lib/query-client";

const radialRouteConfigs = [
    defineRoute({
        path: "/:id",
        method: "GET",
        middlewares: [],
        queryKey: ["radial-chart"],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const result = await fetchRadialChartById(id);
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
            json: RadialChartSchema.Update,
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const newChart = c.req.valid("json");

            const result = await updateRadialChart({
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
                queryKey: ["radial-chart"],
            });
        },
    }),
];

export default radialRouteConfigs;
