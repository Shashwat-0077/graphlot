import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleWare } from "@/features/auth/middlewares/authMiddleware";

import { getAllChartsWithCollectionId } from "../api/getAllChartsWithCollectionId";
import { CreateNewChart } from "../api/createNewChart";
import { DeleteChart } from "../api/deleteChart";

import { InsertChart } from "@/db/types";

type variables = {
    userId: string;
};

const app = new Hono<{ Variables: variables }>()
    .get(
        "/all",
        zValidator(
            "query",
            z.object({
                collectionId: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { collectionId } = c.req.valid("query");

            const response = await getAllChartsWithCollectionId(collectionId);

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            const { charts } = response;
            return c.json({ charts }, 200);
        }
    )
    .post(
        "/create-chart",
        authMiddleWare,
        zValidator("form", InsertChart),
        async (c) => {
            const chart = c.req.valid("form");

            const response = await CreateNewChart({ chart });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            const { newChartId } = response;
            return c.json({ newChartId }, 200);
        }
    )
    .delete(
        "/:chartId",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                chartId: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { chartId } = c.req.valid("param");
            const userId = c.get("userId");

            const response = await DeleteChart({ userId, chartId });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ deleted: true }, 200);
        }
    );

export default app;
