"collections";
"hono-codegen";
"react-query-codegen";

import { z } from "zod";

import { defineRoute, defineRouteWithVariables } from "@/utils/defineRoute";
import { CollectionSchema } from "@/modules/collection/schema/types";
import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import {
    fetchAllCollections,
    fetchCollectionById,
} from "@/modules/collection/api/handlers/read";
import { createCollection } from "@/modules/collection/api/handlers/create";
import { updateCollection } from "@/modules/collection/api/handlers/update";
import { deleteCollection } from "@/modules/collection/api/handlers/delete";
import { Variables } from "@/modules/collection/api/variables";

const collectionRouteConfigs = [
    defineRouteWithVariables<Variables>()({
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
            return c.json(response.collections, 200);
        },
    }),

    defineRoute({
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
            return c.json(response.collection, 200);
        },
    }),

    defineRouteWithVariables<Variables>()({
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
                userId,
                newCollection: { name, description },
            });
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json(response.collection, 200);
        },
    }),

    defineRouteWithVariables<Variables>()({
        path: "/:id",
        method: "PUT",
        middlewares: [authMiddleWare],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
            json: CollectionSchema.Update,
        },
        handler: async (c) => {
            const userId = c.get("userId");
            const { id } = c.req.valid("param");
            const body = c.req.valid("json");
            const response = await updateCollection({
                userId,
                collectionId: id,
                newCollection: body,
            });
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json(response.collectionId, 200);
        },
    }),

    defineRouteWithVariables<Variables>()({
        path: "/:id",
        method: "DELETE",
        middlewares: [authMiddleWare],
        validators: {
            params: z.object({
                id: z.string().nonempty(),
            }),
        },
        handler: async (c) => {
            const userId = c.get("userId");
            const { id } = c.req.valid("param");
            const response = await deleteCollection({
                userId,
                collectionId: id,
            });
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            return c.json(response.collectionId, 200);
        },
    }),
];

export default collectionRouteConfigs;
