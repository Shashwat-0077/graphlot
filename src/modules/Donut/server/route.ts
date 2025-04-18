import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleWare } from "@/modules/auth/middlewares/authMiddleware";
import {
    getAllDonutChartsWithCollectionId,
    getDonutChartWithId,
} from "@/modules/Donut/api/getDonutCharts";
import { updateDonutChart } from "@/modules/Donut/api/updateDonutCharts";
import { DonutSchema } from "@/modules/Donut/schema";

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
                await getAllDonutChartsWithCollectionId(collection_id);

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

            const response = await getDonutChartWithId({
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
        zValidator("form", DonutSchema.Update),
        async (c) => {
            const { chart_id } = c.req.valid("param");
            const data = c.req.valid("form");

            const response = await updateDonutChart({
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
