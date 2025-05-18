import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import {
    getAllGroups,
    getChartsInGroup,
    getFullChartsInGroup,
    getGroupWithId,
} from "@/modules/chartGroups/api/getOperations";
import { authMiddleWare } from "@/modules/auth/middlewares/authMiddleware";
import { updateGroup } from "@/modules/chartGroups/api/updateGroup";
import { createNewGroup } from "@/modules/chartGroups/api/createNewGroup";
import { ChartGroupSchema } from "@/modules/chartGroups/schema";
import { setChartsInGroup } from "@/modules/chartGroups/api/chartsAndGroupsOps";
import { deleteGroup } from "@/modules/chartGroups/api/deleteGroup";

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

            const response = await getAllGroups(collection_id);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            const { groups } = response;
            return c.json({ groups }, 200);
        }
    )
    .get(
        "/:group_id",
        zValidator(
            "param",
            z.object({
                group_id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { group_id } = c.req.valid("param");

            const response = await getGroupWithId(group_id);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            const { group } = response;
            return c.json({ group }, 200);
        }
    )
    .get(
        "/:group_id/charts",
        zValidator(
            "param",
            z.object({
                group_id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { group_id } = c.req.valid("param");
            const response = await getChartsInGroup(group_id);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            const { charts } = response;

            return c.json({ charts }, 200);
        }
    )
    .get(
        "/:group_id/charts/full",
        zValidator(
            "param",
            z.object({
                group_id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { group_id } = c.req.valid("param");
            const response = await getFullChartsInGroup(group_id);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            const { charts } = response;

            return c.json({ charts }, 200);
        }
    )
    .post(
        "/",
        authMiddleWare,
        zValidator(
            "json",
            z.object(
                ChartGroupSchema.Insert.extend({
                    chart_ids: z.array(z.string().nonempty()),
                }).shape
            )
        ),
        async (c) => {
            const data = c.req.valid("json");

            const response = await createNewGroup({
                name: data.name,
                collection_id: data.collection_id,
                layout_type: data.layout_type,
                chart_ids: data.chart_ids,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ group_id: response.group_id }, 200);
        }
    )
    .put(
        "/:group_id",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                group_id: z.string().nonempty(),
            })
        ),
        zValidator("json", z.object(ChartGroupSchema.Update.shape)),
        async (c) => {
            const { group_id } = c.req.valid("param");
            const data = c.req.valid("json");

            const response = await updateGroup({
                group_id,
                name: data.name,
                layout_type: data.layout_type,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ group_id: response.group_id }, 200);
        }
    )
    .put(
        "/:group_id/set-charts",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                group_id: z.string().nonempty(),
            })
        ),
        zValidator(
            "json",
            z.object({
                chart_ids: z.array(z.string().nonempty()),
            })
        ),
        async (c) => {
            const { group_id } = c.req.valid("param");
            const data = c.req.valid("json");
            const response = await setChartsInGroup(group_id, data.chart_ids);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json({ chart_ids: response.chart_ids }, 200);
        }
    )
    .delete(
        "/:group_id",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                group_id: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { group_id } = c.req.valid("param");
            const response = await deleteGroup(group_id);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json({ group_id: response.group_id }, 200);
        }
    );

export default app;
