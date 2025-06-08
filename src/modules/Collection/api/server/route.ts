import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { authMiddleWare } from "@/modules/auth/middlewares/authMiddleware";
import { CollectionSchema } from "@/modules/Collection/schema";
import { createCollection } from "@/modules/Collection/api/helper/create-collection";
import {
    fetchAllCollections,
    fetchCollectionById,
} from "@/modules/Collection/api/helper/fetch-collection";
import { updateCollection } from "@/modules/Collection/api/helper/update-collection";
import { deleteCollection } from "@/modules/Collection/api/helper/delete-collection";

type variables = {
    userId: string;
};

const app = new Hono<{ Variables: variables }>()
    .get("/all", authMiddleWare, async (c) => {
        const userId = c.get("userId");
        const response = await fetchAllCollections(userId);
        if (!response.ok) {
            return c.json({ error: response.error }, 500);
        }
        const { collections } = response;
        return c.json({ collections }, 200);
    })
    .get(
        "/:id",
        zValidator("param", z.object({ id: z.string().nonempty() })),
        async (c) => {
            const { id } = c.req.valid("param");
            const response = await fetchCollectionById(id);
            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }
            const { collection } = response;
            return c.json({ collection }, 200);
        }
    )
    .post(
        "/create-collection",
        authMiddleWare,
        zValidator("json", CollectionSchema.Insert),
        async (c) => {
            const userId = c.get("userId");
            const { name, description } = c.req.valid("json");

            const response = await createCollection({
                userId: userId,
                newCollection: {
                    name,
                    description,
                },
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            const { collection } = response;

            return c.json(
                {
                    collection,
                },
                200
            );
        }
    )
    .put(
        "/:id",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                id: z.string().nonempty(),
            })
        ),
        zValidator("json", CollectionSchema.Update),
        async (c) => {
            const { id } = c.req.valid("param");
            const newCollection = c.req.valid("json");

            const userId = c.get("userId");

            const response = await updateCollection({
                userId,
                collectionId: id,
                newCollection,
            });

            if (!response.ok) {
                return c.json({ error: response.error }, 500);
            }

            return c.json(
                { updated: true, collectionId: response.collectionId },
                200
            );
        }
    )
    .delete(
        "/:id",
        zValidator(
            "param",
            z.object({
                id: z.string().nonempty(),
            })
        ),
        async (c) => {
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
        }
    );

export default app;
