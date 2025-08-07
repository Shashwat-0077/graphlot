import { z } from "zod";

import { defineRoute } from "@/utils/defineRoute"; // wherever you save it

export const areaRouteConfigs = [
    defineRoute({
        path: "/",
        method: "GET",
        middlewares: [],
        validators: {
            query: z.object({
                collection_id: z.string().nonempty(),
            }),
        },
        handler: async (c) => {
            const { collection_id } = c.req.valid("query");
            const result = await fetchAreaChartsByCollection(collection_id);
            if (!result.ok) {
                return c.json({ error: result.error }, 500);
            }
            return c.json({ charts: result.charts }, 200);
        },
    }),

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
];
