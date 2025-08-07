import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";

import collectionRoutes from "@/modules/collection/api/routes";

export const dynamic = "force-dynamic";

const app = new Hono().basePath("/api/v1");

// Global error handler
app.onError((err, c) => {
    // eslint-disable-next-line no-console
    console.error("[API Error]", err.message || err);

    if (err instanceof HTTPException) {
        return err.getResponse();
    }

    return c.json(
        { error: "Internal Server Error", message: err.message },
        500
    );
});

// Route definitions
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/collections", collectionRoutes);

// Export handlers and types
export type AppType = typeof routes;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
