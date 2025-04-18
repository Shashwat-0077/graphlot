import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleWare } from "@/modules/auth/middlewares/authMiddleware";
import {
    getAllAreaChartsWithCollectionId,
    getAreaChartWithId,
} from "@/modules/Area/api/getAreaCharts";
import { updateAreaChart } from "@/modules/Area/api/updateAreaCharts";
import { AreaSchema } from "@/modules/Area/schema";

type variables = {
    userId: string;
};

const app = new Hono<{ Variables: variables }>()
    .get(
        "/all",
        zValidator(
            "query",
            z.object({
                collection_id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { collection_id } = c.req.valid("query");

            const response =
                await getAllAreaChartsWithCollectionId(collection_id);

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            const { charts } = response;
            return c.json({ charts }, 200);
        }
    )
    .get(
        "/:chart_id",
        zValidator(
            "param",
            z.object({
                chart_id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { chart_id } = c.req.valid("param");

            const response = await getAreaChartWithId({
                chart_id,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            const { chart } = response;

            return c.json({ chart }, 200);
        }
    )
    .put(
        "/:chart_id",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                chart_id: z.string().nonempty(),
            })
        ),
        zValidator("form", AreaSchema.Update),
        async (c) => {
            const { chart_id } = c.req.valid("param");
            const data = c.req.valid("form");

            const response = await updateAreaChart({
                chart_id,
                data,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ updated: true }, 200);
        }
    );

export default app;
