import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";

import { authMiddleWare } from "@/modules/auth/middlewares/authMiddleware";
import {
    getAllCollections,
    getCollectionById,
} from "@/modules/Collection/api/getCollections";
import { CollectionSchema } from "@/modules/Collection/schema";
import { createCollection } from "@/modules/Collection/api/createCollection";
import UpdateCollection from "@/modules/Collection/api/updateCollection";
import { DeleteCollection } from "@/modules/Collection/api/deleteCollection";

type variables = {
    userId: string;
};

const app = new Hono<{ Variables: variables }>()
    .get("/all", authMiddleWare, async (c) => {
        const userId = c.get("userId");
        const response = await getAllCollections({ userId });
        if (!response.ok) {
            throw new HTTPException(500, {
                res: c.json({ error: response.error }, 500),
            });
        }
        const { collections } = response;
        return c.json({ collections }, 200);
    })
    .get(
        "/:id",
        zValidator("param", z.object({ id: z.string().nonempty() })),
        async (c) => {
            const { id } = c.req.valid("param");
            const response = await getCollectionById(id);
            if (!response.ok) {
                throw new HTTPException(500, {
                    res: c.json({ error: response.error }, 500),
                });
            }
            const { collection } = response;
            return c.json({ collection }, 200);
        }
    )
    .post(
        "/create-collection",
        authMiddleWare,
        zValidator("form", CollectionSchema.Insert),
        async (c) => {
            const userId = c.get("userId");
            const { name, description } = c.req.valid("form");

            const response = await createCollection({
                userId: userId,
                newCollection: {
                    name,
                    description,
                },
            });

            if (!response.ok) {
                return c.json(
                    { error: response.error, field: response.field },
                    500
                );
            }

            const { newCollection } = response;

            return c.json(
                {
                    newCollection,
                },
                200
            );
        }
    )
    .put(
        "/:collectionId",
        authMiddleWare,
        zValidator(
            "param",
            z.object({
                collectionId: z.string().nonempty(),
            })
        ),
        zValidator("form", CollectionSchema.Update),
        async (c) => {
            const { collectionId } = c.req.valid("param");
            const newCollection = c.req.valid("form");

            const userId = c.get("userId");

            const response = await UpdateCollection({
                userId,
                collectionId,
                newCollection,
            });

            if (!response.ok) {
                throw new HTTPException(500, {
                    res: c.json({ error: response.error }, 500),
                });
            }

            return c.json({ updated: true }, 200);
        }
    )
    .delete(
        "/:collectionId",
        zValidator(
            "param",
            z.object({
                collectionId: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { collectionId } = c.req.valid("param");
            const userId = c.get("userId");

            const response = await DeleteCollection({ userId, collectionId });

            if (!response.ok) {
                throw new HTTPException(500, {
                    res: c.json({ error: response.error }, 500),
                });
            }

            return c.json({ deleted: true }, 200);
        }
    );

export default app;
