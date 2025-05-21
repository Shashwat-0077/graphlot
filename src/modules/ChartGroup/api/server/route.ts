import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { authMiddleWare } from "@/modules/auth/middlewares/authMiddleware";
import {
    fetchAllGroups,
    fetchChartsInGroupsById,
    fetchFullChartsInGroupById,
    fetchGroupWithId,
} from "@/modules/ChartGroup/api/helper/fetch-groups";
import { ChartGroupSchema } from "@/modules/ChartGroup/schema";
import { createNewGroup } from "@/modules/ChartGroup/api/helper/create-new-group";
import { updateGroup } from "@/modules/ChartGroup/api/helper/update-groups";
import { setChartsInGroup } from "@/modules/ChartGroup/api/helper/set-charts-in-group";
import { deleteGroup } from "@/modules/ChartGroup/api/helper/delete-groups";

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

            const response = await fetchAllGroups(collectionId);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            const { groups } = response;
            return c.json({ groups }, 200);
        }
    )
    .get(
        "/:groupId",
        zValidator(
            "param",
            z.object({
                groupId: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { groupId } = c.req.valid("param");

            const response = await fetchGroupWithId(groupId);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            const { group } = response;
            return c.json({ group }, 200);
        }
    )
    .get(
        "/:groupId/charts",
        zValidator(
            "param",
            z.object({
                groupId: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { groupId } = c.req.valid("param");
            const response = await fetchChartsInGroupsById(groupId);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            const { charts } = response;

            return c.json({ charts }, 200);
        }
    )
    .get(
        "/:groupId/charts/full",
        zValidator(
            "param",
            z.object({
                groupId: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { groupId } = c.req.valid("param");
            const response = await fetchFullChartsInGroupById(groupId);
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
                    chartIds: z.array(z.string().nonempty()),
                }).shape
            )
        ),
        async (c) => {
            const data = c.req.valid("json");

            const response = await createNewGroup({
                name: data.name,
                collectionId: data.collectionId,
                layoutType: data.layoutType,
                chartIds: data.chartIds,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ groupId: response.groupId }, 200);
        }
    )
    .put(
        "/:groupId",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                groupId: z.string().nonempty(),
            })
        ),
        zValidator("json", z.object(ChartGroupSchema.Update.shape)),
        async (c) => {
            const { groupId } = c.req.valid("param");
            const data = c.req.valid("json");

            const response = await updateGroup({
                groupId,
                name: data.name,
                layoutType: data.layoutType,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ group_id: response.groupId }, 200);
        }
    )
    .put(
        "/:groupId/set-charts",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                groupId: z.string().nonempty(),
            })
        ),
        zValidator(
            "json",
            z.object({
                chartIds: z.array(z.string().nonempty()),
            })
        ),
        async (c) => {
            const { groupId } = c.req.valid("param");
            const data = c.req.valid("json");
            const response = await setChartsInGroup(groupId, data.chartIds);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json({ chart_ids: response.chartIds }, 200);
        }
    )
    .delete(
        "/:groupId",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                groupId: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { groupId } = c.req.valid("param");
            const response = await deleteGroup(groupId);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json({ group_id: response.group_id }, 200);
        }
    );

export default app;
