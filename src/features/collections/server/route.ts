import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "@/db";
import { Collections } from "@/db/schema";
import { authMiddleWare } from "@/features/auth/middlewares/authMiddleware";

import { createCollection } from "../api/createCollection";
import { getAllCollections } from "../api/getAllCollections";
import { DeleteCollection } from "../api/deleteCollection";

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
            const [collection] = await db
                .select()
                .from(Collections)
                .where(eq(Collections.id, id));
            return c.json({ collection }, 200);
        }
    )
    .post(
        "/create-collection",
        authMiddleWare,
        zValidator(
            "form",
            z.object({
                name: z.string().nonempty(),
                description: z.string().nonempty(),
            })
        ),
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
                throw new HTTPException(500, {
                    res: c.json({ error: response.error }, 500),
                });
            }

            const { newCollectionId } = response;

            return c.json({ newCollectionId }, 200);
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
