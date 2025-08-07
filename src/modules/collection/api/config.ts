"collections";
"hono-codegen";
"react-query-codegen";

import z from "zod";

import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import {
    fetchAllCollections,
    fetchCollectionById,
} from "@/modules/collection/handlers/read";
import { Variables } from "@/modules/collection/api/variables";
import { createCollection } from "@/modules/collection/handlers/create";
import { updateCollection } from "@/modules/collection/handlers/update";
import { CollectionSchema } from "@/modules/collection/schema/types";
import { deleteCollection } from "@/modules/collection/handlers/delete";
import { RouteConfig } from "@/types";

export const routeConfigs: RouteConfig<Variables>[] = [
    {
        path: "/all",
        method: "GET",
        middlewares: [authMiddleWare],
        validators: {},
        handler: async (c) => {
            const userId = c.get("userId");
            const response = await fetchAllCollections(userId);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            const { collections } = response;
            return c.json({ collections }, 200);
        },
    },
    {
        path: "/:id",
        method: "GET",
        middlewares: [authMiddleWare],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");

            const response = await fetchCollectionById(id);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            const { collection } = response;
            return c.json({ collection }, 200);
        },
    } as RouteConfig<
        Variables,
        z.ZodObject<{ id: z.ZodString }>,
        z.ZodObject<Record<string, never>>,
        z.ZodObject<Record<string, never>>
    >,
    {
        path: "/create",
        method: "POST",
        middlewares: [authMiddleWare],
        validators: {
            json: CollectionSchema.Insert,
        },
        handler: async (c) => {
            const userId = c.get("userId");
            const { name, description } = c.req.valid("json");

            const response = await createCollection({
                userId: userId,
                newCollection: { name, description },
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            const { collection } = response;
            return c.json({ collection }, 200);
        },
    } as RouteConfig<
        Variables,
        z.ZodObject<Record<string, never>>,
        z.ZodObject<Record<string, never>>,
        typeof CollectionSchema.Insert
    >,
    {
        path: "/:id",
        method: "PUT",
        middlewares: [authMiddleWare],
        validators: {
            params: z.object({ id: z.string().nonempty() }),
            json: CollectionSchema.Update,
        },
        handler: async (c) => {
            const userId = c.get("userId");
            const { id } = c.req.valid("param");
            const body = c.req.valid("json");

            const response = await updateCollection({
                userId: userId,
                collectionId: id,
                newCollection: body,
            });
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json({ collectionId: response.collectionId }, 200);
        },
    } as RouteConfig<
        Variables,
        z.ZodObject<{ id: z.ZodString }>,
        z.ZodObject<Record<string, never>>,
        typeof CollectionSchema.Update
    >,
    {
        path: "/:id",
        method: "DELETE",
        middlewares: [authMiddleWare],
        validators: {
            params: z.object({ id: z.string().nonempty() }),
        },
        handler: async (c) => {
            const { id } = c.req.valid("param");
            const userId = c.get("userId");

            const response = await deleteCollection({
                userId,
                collectionId: id,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json(
                { deleted: true, collectionId: response.collectionId },
                200
            );
        },
    } as RouteConfig<
        Variables,
        z.ZodObject<{ id: z.ZodString }>,
        z.ZodObject<Record<string, never>>,
        z.ZodObject<Record<string, never>>
    >,
];
