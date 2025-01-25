import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleWare } from "@/features/auth/middlewares/authMiddleware";

import {
    getAllChartsWithCollectionId,
    getChartWithIdAndCollectionId,
} from "../api/getCharts";
import { CreateNewChart } from "../api/createNewChart";
import { DeleteChart } from "../api/deleteChart";
import { BasicChartSchema, ChartsTypes } from "../schema";
import {
    MoveChartBetweenCollections,
    UpdateChartExceptType,
    UpdateChartType,
} from "../api/updateChart";

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
    .get(
        "/:chartId",
        zValidator(
            "param",
            z.object({
                chartId: z.string().nonempty(),
            })
        ),
        zValidator(
            "query",
            z.object({
                collectionId: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { chartId } = c.req.valid("param");
            const { collectionId } = c.req.valid("query");

            const response = await getChartWithIdAndCollectionId({
                chartId,
                collectionId,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            const { chart } = response;

            return c.json({ chart }, 200);
        }
    )
    .post(
        "/create-chart",
        authMiddleWare,
        zValidator("form", BasicChartSchema.Insert),
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
    .patch(
        "/change-type/:chartId",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                chartId: z.string().nonempty(),
            })
        ),
        zValidator(
            "query",
            z.object({
                type: ChartsTypes,
            })
        ),
        async (c) => {
            const { chartId } = c.req.valid("param");
            const { type } = c.req.valid("query");
            const userId = c.get("userId");

            const response = await UpdateChartType({ userId, chartId, type });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ updated: true }, 200);
        }
    )
    .patch(
        "move-chart/:chartId",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                chartId: z.string().nonempty(),
            })
        ),
        zValidator(
            "query",
            z.object({
                newCollectionId: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { chartId } = c.req.valid("param");
            const { newCollectionId } = c.req.valid("query");
            const userId = c.get("userId");

            const response = await MoveChartBetweenCollections({
                userId,
                chartId,
                newCollectionId,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ moved: true }, 200);
        }
    )
    .put(
        "/:chartId",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                chartId: z.string().nonempty(),
            })
        ),
        zValidator("form", BasicChartSchema.Update),
        async (c) => {
            const { chartId } = c.req.valid("param");
            const newChart = c.req.valid("form");
            const userId = c.get("userId");

            const response = await UpdateChartExceptType({
                newChart,
                chartId,
                userId,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ updated: true }, 200);
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
