import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { CollectionSchema } from "@/modules/collection/schema/types";
import { authMiddleWare } from "@/modules/auth/middlewares/auth-middleware";
import { fetchAllCollections, fetchCollectionById } from "@/modules/collection/api/handlers/read";
import { createCollection } from "@/modules/collection/api/handlers/create";
import { updateCollection } from "@/modules/collection/api/handlers/update";
import { deleteCollection } from "@/modules/collection/api/handlers/delete";
import { Variables } from "@/modules/collection/api/variables";

const app = new Hono<{ Variables: Variables }>()
    .get("/all",
        authMiddleWare,
        async (c) => {
        const userId = c.get("userId");
                    const response = await fetchAllCollections(userId);
                    if (!response.ok) {
                        return c.json({ error: response.error }, 500);
                    }
                    return c.json(response.collections, 200);
    }
    )
    .get("/:id",
        authMiddleWare,
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        async (c) => {
        const { id } = c.req.valid("param");
                    const response = await fetchCollectionById(id);
                    if (!response.ok) {
                        return c.json({ error: response.error }, 500);
                    }
                    return c.json(response.collection, 200);
    }
    )
    .post("/create",
        authMiddleWare,
        zValidator("json", CollectionSchema.Insert),
        async (c) => {
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
    }
    )
    .put("/:id",
        authMiddleWare,
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        zValidator("json", CollectionSchema.Update),
        async (c) => {
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
    }
    )
    .delete("/:id",
        authMiddleWare,
        zValidator("param", z.object({
                id: z.string().nonempty(),
            })),
        async (c) => {
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
    }
    );

export default app;
