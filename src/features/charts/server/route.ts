import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getAllChartsWithCollectionId } from "../api/getAllChartsWithCollectionId";

const app = new Hono().get(
    "/all",
    zValidator(
        "query",
        z.object({
            collectionId: z.string().nonempty(),
        })
    ),
    async (c) => {
        const { collectionId } = c.req.valid("query");

        const charts = await getAllChartsWithCollectionId(collectionId);

        return c.json({ message: "Hello, World!" }, 200);
    }
);

export default app;
