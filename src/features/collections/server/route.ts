import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Collections } from "@/db/schema";

import { createCollection } from "../api/createCollection";
import { getAllCollections } from "../api/getAllCollections";

const app = new Hono()
    .get(
        "/:id",
        zValidator("param", z.object({ id: z.coerce.number().int() })),
        async (c) => {
            const { id } = c.req.valid("param");
            const [collection] = await db
                .select()
                .from(Collections)
                .where(eq(Collections.id, id));
            return c.json({ collection }, 200);
        }
    )
    .get("/all", async (c) => {
        const response = await getAllCollections();
        if (!response.ok) {
            return c.json({ error: response.error }, 400);
        }
        const { collections } = response;
        return c.json({ collections }, 200);
    })
    .post(
        "/create-collection",
        zValidator(
            "form",
            z.object({
                name: z.string().nonempty(),
                description: z.string().nonempty(),
            })
        ),
        async (c) => {
            const { name, description } = c.req.valid("form");
            const collectionId = await createCollection({
                name,
                description,
            });

            return c.json({ success: true, collectionId }, 200);
        }
    )
    .delete(
        "/delete-collection/:collectionId",
        zValidator(
            "param",
            z.object({
                collectionId: z.coerce.number().int(),
            })
        ),
        async (c) => {
            const { collectionId } = c.req.valid("param");
            await db
                .delete(Collections)
                .where(eq(Collections.id, collectionId));

            return c.json({ success: true }, 200);
        }
    );

export default app;
